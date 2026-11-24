export interface Profile {
  name: string;
  email: string;
}

export interface StudyPlan {
  university: string;
  career: string;
  curriculum: string;
  requiredCredits: number | null;
}

export interface GradeRules {
  minimum: number;
  maximum: number;
  passing: number;
  weightedByCredits: boolean;
  includeFailed: boolean;
}

export interface Period {
  id: string;
  name: string;
  maxCredits: number | null;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  periodId: string | null;
  enrollment: 'pending' | 'in_progress' | 'withdrawn';
  grade: number | null;
  prerequisites: string[];
}

export interface ClassMeeting {
  subjectId: string;
  day: number;
  startTime: string;
  endTime: string;
  mode: 'Presencial' | 'Virtual';
}

export interface AcademicData {
  profile: Profile | null;
  plan: StudyPlan | null;
  rules: GradeRules;
  periods: Period[];
  activePeriodId: string | null;
  subjects: Subject[];
  meetings: ClassMeeting[];
}

export type Result<T = void> = { ok: true; value: T } | { ok: false; error: string };
export const success = <T>(value: T): Result<T> => ({ ok: true, value });
export const failure = (error: string): Result<never> => ({ ok: false, error });

export const DEFAULT_RULES: GradeRules = {
  minimum: 0,
  maximum: 100,
  passing: 70,
  weightedByCredits: true,
  includeFailed: true,
};

export function emptyAcademicData(): AcademicData {
  return {
    profile: null,
    plan: null,
    rules: { ...DEFAULT_RULES },
    periods: [],
    activePeriodId: null,
    subjects: [],
    meetings: [],
  };
}

export function parseDecimal(input: string): number {
  const normalized = input.trim().replace(',', '.');
  return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized) ? Number(normalized) : NaN;
}

export function optionalDecimal(input: string): number | null {
  return input.trim() ? parseDecimal(input) : null;
}

export function meetingMinutes(time: string): number {
  if (!/^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$/.test(time)) return NaN;
  return (Number(time.slice(0, 2)) % 12 + (time.endsWith('PM') ? 12 : 0)) * 60 + Number(time.slice(3, 5));
}
