import { AcademicForm, FormButton } from '@/components/academic/AcademicForm';
import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function AcademicAssistantScreen() {
  const router = useRouter();
  const { plan } = useAcademicStore((state) => state.data);
  const { approved, remainingCredits } = useAcademicSummary();
  return (
    <AcademicForm title="Asistente académico">
      <Text className="mb-3 font-semibold text-text">
        {plan ? 'Has aprobado ' + approved + ' materias. Te faltan ' + remainingCredits + ' créditos.' : 'Configura tu pensum para ver tus próximos pasos.'}
      </Text>
      {plan ? (
        <>
          <FormButton label="Ver materias sugeridas" onPress={() => router.push('/recomendaciones')} />
          <FormButton label="Simular un cambio de nota" kind="secondary" onPress={() => router.dismissTo('/(tabs)/simulador')} />
        </>
      ) : <FormButton label="Configurar pensum" onPress={() => router.push('/agregar-universidad')} />}
    </AcademicForm>
  );
}
