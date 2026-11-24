const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { chromium } = require('playwright');

const baseURL = process.env.UNIQO_WEB_URL ?? 'http://localhost:8087';
const origin = new URL(baseURL).origin;
const options = { baseURL, viewport: { width: 390, height: 780 } };
let browser;

before(async () => {
  const channel = process.env.UNIQO_BROWSER_CHANNEL;
  browser = await chromium.launch(channel ? { channel } : {});
});
after(async () => { await browser?.close(); });

function button(page, name) {
  return page.getByRole('button', { name, exact: true }).and(
    page.locator(':not([inert], [inert] *)'),
  );
}

function field(page, name) {
  return page.getByLabel(name, { exact: true });
}

async function fill(page, fields) {
  for (const [name, value] of Object.entries(fields)) await field(page, name).fill(value);
}

async function visible(page, text, timeout = 15000) {
  await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout });
}

async function assertLocalNavigation(context) {
  const externalRequests = [];
  await context.route('**/*', (route) => {
    const requested = new URL(route.request().url());
    if (requested.origin === origin) return route.continue();
    externalRequests.push(requested.origin);
    return route.abort();
  });
  return externalRequests;
}

test('creates a local profile and curriculum, edits a grade, calculates progress, and survives reopening', { timeout: 240000 }, async (t) => {
  const context = await browser.newContext(options);
  t.after(() => context.close());
  const externalRequests = await assertLocalNavigation(context);
  let page = await context.newPage();
  const errors = [];
  const trackErrors = () => page.on('pageerror', (error) => errors.push(error.stack ?? error.message));
  trackErrors();
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Hola, Estudiante', 45000);
  await button(page, 'Crear perfil').click();
  await fill(page, { Nombre: 'Ada Prueba', 'Correo académico (opcional)': 'ada@example.test' });
  await button(page, 'Guardar perfil').click();
  await visible(page, 'Hola, Ada');

  await button(page, 'Agregar universidad y pensum').click();
  await fill(page, {
    Universidad: 'Universidad de Prueba',
    Carrera: 'Sistemas',
    'Pensum o versión': '2026',
    'Créditos requeridos (opcional)': '20',
    'Nota máxima': '4',
    'Nota para aprobar': '2,5',
  });
  await button(page, 'Guardar pensum').click();
  await visible(page, 'Resumen del pensum');
  await button(page, 'Ir a Mis estudios').click();
  await button(page, 'Agregar período').click();
  await fill(page, { 'Nombre del período': '2026-2', 'Límite de créditos (opcional)': '18' });
  await button(page, 'Guardar período').click();
  await button(page, '2026-2').waitFor({ state: 'visible' });
  await button(page, 'Agregar materia').click();
  await fill(page, {
    'Código de materia': 'mat101',
    'Nombre de materia': 'Álgebra',
    'Créditos de materia': '4',
    'Nota final (opcional)': '5',
  });
  await button(page, 'Guardar materia').click();
  await visible(page, 'La nota de MAT101 debe estar entre 0 y 4.');
  await field(page, 'Nota final (opcional)').fill('3,5');
  await button(page, 'Guardar materia').click();
  await visible(page, '4 créditos · Aprobada');
  await page.getByRole('button', { name: /Álgebra/ }).click();
  await visible(page, '2026-2 · Nota final: 3.5 / 4');
  const subjectURL = page.url();
  await button(page, 'Editar materia y nota').click();
  await field(page, 'Nota final (opcional)').fill('3,8');
  await button(page, 'Guardar materia').click();
  await visible(page, '2026-2 · Nota final: 3.8 / 4');

  await page.close();
  page = await context.newPage();
  trackErrors();
  await page.goto(subjectURL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, '2026-2 · Nota final: 3.8 / 4');
  await page.goto('/progreso', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, '4 / 20');
  await visible(page, '3.80');
  await visible(page, '20%');
  await page.goto('/cuenta', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Ada Prueba');
  await visible(page, 'Universidad de Prueba');
  assert.deepEqual(externalRequests, []);
  assert.deepEqual(errors, []);
});

test('opens an unknown subject safely and confirms a local reset', { timeout: 120000 }, async (t) => {
  const context = await browser.newContext(options);
  t.after(() => context.close());
  const page = await context.newPage();
  await page.goto('/materia/unknown', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Materia no encontrada');
  await button(page, 'Volver').click();
  await visible(page, 'Mis estudios');
  await page.goto('/perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await field(page, 'Nombre').fill('Perfil temporal');
  await button(page, 'Guardar perfil').click();
  await page.goto('/perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
  assert.equal(await field(page, 'Nombre').inputValue(), 'Perfil temporal');
  await button(page, 'Reiniciar datos demo').click();
  await button(page, 'Cancelar').click();
  assert.equal(await field(page, 'Nombre').inputValue(), 'Perfil temporal');
  await button(page, 'Reiniciar datos demo').click();
  await button(page, 'Confirmar: reiniciar datos demo').click();
  await visible(page, 'Hola, Estudiante');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Hola, Estudiante');
});

test('opens the academic center and saves a subject to the schedule', { timeout: 120000 }, async (t) => {
  const context = await browser.newContext(options);
  t.after(() => context.close());
  const page = await context.newPage();
  await page.addInitScript(() => {
    if (localStorage.getItem('uniqo.academic')) return;
    localStorage.setItem('uniqo.academic', JSON.stringify({
      version: 1,
      data: {
        profile: { name: 'Ada', email: '' },
        plan: { university: 'INTEC', career: 'Sistemas', curriculum: '2026', requiredCredits: 20 },
        rules: { minimum: 0, maximum: 100, passing: 70, weightedByCredits: true, includeFailed: true },
        periods: [],
        activePeriodId: null,
        subjects: [{
          id: 'mat1', code: 'MAT1', name: 'Matemáticas de prueba', credits: 4,
          periodId: null, enrollment: 'in_progress', grade: null, prerequisites: [],
        }],
        meetings: [],
      },
    }));
  });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await button(page, 'Centro académico').click();
  await visible(page, 'Centro Academico');
  await page.getByText('Horario', { exact: true }).click();
  await visible(page, 'Horario');
  await page.getByText('Agregar materia', { exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Matemáticas de prueba', { exact: true }).click();
  await dialog.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  await visible(page, 'Materia actualizada en el horario');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Matemáticas de prueba');
  const meetings = await page.evaluate(() => JSON.parse(localStorage.getItem('uniqo.academic')).data.meetings);
  assert.deepEqual(meetings, [{ subjectId: 'mat1', day: 1, startTime: '08:00 AM', endTime: '10:00 AM', mode: 'Presencial' }]);
});

test('recovers the last valid browser snapshot when the primary is damaged', { timeout: 120000 }, async (t) => {
  const context = await browser.newContext(options);
  t.after(() => context.close());
  const page = await context.newPage();
  await page.goto('/perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await field(page, 'Nombre').fill('Primera versión');
  await button(page, 'Guardar perfil').click();
  await field(page, 'Nombre').waitFor({ state: 'hidden' });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Hola, Primera');
  await page.goto('/perfil', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await field(page, 'Nombre').fill('Segunda versión');
  await button(page, 'Guardar perfil').click();
  await field(page, 'Nombre').waitFor({ state: 'hidden' });
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Hola, Segunda');
  await page.evaluate(() => localStorage.setItem('uniqo.academic', '{corrupt'));
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
  await visible(page, 'Hola, Primera');
  await visible(page, 'Se recuperó una copia local de tus datos.');
  assert.equal(await page.evaluate(() => localStorage.getItem('uniqo.academic.recovery')), '{corrupt');
});
