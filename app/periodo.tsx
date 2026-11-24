import { AcademicForm, ConfirmAction, Field, FormButton, FormError, useBack, useSave } from '@/components/academic/AcademicForm';
import { optionalDecimal, Period } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

export default function PeriodScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const period = useAcademicStore((state) => state.data.periods.find((item) => item.id === id));
  if (id && !period) {
    return <AcademicForm title="Período no encontrado" fallback="/(tabs)/planner"><Text>El período ya no está disponible.</Text></AcademicForm>;
  }
  return <PeriodForm key={id ?? 'new'} period={period} />;
}

function PeriodForm({ period }: { period?: Period }) {
  const back = useBack('/(tabs)/planner');
  const activeId = useAcademicStore((state) => state.data.activePeriodId);
  const savePeriod = useAcademicStore((state) => state.savePeriod);
  const removePeriod = useAcademicStore((state) => state.removePeriod);
  const [name, setName] = useState(period?.name ?? '');
  const [maxCredits, setMaxCredits] = useState(period?.maxCredits?.toString() ?? '');
  const [active, setActive] = useState(period ? activeId === period.id : !activeId);
  const { busy, error, run } = useSave();
  return (
    <AcademicForm title={period ? 'Editar período' : 'Agregar período'} fallback="/(tabs)/planner">
      <Field label="Nombre del período" value={name} onChangeText={setName} placeholder="Ej. 2026-2" maxLength={120} />
      <Field label="Límite de créditos (opcional)" value={maxCredits} onChangeText={setMaxCredits} inputMode="decimal" />
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-text">Período activo</Text>
        <Switch accessibilityLabel="Período activo" value={active} onValueChange={setActive} />
      </View>
      <FormError error={error} />
      <FormButton label="Guardar período" disabled={busy} onPress={() => run(
        () => savePeriod({ id: period?.id, name, maxCredits: optionalDecimal(maxCredits) }, active), back,
      )} />
      {period ? <ConfirmAction label="Eliminar período" prompt="Solo se puede eliminar un período sin materias."
        busy={busy} onConfirm={() => run(() => removePeriod(period.id), back)} /> : null}
    </AcademicForm>
  );
}
