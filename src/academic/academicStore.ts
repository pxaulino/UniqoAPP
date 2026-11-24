import { createStore } from 'zustand/vanilla';
import { AcademicData, ClassMeeting, emptyAcademicData, failure, GradeRules, Period, Profile, Result, StudyPlan, Subject, success } from './model';
import { AcademicStorage, loadAcademicData, resetAcademicData, saveAcademicData } from './persistence';
import { validateAcademicData } from './validation';

type Draft<T extends { id: string }> = Omit<T, 'id'> & { id?: string };

interface AcademicState {
  data: AcademicData;
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  recovered: boolean;
  initialize(): Promise<Result>;
  saveProfile(profile: Profile): Promise<Result>;
  savePlan(plan: StudyPlan, rules: GradeRules): Promise<Result>;
  savePeriod(period: Draft<Period>, makeActive: boolean): Promise<Result<string>>;
  removePeriod(id: string): Promise<Result>;
  saveSubject(subject: Draft<Subject>): Promise<Result<string>>;
  removeSubject(id: string): Promise<Result>;
  saveMeeting(meeting: ClassMeeting): Promise<Result>;
  removeMeeting(subjectId: string): Promise<Result>;
  approveSubjects(ids: string[], grade: number): Promise<Result>;
  reset(): Promise<Result>;
}

function newId(existing: readonly { id: string }[]) {
  let id: string;
  do {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  } while (existing.some((item) => item.id === id));
  return id;
}

function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some(({ id }) => id === item.id)
    ? items.map((old) => old.id === item.id ? item : old)
    : [...items, item];
}

export function createAcademicStore(storage: AcademicStorage) {
  return createStore<AcademicState>()((set, get) => {
    let queue: Promise<unknown> = Promise.resolve();

    function enqueue<T>(operation: () => Promise<Result<T>>): Promise<Result<T>> {
      const next = queue.then(operation, operation);
      queue = next;
      return next;
    }

    function update<T>(transform: (data: AcademicData) => Result<{ data: AcademicData; value: T }>) {
      return enqueue(async () => {
        if (get().status !== 'ready') return failure('Espera a que se carguen tus datos locales.');
        const previous = get().data;
        const proposed = transform(previous);
        if (!proposed.ok) return proposed;
        const validated = validateAcademicData(proposed.value.data);
        if (!validated.ok) return validated;
        try {
          await saveAcademicData(storage, validated.value, previous);
          set({ data: validated.value });
          return success(proposed.value.value);
        } catch {
          return failure('No se pudo guardar el cambio en este dispositivo. Vuelve a intentarlo.');
        }
      });
    }

    return {
      data: emptyAcademicData(),
      status: 'loading',
      error: null,
      recovered: false,
      initialize: () => enqueue(async () => {
        if (get().status === 'ready') return success(undefined);
        set({ status: 'loading', error: null });
        try {
          const loaded = await loadAcademicData(storage);
          if (loaded.ok) {
            set({ ...loaded.value, status: 'ready' });
            return success(undefined);
          }
          set({ status: 'error', error: loaded.error });
          return loaded;
        } catch {
          const error = 'El almacenamiento local no está disponible. Revisa los permisos y vuelve a intentarlo.';
          set({ status: 'error', error });
          return failure(error);
        }
      }),
      saveProfile: ({ name, email }) => update((data) => success({
        data: { ...data, profile: { name: name.trim(), email: email.trim() } },
        value: undefined,
      })),
      savePlan: (plan, rules) => update((data) => success({
        data: {
          ...data,
          plan: { ...plan, university: plan.university.trim(), career: plan.career.trim(), curriculum: plan.curriculum.trim() },
          rules: { ...rules },
        },
        value: undefined,
      })),
      savePeriod: (period, makeActive) => update((data) => {
        if (period.id && !data.periods.some(({ id }) => id === period.id)) return failure('El período ya no existe.');
        const id = period.id ?? newId(data.periods);
        const periods = upsert(data.periods, { ...period, id, name: period.name.trim() });
        return success({
          data: {
            ...data,
            periods,
            activePeriodId: makeActive ? id : data.activePeriodId === id ? null : data.activePeriodId,
          },
          value: id,
        });
      }),
      removePeriod: (id) => update((data) => {
        if (data.subjects.some((subject) => subject.periodId === id)) {
          return failure('Mueve las materias del período antes de eliminarlo.');
        }
        return success({
          data: {
            ...data,
            periods: data.periods.filter((period) => period.id !== id),
            activePeriodId: data.activePeriodId === id ? null : data.activePeriodId,
          },
          value: undefined,
        });
      }),
      saveSubject: (subject) => update((data) => {
        if (!data.plan) return failure('Configura tu universidad, carrera y pensum antes de agregar materias.');
        if (subject.id && !data.subjects.some(({ id }) => id === subject.id)) return failure('La materia ya no existe.');
        const id = subject.id ?? newId(data.subjects);
        const subjects = upsert(data.subjects, {
          ...subject, id, name: subject.name.trim(), code: subject.code.trim().toUpperCase(),
          prerequisites: [...subject.prerequisites],
        });
        return success({ data: { ...data, subjects }, value: id });
      }),
      removeSubject: (id) => update((data) => {
        const subjects = data.subjects.filter((subject) => subject.id !== id).map((subject) => ({
          ...subject,
          prerequisites: subject.prerequisites.filter((prerequisite) => prerequisite !== id),
        }));
        const meetings = data.meetings.filter((meeting) => meeting.subjectId !== id);
        return success({ data: { ...data, subjects, meetings }, value: undefined });
      }),
      saveMeeting: (meeting) => update((data) => success({
        data: { ...data, meetings: [...data.meetings.filter(({ subjectId }) => subjectId !== meeting.subjectId), { ...meeting }] },
        value: undefined,
      })),
      removeMeeting: (id) => update((data) => success({
        data: { ...data, meetings: data.meetings.filter(({ subjectId }) => subjectId !== id) },
        value: undefined,
      })),
      approveSubjects: (ids, grade) => update((data) => {
        if (ids.length === 0) return failure('Selecciona al menos una materia.');
        if (!Number.isFinite(grade) || grade < data.rules.passing || grade > data.rules.maximum) {
          return failure(`Indica una nota aprobatoria entre ${data.rules.passing} y ${data.rules.maximum}.`);
        }
        const selected = new Set(ids);
        if (ids.some((id) => !data.subjects.some((subject) => subject.id === id && subject.enrollment !== 'withdrawn'))) {
          return failure('Una materia seleccionada ya no está disponible.');
        }
        const subjects = data.subjects.map((subject) => selected.has(subject.id) ? { ...subject, grade } : subject);
        return success({ data: { ...data, subjects }, value: undefined });
      }),
      reset: () => enqueue(async () => {
        try {
          const data = await resetAcademicData(storage, get().status !== 'ready');
          set({ data, status: 'ready', error: null, recovered: false });
          return success(undefined);
        } catch {
          return failure('No se pudo reiniciar el almacenamiento local. Vuelve a intentarlo.');
        }
      }),
    };
  });
}
