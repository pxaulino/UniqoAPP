import { AcademicForm, FormButton } from '@/components/academic/AcademicForm';
import { subjectStatus } from '@/src/academic/calculations';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function SuggestionsScreen() {
  const router = useRouter();
  const { subjects, rules } = useAcademicStore((state) => state.data);
  const approved = new Set(subjects.filter((subject) => subjectStatus(subject, rules) === 'approved').map(({ id }) => id));
  const candidates = subjects.filter((subject) => {
    const status = subjectStatus(subject, rules);
    return (status === 'pending' || status === 'failed') && subject.prerequisites.every((id) => approved.has(id));
  });
  return (
    <AcademicForm title="Sugerencias del ciclo" fallback="/(tabs)/planner">
      <Text className="mb-3 text-muted">Materias por completar cuyos prerrequisitos ya están aprobados.</Text>
      {!candidates.length ? <Text className="font-semibold text-text">No hay materias disponibles en este momento.</Text> : null}
      {candidates.map((subject) => (
        <View key={subject.id} className="mb-3 border-b border-bg pb-4">
          <Text className="font-bold text-text">{subject.name} · {subject.credits} créditos</Text>
          <FormButton label={'Ver ' + subject.code} kind="secondary" onPress={() => router.push({ pathname: '/materia/[id]', params: { id: subject.id } })} />
        </View>
      ))}
    </AcademicForm>
  );
}
