const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createAcademicStore } = require('../.expo/academic-tests/academicStore');
const { calculateAverage, subjectStatus, summarizeAcademicData } = require('../.expo/academic-tests/calculations');
const { DEFAULT_RULES, emptyAcademicData, parseDecimal } = require('../.expo/academic-tests/model');
const { BACKUP_KEY, DATA_KEY, RECOVERY_KEY, serialize } = require('../.expo/academic-tests/persistence');
const { validateAcademicData } = require('../.expo/academic-tests/validation');

const plan = { university: 'Universidad de prueba', career: 'Sistemas', curriculum: '2026', requiredCredits: 20 };

function subject(code = 'MAT101', overrides = {}) {
  return { code, name: 'Materia ' + code, credits: 4, periodId: null, enrollment: 'pending', grade: null, prerequisites: [], ...overrides };
}

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    readError: false,
    failKey: '',
    async getItem(key) {
      if (this.readError) throw new Error('Reading unavailable');
      return values.get(key) ?? null;
    },
    async setItem(key, value) {
      if (key === this.failKey) throw new Error('Writing unavailable');
      values.set(key, value);
    },
  };
}

function value(result) {
  assert.ok(result.ok, result.error);
  return result.value;
}

async function open(storage = memoryStorage()) {
  const store = createAcademicStore(storage);
  value(await store.getState().initialize());
  return store;
}

test('calculates credits, status, progress, and weighted average with the configured threshold', () => {
  const subjects = [
    subject('A', { id: 'a', grade: 70 }),
    subject('B', { id: 'b', grade: 55, credits: 2 }),
    subject('C', { id: 'c', enrollment: 'in_progress' }),
    subject('D', { id: 'd', enrollment: 'withdrawn' }),
    subject('E', { id: 'e', grade: 100, credits: 0 }),
  ];
  const data = { ...emptyAcademicData(), plan, subjects };
  assert.deepEqual(summarizeAcademicData(data), {
    approved: 2, inProgress: 1, remaining: 2, totalSubjects: 5,
    earnedCredits: 4, totalCredits: 20, remainingCredits: 16, percent: 20, average: 65,
  });
  assert.equal(subjectStatus(subjects[1], DEFAULT_RULES), 'failed');
  assert.equal(calculateAverage(subjects, { ...DEFAULT_RULES, includeFailed: false }), 70);
  assert.equal(calculateAverage(subjects, { ...DEFAULT_RULES, weightedByCredits: false }), 75);
  assert.equal(calculateAverage([subjects[4]], DEFAULT_RULES), null);
});

test('supports decimal scales, zero grades, empty data and an optional credit target', () => {
  const rules = { ...DEFAULT_RULES, maximum: 4, passing: 2.5 };
  const subjects = [
    subject('A', { id: 'a', grade: 2.5, credits: 1.5 }),
    subject('B', { id: 'b', grade: 0, credits: 0.5 }),
  ];
  const data = { ...emptyAcademicData(), rules, subjects };
  assert.equal(validateAcademicData(data).ok, true);
  assert.equal(summarizeAcademicData(data).percent, 75);
  assert.equal(summarizeAcademicData(data).average, 1.875);
  assert.equal(summarizeAcademicData({ ...data, plan: { ...plan, requiredCredits: 1 } }).percent, 100);
  assert.equal(summarizeAcademicData(emptyAcademicData()).percent, 0);
  assert.equal(summarizeAcademicData(emptyAcademicData()).average, null);
  assert.equal(summarizeAcademicData({
    ...data,
    subjects: [subject('A', { id: 'a', grade: 4, credits: 0.004 })],
  }).percent, 100);
  assert.equal(parseDecimal(' 2,5 '), 2.5);
  for (const input of ['', '1e2', 'Infinity', '12a', '1,2.3']) assert.ok(Number.isNaN(parseDecimal(input)));
});

test('validates required fields, grades, states and relationships before saving', async () => {
  const store = await open();
  const actions = store.getState();
  assert.equal((await actions.saveProfile({ name: ' ', email: '' })).ok, false);
  assert.equal((await actions.saveProfile({ name: 'Ada', email: 'bad' })).ok, false);
  assert.equal((await actions.savePlan({ ...plan, requiredCredits: 0 }, DEFAULT_RULES)).ok, false);
  assert.equal((await actions.savePlan(plan, { ...DEFAULT_RULES, passing: 101 })).ok, false);
  assert.equal((await actions.saveSubject(subject())).ok, false);
  value(await actions.savePlan(plan, DEFAULT_RULES));
  assert.equal((await actions.saveSubject(subject('A', { credits: -2 }))).ok, false);
  assert.equal((await actions.saveSubject(subject('A', { grade: 101 }))).ok, false);
  assert.equal((await actions.saveSubject(subject('A', { grade: 80, enrollment: 'withdrawn' }))).ok, false);
  assert.equal((await actions.saveSubject(subject('A', { periodId: 'unknown' }))).ok, false);
  assert.equal((await actions.saveSubject(subject('A', { prerequisites: ['unknown'] }))).ok, false);
  assert.equal(store.getState().data.subjects.length, 0);
});

test('profile, plan, period and subject CRUD survive reopening, including decimal grades', async () => {
  const storage = memoryStorage();
  const store = await open(storage);
  const actions = store.getState();
  const rules = { ...DEFAULT_RULES, maximum: 4, passing: 2.5 };
  value(await actions.saveProfile({ name: ' Ada Lovelace ', email: 'ada@example.test' }));
  value(await actions.savePlan(plan, rules));
  const periodId = value(await actions.savePeriod({ name: '2026-2', maxCredits: 18 }, true));
  const id = value(await actions.saveSubject(subject(' mat101 ', { periodId })));
  assert.equal((await actions.saveSubject(subject('MAT101'))).ok, false);
  assert.equal((await actions.removePeriod(periodId)).ok, false);
  value(await actions.saveSubject(subject('MAT101', { id, name: 'Álgebra', credits: 3, periodId, grade: 3.5 })));
  value(await actions.savePeriod({ id: periodId, name: '2026-3', maxCredits: null }, true));

  const reopened = await open(storage);
  const { data, removeSubject, removePeriod } = reopened.getState();
  assert.equal(data.profile.name, 'Ada Lovelace');
  assert.equal(data.plan.curriculum, '2026');
  assert.equal(data.activePeriodId, periodId);
  assert.equal(data.periods[0].name, '2026-3');
  assert.equal(data.subjects[0].name, 'Álgebra');
  assert.equal(data.subjects[0].grade, 3.5);
  assert.equal(summarizeAcademicData(data).earnedCredits, 3);
  assert.equal(summarizeAcademicData(data).percent, 15);
  value(await removeSubject(id));
  value(await removePeriod(periodId));
  const finalData = (await open(storage)).getState().data;
  assert.equal(finalData.subjects.length, 0);
  assert.equal(finalData.periods.length, 0);
  assert.equal(finalData.activePeriodId, null);
});

test('approval is atomic and editing, repeating or changing the threshold does not double-count credits', async () => {
  const store = await open();
  const actions = store.getState();
  value(await actions.savePlan(plan, DEFAULT_RULES));
  const id = value(await actions.saveSubject(subject()));
  assert.equal((await actions.approveSubjects([id, 'missing'], 80)).ok, false);
  assert.equal((await actions.approveSubjects([id], 69)).ok, false);
  assert.equal(store.getState().data.subjects[0].grade, null);
  value(await actions.approveSubjects([id, id], 80));
  value(await actions.approveSubjects([id], 85));
  assert.equal(summarizeAcademicData(store.getState().data).earnedCredits, 4);
  assert.equal((await actions.savePlan(plan, { ...DEFAULT_RULES, maximum: 4, passing: 3 })).ok, false);
  value(await actions.savePlan(plan, { ...DEFAULT_RULES, passing: 90 }));
  assert.equal(summarizeAcademicData(store.getState().data).earnedCredits, 0);
});

test('rejects cycles and invalid meeting hours, and removes references when deleting a subject', async () => {
  const storage = memoryStorage();
  const store = await open(storage);
  const actions = store.getState();
  value(await actions.savePlan(plan, DEFAULT_RULES));
  const id = value(await actions.saveSubject(subject('A')));
  const dependent = value(await actions.saveSubject(subject('B', { prerequisites: [id] })));
  assert.equal((await actions.saveSubject(subject('A', { id, prerequisites: [dependent] }))).ok, false);
  assert.equal((await actions.saveMeeting({ subjectId: id, day: 1, startTime: '10:00 AM', endTime: '08:00 AM', mode: 'Virtual' })).ok, false);
  const meeting = { subjectId: id, day: 7, startTime: '11:00 AM', endTime: '12:00 PM', mode: 'Presencial' };
  value(await actions.saveMeeting(meeting));
  assert.deepEqual((await open(storage)).getState().data.meetings, [meeting]);
  value(await actions.removeSubject(id));
  assert.deepEqual(store.getState().data.subjects[0].prerequisites, []);
  assert.deepEqual(store.getState().data.meetings, []);
});

test('serializes writes and leaves the visible and persisted state unchanged on failure', async () => {
  const storage = memoryStorage();
  const store = await open(storage);
  const actions = store.getState();
  value(await actions.savePlan(plan, DEFAULT_RULES));
  const changes = await Promise.all([actions.saveSubject(subject('A')), actions.saveSubject(subject('B'))]);
  changes.forEach(value);
  storage.failKey = DATA_KEY;
  assert.equal((await actions.saveSubject(subject('C'))).ok, false);
  assert.equal(store.getState().data.subjects.length, 2);
  assert.equal((await open(storage)).getState().data.subjects.length, 2);
  storage.failKey = '';
  value(await actions.saveSubject(subject('C')));
  assert.equal((await open(storage)).getState().data.subjects.length, 3);
});

test('migrates version 0 and recovers a corrupt primary from the last good copy', async () => {
  const legacy = JSON.stringify({ version: 0, data: { profile: { name: 'Ada', email: '' }, rules: { passing: 75 } } });
  const storage = memoryStorage({ [DATA_KEY]: legacy });
  const store = await open(storage);
  assert.equal(store.getState().data.rules.passing, 75);
  assert.equal(JSON.parse(storage.values.get(DATA_KEY)).version, 1);
  assert.equal(storage.values.get(BACKUP_KEY), legacy);

  storage.values.set(DATA_KEY, '{broken');
  const recovered = await open(storage);
  assert.equal(recovered.getState().recovered, true);
  assert.equal(recovered.getState().data.profile.name, 'Ada');
  assert.equal(storage.values.get(RECOVERY_KEY), '{broken');
  assert.equal((await open(storage)).getState().recovered, false);
});

test('read failures and unknown versions preserve storage until an explicit reset', async () => {
  const future = JSON.stringify({ version: 10, data: { extra: true } });
  const storage = memoryStorage({ [DATA_KEY]: future, [BACKUP_KEY]: serialize(emptyAcademicData()) });
  const store = createAcademicStore(storage);
  const actions = store.getState();
  storage.readError = true;
  assert.equal((await actions.initialize()).ok, false);
  storage.readError = false;
  assert.equal((await actions.initialize()).ok, false);
  assert.equal((await actions.savePlan(plan, DEFAULT_RULES)).ok, false);
  assert.equal(storage.values.get(DATA_KEY), future);
  value(await actions.reset());
  assert.equal(JSON.parse(storage.values.get(RECOVERY_KEY)).primary, future);
  assert.deepEqual((await open(storage)).getState().data, emptyAcademicData());
});

test('explicit reset clears both current and backup demo progress', async () => {
  const storage = memoryStorage();
  const store = await open(storage);
  const actions = store.getState();
  value(await actions.savePlan(plan, DEFAULT_RULES));
  value(await actions.saveSubject(subject('A', { grade: 100 })));
  value(await actions.reset());
  assert.deepEqual((await open(storage)).getState().data, emptyAcademicData());
  storage.values.set(DATA_KEY, 'corrupt');
  assert.deepEqual((await open(storage)).getState().data, emptyAcademicData());
});
