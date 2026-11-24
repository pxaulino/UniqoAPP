import { AcademicForm, FormButton } from '@/components/academic/AcademicForm';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const { activePeriodId, plan, subjects } = useAcademicStore((state) => state.data);
  const ungraded = subjects.filter(({ periodId, grade, enrollment }) =>
    activePeriodId !== null && periodId === activePeriodId && grade === null && enrollment === 'in_progress');
  return (
    <AcademicForm title="Recordatorios">
      {!plan ? (
        <FormButton label="Configurar tu pensum" onPress={() => router.push('/agregar-universidad')} />
      ) : (
        <>
          {!ungraded.length ? <Text className="text-muted">No tienes recordatorios para el período activo.</Text> : null}
          {ungraded.map((subject) => <FormButton key={subject.id} label={'Registrar nota de ' + subject.name} kind="secondary"
            onPress={() => router.push({ pathname: '/editar-materia', params: { id: subject.id } })} />)}
        </>
      )}
    </AcademicForm>
  );
}
