import { AcademicData, GradeRules, Subject } from './model';

export type SubjectStatus = 'pending' | 'in_progress' | 'withdrawn' | 'approved' | 'failed';

export const STATUS_LABELS: Record<SubjectStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En curso',
  withdrawn: 'Retirada',
  approved: 'Aprobada',
  failed: 'Reprobada',
};

export function subjectStatus(subject: Subject, rules: GradeRules): SubjectStatus {
  if (subject.grade === null || subject.enrollment === 'withdrawn') return subject.enrollment;
  return subject.grade >= rules.passing ? 'approved' : 'failed';
}

export function sumCredits(subjects: readonly Subject[]) {
  return normalizeCredits(subjects.reduce((sum, subject) => sum + subject.credits, 0));
}

function normalizeCredits(value: number) {
  return Number(value.toPrecision(15));
}

export function calculateAverage(subjects: readonly Subject[], rules: GradeRules): number | null {
  let total = 0;
  let weights = 0;
  for (const subject of subjects) {
    if (subject.grade === null || subject.enrollment === 'withdrawn') continue;
    if (!rules.includeFailed && subject.grade < rules.passing) continue;
    const weight = rules.weightedByCredits ? subject.credits : 1;
    total += subject.grade * weight;
    weights += weight;
  }
  return weights === 0 ? null : total / weights;
}

export function formatAverage(average: number | null) {
  return average === null ? '—' : average.toFixed(2);
}

export function summarizeAcademicData({ plan, rules, subjects }: AcademicData) {
  const approved = subjects.filter((subject) => subjectStatus(subject, rules) === 'approved');
  const inProgress = subjects.filter((subject) => subjectStatus(subject, rules) === 'in_progress');
  const earnedCredits = sumCredits(approved);
  const totalCredits = plan?.requiredCredits ?? sumCredits(subjects);
  return {
    approved: approved.length,
    inProgress: inProgress.length,
    remaining: subjects.length - approved.length - inProgress.length,
    totalSubjects: subjects.length,
    earnedCredits,
    totalCredits,
    remainingCredits: Math.max(0, normalizeCredits(totalCredits - earnedCredits)),
    percent: totalCredits > 0 ? Math.min(100, Math.round(earnedCredits / totalCredits * 1000) / 10) : 0,
    average: calculateAverage(subjects, rules),
  };
}
