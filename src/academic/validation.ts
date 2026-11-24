import { AcademicData, ClassMeeting, failure, GradeRules, meetingMinutes, Period, Profile, Result, StudyPlan, Subject, success } from './model';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown, max = 120): value is string {
  return typeof value === 'string' && value.length <= max && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPositive(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

export function isId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value);
}

function isProfile(value: unknown): value is Profile {
  return isRecord(value) && isText(value.name) && typeof value.email === 'string' &&
    (value.email === '' || (value.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)));
}

function isPlan(value: unknown): value is StudyPlan {
  return isRecord(value) && isText(value.university) && isText(value.career) && isText(value.curriculum) &&
    (value.requiredCredits === null || isPositive(value.requiredCredits));
}

function isRules(value: unknown): value is GradeRules {
  return isRecord(value) && isNumber(value.minimum) && isNumber(value.maximum) && isNumber(value.passing) &&
    value.maximum > value.minimum && value.passing >= value.minimum && value.passing <= value.maximum &&
    typeof value.weightedByCredits === 'boolean' && typeof value.includeFailed === 'boolean';
}

function isPeriod(value: unknown): value is Period {
  return isRecord(value) && isId(value.id) && isText(value.name) &&
    (value.maxCredits === null || isPositive(value.maxCredits));
}

function isSubject(value: unknown): value is Subject {
  return isRecord(value) && isId(value.id) && isText(value.name) && isText(value.code, 40) &&
    isNumber(value.credits) && value.credits >= 0 && (value.periodId === null || isId(value.periodId)) &&
    (value.enrollment === 'pending' || value.enrollment === 'in_progress' || value.enrollment === 'withdrawn') &&
    (value.grade === null || (isNumber(value.grade) && value.enrollment !== 'withdrawn')) &&
    Array.isArray(value.prerequisites) && value.prerequisites.every(isId);
}

function isMeeting(value: unknown): value is ClassMeeting {
  return isRecord(value) && isId(value.subjectId) && isNumber(value.day) && Number.isInteger(value.day) &&
    value.day >= 1 && value.day <= 7 && (value.mode === 'Presencial' || value.mode === 'Virtual') &&
    typeof value.startTime === 'string' && typeof value.endTime === 'string' &&
    meetingMinutes(value.startTime) < meetingMinutes(value.endTime);
}

function hasPrerequisiteCycle(subjects: Subject[]) {
  const prerequisites = new Map(subjects.map((subject) => [subject.id, subject.prerequisites]));
  const visited = new Set<string>();
  const path = new Set<string>();
  function visit(id: string): boolean {
    if (path.has(id)) return true;
    if (visited.has(id)) return false;
    path.add(id);
    if (prerequisites.get(id)?.some(visit)) return true;
    path.delete(id);
    visited.add(id);
    return false;
  }
  return subjects.some((subject) => visit(subject.id));
}

export function validateAcademicData(value: unknown): Result<AcademicData> {
  if (!isRecord(value)) return failure('Los datos académicos tienen un formato inválido.');
  const { profile, plan, rules, periods, activePeriodId, subjects, meetings } = value;
  if (profile !== null && !isProfile(profile)) {
    return failure('Completa el nombre y revisa el formato del correo, si lo incluyes.');
  }
  if (plan !== null && !isPlan(plan)) {
    return failure('Completa universidad, carrera y pensum. El total de créditos debe ser positivo o estar vacío.');
  }
  if (!isRules(rules)) return failure('La nota máxima debe superar a la mínima y el umbral debe estar dentro de la escala.');
  if (!Array.isArray(periods) || !periods.every(isPeriod)) {
    return failure('Indica un nombre de período y un límite de créditos positivo o vacío.');
  }
  if (!Array.isArray(subjects) || !subjects.every(isSubject)) {
    return failure('Indica código, nombre, créditos válidos y un estado compatible con la nota.');
  }

  const periodIds = new Set(periods.map((period) => period.id));
  const periodNames = new Set(periods.map((period) => period.name.trim().toLowerCase()));
  if (periodIds.size !== periods.length || periodNames.size !== periods.length) {
    return failure('Ya existe un período con ese nombre o identificador.');
  }
  if (activePeriodId !== null && (!isId(activePeriodId) || !periodIds.has(activePeriodId))) {
    return failure('Selecciona un período activo existente.');
  }
  const subjectIds = new Set(subjects.map((subject) => subject.id));
  const codes = new Set(subjects.map((subject) => subject.code.trim().toUpperCase()));
  if (subjectIds.size !== subjects.length || codes.size !== subjects.length) {
    return failure('Ya existe una materia con ese código o identificador.');
  }
  for (const subject of subjects) {
    if (subject.periodId !== null && !periodIds.has(subject.periodId)) {
      return failure('Selecciona un período existente para la materia.');
    }
    if (subject.grade !== null && (subject.grade < rules.minimum || subject.grade > rules.maximum)) {
      return failure(`La nota de ${subject.code} debe estar entre ${rules.minimum} y ${rules.maximum}.`);
    }
    if (new Set(subject.prerequisites).size !== subject.prerequisites.length ||
        subject.prerequisites.some((id) => !subjectIds.has(id))) {
      return failure(`Revisa los prerrequisitos de ${subject.code}.`);
    }
  }
  if (hasPrerequisiteCycle(subjects)) return failure('Las materias no pueden tener prerrequisitos circulares.');
  if (!Array.isArray(meetings) || !meetings.every(isMeeting)) {
    return failure('Revisa que la hora de inicio sea anterior a la hora de fin.');
  }
  const scheduled = new Set(meetings.map(({ subjectId }) => subjectId));
  if (scheduled.size !== meetings.length || meetings.some(({ subjectId }) => !subjectIds.has(subjectId))) {
    return failure('Cada entrada del horario debe corresponder a una materia distinta del pensum.');
  }
  return success({ profile, plan, rules, periods, activePeriodId, subjects, meetings });
}
