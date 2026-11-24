import { AcademicForm, Choice, ConfirmAction, Field, FormButton, FormError, useBack, useSave } from '@/components/academic/AcademicForm';
import { STATUS_LABELS } from '@/src/academic/calculations';
import { optionalDecimal, parseDecimal, Subject } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

const ENROLLMENTS: Subject['enrollment'][] = ['pending', 'in_progress', 'withdrawn'];

export default function EditSubjectScreen() {
  const { id, period } = useLocalSearchParams<{ id?: string; period?: string }>();
  const router = useRouter();
  const plan = useAcademicStore((state) => state.data.plan);
  const subject = useAcademicStore((state) => state.data.subjects.find((item) => item.id === id));
  if (id && !subject) return <AcademicForm title="Materia no encontrada" fallback="/(tabs)/planner"><Text>La materia ya no está disponible.</Text></AcademicForm>;
  if (!plan) {
    return (
      <AcademicForm title="Agregar materia" fallback="/(tabs)/planner">
        <Text className="text-muted">Configura tu universidad, carrera y pensum para comenzar.</Text>
        <FormButton label="Configurar pensum" onPress={() => router.push('/agregar-universidad')} />
      </AcademicForm>
    );
  }
  return <SubjectForm key={id ?? 'new'} subject={subject} initialPeriod={period} />;
}

function SubjectForm({ subject, initialPeriod }: { subject?: Subject; initialPeriod?: string }) {
  const router = useRouter();
  const back = useBack('/(tabs)/planner');
  const { periods, activePeriodId, rules, subjects } = useAcademicStore((state) => state.data);
  const saveSubject = useAcademicStore((state) => state.saveSubject);
  const removeSubject = useAcademicStore((state) => state.removeSubject);
  const [code, setCode] = useState(subject?.code ?? '');
  const [name, setName] = useState(subject?.name ?? '');
  const [credits, setCredits] = useState(subject?.credits.toString() ?? '');
  const [grade, setGrade] = useState(subject?.grade?.toString() ?? '');
  const [prerequisites, setPrerequisites] = useState(subject?.prerequisites ?? []);
  const [enrollment, setEnrollment] = useState<Subject['enrollment']>(subject?.enrollment ?? 'pending');
  const [periodId, setPeriodId] = useState(subject ? subject.periodId
    : initialPeriod === 'unassigned' ? null : periods.find((period) => period.id === initialPeriod)?.id ?? activePeriodId);
  const { busy, error, run } = useSave();
  const save = () => run(
    () => saveSubject({
      id: subject?.id, code, name, credits: parseDecimal(credits), periodId, enrollment, prerequisites,
      grade: enrollment === 'withdrawn' ? null : optionalDecimal(grade),
    }),
    back,
  );

  return (
    <AcademicForm title={subject ? 'Editar materia y nota' : 'Agregar materia'} fallback="/(tabs)/planner">
      <Field label="Código de materia" value={code} onChangeText={setCode} autoCapitalize="characters" maxLength={40} />
      <Field label="Nombre de materia" value={name} onChangeText={setName} maxLength={120} />
      <Field label="Créditos de materia" value={credits} onChangeText={setCredits} inputMode="decimal" />
      <Text className="mb-2 font-bold text-text">Período</Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        <Choice label="Sin período" selected={periodId === null} onPress={() => setPeriodId(null)} />
        {periods.map((period) => (
          <Choice key={period.id} label={period.name} selected={periodId === period.id} onPress={() => setPeriodId(period.id)} />
        ))}
      </View>
      <Text className="mb-2 font-bold text-text">Estado sin nota</Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {ENROLLMENTS.map((item) => (
          <Choice key={item} label={STATUS_LABELS[item]} selected={enrollment === item}
            onPress={() => {
              if (item === 'withdrawn') setGrade('');
              setEnrollment(item);
            }} />
        ))}
      </View>
      {enrollment !== 'withdrawn' ? (
        <Field label="Nota final (opcional)" value={grade} onChangeText={setGrade} inputMode="decimal"
          placeholder={`${rules.minimum} a ${rules.maximum}. Se aprueba con ${rules.passing}.`} />
      ) : null}
      {subjects.some(({ id }) => id !== subject?.id) ? (
        <>
          <Text className="mb-2 font-bold text-text">Prerrequisitos</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {subjects.filter(({ id }) => id !== subject?.id).map(({ id, code }) => (
              <Choice key={id} label={code} selected={prerequisites.includes(id)} onPress={() => setPrerequisites((current) =>
                current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} />
            ))}
          </View>
        </>
      ) : null}
      <FormError error={error} />
      <FormButton label="Guardar materia" onPress={save} disabled={busy} />
      {subject ? <ConfirmAction label="Eliminar materia" prompt="Se eliminarán la materia, su nota y sus referencias como prerrequisito."
        busy={busy} onConfirm={() => run(() => removeSubject(subject.id), () => router.dismissTo('/(tabs)/planner'))} /> : null}
    </AcademicForm>
  );
}
