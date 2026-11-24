import { AcademicForm } from '@/components/academic/AcademicForm';
import Card from '@/components/ui/Card';
import { calculateAverage, formatAverage, subjectStatus, sumCredits } from '@/src/academic/calculations';
import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';
import { Text } from 'react-native';

export default function AdvancedStatisticsScreen() {
  const { subjects, periods, rules } = useAcademicStore((state) => state.data);
  const summary = useAcademicSummary();
  const graded = subjects.filter(({ grade }) => grade !== null);
  return (
    <AcademicForm title="Métricas" fallback="/(tabs)/progreso">
      <Text className="text-[14px] font-bold text-primary">Promedio general</Text>
      <Text className="my-2 text-[30px] font-bold text-text">{formatAverage(summary.average)} / {rules.maximum}</Text>
      <Text className="mb-4 font-semibold text-muted">
        Tasa de aprobación: {graded.length ? Math.round(summary.approved / graded.length * 100) + '%' : '—'}
      </Text>
      {periods.map((period) => {
        const items = subjects.filter(({ periodId }) => periodId === period.id);
        const approved = items.filter((subject) => subjectStatus(subject, rules) === 'approved');
        return (
          <Card key={period.id} padding={14} radius={18} className="mb-3" style={{ backgroundColor: '#F0EDFF' }}>
            <Text className="text-[15px] font-bold text-text">{period.name}</Text>
            <Text className="mt-1 font-semibold text-muted">
              {sumCredits(approved)} créditos aprobados · Promedio {formatAverage(calculateAverage(items, rules))}
            </Text>
          </Card>
        );
      })}
    </AcademicForm>
  );
}
