import { AcademicForm, Choice, Field, FormError } from '@/components/academic/AcademicForm';
import Card from '@/components/ui/Card';
import { formatAverage, summarizeAcademicData } from '@/src/academic/calculations';
import { optionalDecimal } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function SimulatorScreen() {
  const data = useAcademicStore((state) => state.data);
  const baseline = summarizeAcademicData(data);
  const [selected, setSelected] = useState('');
  const [mode, setMode] = useState<'withdraw' | 'grade'>('withdraw');
  const [grade, setGrade] = useState('');
  const eligible = data.subjects.filter(({ enrollment }) => enrollment !== 'withdrawn');
  const subject = eligible.find(({ id }) => id === selected) ?? eligible[0];
  const newGrade = optionalDecimal(grade);
  const gradeInvalid = newGrade !== null &&
    (!Number.isFinite(newGrade) || newGrade < data.rules.minimum || newGrade > data.rules.maximum);
  const projected = subject && (mode === 'withdraw' || (newGrade !== null && !gradeInvalid)) ? summarizeAcademicData({
    ...data,
    subjects: data.subjects.map((item) => item.id !== subject.id ? item : {
      ...item,
      enrollment: mode === 'withdraw' ? 'withdrawn' : item.enrollment,
      grade: mode === 'withdraw' ? null : newGrade,
    }),
  }) : null;

  return (
    <AcademicForm title="Simulador" fallback="/(tabs)/planner">
      {!subject ? <Text className="text-muted">Agrega materias para simular un cambio.</Text> : (
        <>
          <Text className="mb-2 text-[17px] font-bold text-text">¿Qué quieres simular?</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            <Choice label="Retirar materia" selected={mode === 'withdraw'} onPress={() => setMode('withdraw')} />
            <Choice label="Cambiar nota" selected={mode === 'grade'} onPress={() => setMode('grade')} />
          </View>
          <Text className="mb-2 font-bold text-text">Materia</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {eligible.map((item) => <Choice key={item.id} label={item.code} selected={item.id === subject.id} onPress={() => setSelected(item.id)} />)}
          </View>
          <Text className="mb-3 font-semibold text-muted">{subject.name}</Text>
          {mode === 'grade' ? <Field label="Nota simulada" value={grade} onChangeText={setGrade} inputMode="decimal" /> : null}
          <FormError error={mode === 'grade' && gradeInvalid ? 'Indica una nota dentro de tu escala.' : ''} />
          {projected ? (
            <Card padding={14} radius={18} style={{ backgroundColor: '#F0EDFF' }}>
              <Text className="mb-2 font-bold text-primary">Impacto simulado</Text>
              <Text className="text-text">Créditos aprobados: {baseline.earnedCredits} → {projected.earnedCredits}</Text>
              <Text className="text-text">Progreso: {baseline.percent}% → {projected.percent}%</Text>
              <Text className="text-text">Promedio: {formatAverage(baseline.average)} → {formatAverage(projected.average)}</Text>
            </Card>
          ) : null}
        </>
      )}
    </AcademicForm>
  );
}
