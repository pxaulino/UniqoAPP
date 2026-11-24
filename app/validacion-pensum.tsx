import { AcademicForm, FormButton } from '@/components/academic/AcademicForm';
import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function ReviewPlanScreen() {
  const router = useRouter();
  const { plan, periods } = useAcademicStore((state) => state.data);
  const summary = useAcademicSummary();
  return (
    <AcademicForm title="Resumen del pensum" fallback="/(tabs)/universidades">
      {plan ? (
        <>
          <Text className="text-[19px] font-bold text-text">{plan.curriculum}</Text>
          <Text className="mt-1 text-muted">{plan.career} · {plan.university}</Text>
          <Text className="my-4 font-semibold text-primary">{summary.totalSubjects} materias · {summary.totalCredits} créditos · {periods.length} períodos</Text>
          <FormButton label="Ir a Mis estudios" onPress={() => router.dismissTo('/(tabs)/planner')} />
          <FormButton label="Ver mapa del pensum" kind="secondary" onPress={() => router.dismissTo('/(tabs)/mapa')} />
        </>
      ) : <FormButton label="Configurar pensum" onPress={() => router.replace('/agregar-universidad')} />}
    </AcademicForm>
  );
}
