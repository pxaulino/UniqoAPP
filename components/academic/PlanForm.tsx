import { AcademicForm, Field, FormButton, FormError, useSave } from '@/components/academic/AcademicForm';
import { optionalDecimal, parseDecimal } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

export default function PlanForm() {
  const router = useRouter();
  const { university: suggestedUniversity } = useLocalSearchParams<{ university?: string }>();
  const { plan, rules } = useAcademicStore((state) => state.data);
  const savePlan = useAcademicStore((state) => state.savePlan);
  const [university, setUniversity] = useState(suggestedUniversity ?? plan?.university ?? '');
  const [career, setCareer] = useState(plan?.career ?? '');
  const [curriculum, setCurriculum] = useState(plan?.curriculum ?? '');
  const [required, setRequired] = useState(plan?.requiredCredits?.toString() ?? '');
  const [min, setMin] = useState(String(rules.minimum));
  const [max, setMax] = useState(String(rules.maximum));
  const [passing, setPassing] = useState(String(rules.passing));
  const [weightedByCredits, setWeighted] = useState(rules.weightedByCredits);
  const [includeFailed, setIncludeFailed] = useState(rules.includeFailed);
  const { busy, error, run } = useSave();

  const save = () => run(
    () => savePlan(
      { university, career, curriculum, requiredCredits: optionalDecimal(required) },
      { minimum: parseDecimal(min), maximum: parseDecimal(max), passing: parseDecimal(passing), weightedByCredits, includeFailed },
    ),
    () => router.replace('/validacion-pensum'),
  );

  return (
    <AcademicForm title={plan ? 'Editar universidad y pensum' : 'Agregar universidad y pensum'}>
      <Field label="Universidad" value={university} onChangeText={setUniversity} maxLength={120} />
      <Field label="Carrera" value={career} onChangeText={setCareer} maxLength={120} />
      <Field label="Pensum o versión" value={curriculum} onChangeText={setCurriculum} maxLength={120} />
      <Field label="Créditos requeridos (opcional)" value={required} onChangeText={setRequired} inputMode="decimal" />
      <Text className="mb-4 text-[13px] text-muted">Si lo dejas vacío, el progreso usa los créditos de las materias que agregues.</Text>
      <Text className="mb-3 text-[17px] font-bold text-text">Escala de notas</Text>
      <Field label="Nota mínima" value={min} onChangeText={setMin} inputMode="decimal" />
      <Field label="Nota máxima" value={max} onChangeText={setMax} inputMode="decimal" />
      <Field label="Nota para aprobar" value={passing} onChangeText={setPassing} inputMode="decimal" />
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-semibold text-text">Ponderar promedio por créditos</Text>
        <Switch accessibilityLabel="Ponderar promedio por créditos" value={weightedByCredits} onValueChange={setWeighted} />
      </View>
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <Text className="flex-1 font-semibold text-text">Incluir notas reprobadas</Text>
        <Switch accessibilityLabel="Incluir notas reprobadas" value={includeFailed} onValueChange={setIncludeFailed} />
      </View>
      <FormError error={error} />
      <FormButton label="Guardar pensum" onPress={save} disabled={busy} />
    </AcademicForm>
  );
}
