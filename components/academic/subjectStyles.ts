import { COLORS } from '@/constants/mockData';
import { SubjectStatus } from '@/src/academic/calculations';

export const STATUS_COLORS: Record<SubjectStatus, string> = {
  approved: COLORS.success,
  pending: COLORS.secondary,
  in_progress: COLORS.warning,
  failed: COLORS.danger,
  withdrawn: COLORS.muted,
};
