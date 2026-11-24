import { Choice } from '@/components/academic/AcademicForm';
import { STATUS_COLORS } from '@/components/academic/subjectStyles';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS } from '@/constants/mockData';
import { STATUS_LABELS, subjectStatus, sumCredits } from '@/src/academic/calculations';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { CheckCircle2, ChevronRight, Clock3, Plus, Settings } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlannerScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>();
  const { periods, activePeriodId, subjects, rules } = useAcademicStore((state) => state.data);
  const chosenPeriod = periods.find(({ id }) => id === selected);
  const active = selected === null ? null : chosenPeriod?.id ?? activePeriodId ?? periods[0]?.id ?? null;
  const period = periods.find(({ id }) => id === active);
  const groups = [...periods, { id: null, name: 'Sin período' }];
  const items = subjects.filter(({ periodId }) => periodId === active);
  const credits = sumCredits(items.filter(({ enrollment }) => enrollment !== 'withdrawn'));

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 128, paddingTop: 12 }}
      >
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-[21px] font-bold text-text">Mis estudios</Text>
            <Text className="mt-1 text-[13px] font-semibold text-muted">
              Organiza las materias de tu pensum por período
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Configurar pensum" onPress={() => router.push('/agregar-universidad')} className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Settings size={18} color={COLORS.text} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          <View className="flex-row gap-2">
            {groups.map((item) => {
              const selected = active === item.id;
              return (
                <Pressable
                  key={item.id ?? 'unassigned'}
                  accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setSelected(item.id)}
                  className={`rounded-xl px-4 py-3 ${selected ? 'bg-primary' : 'bg-white'}`}
                >
                  <Text className={`text-[13px] font-bold ${selected ? 'text-white' : 'text-muted'}`}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="mb-4 flex-row flex-wrap gap-3">
          <Choice label="Agregar período" selected={false} onPress={() => router.push('/periodo')} />
          {period ? <Choice label="Editar período" selected={false} onPress={() => router.push({ pathname: '/periodo', params: { id: period.id } })} /> : null}
          <Choice label="Simulador" selected={false} onPress={() => router.navigate('/(tabs)/simulador')} />
          <Choice label="Horario" selected={false} onPress={() => router.push('/calendario')} />
          <Choice label="Mapa del pensum" selected={false} onPress={() => router.navigate('/(tabs)/mapa')} />
        </View>

        <Card padding={17} radius={22} className="mb-5" style={{ backgroundColor: '#F0EDFF' }}>
          <Text className="text-[13px] font-bold text-primary">Carga del período</Text>
          <Text className="mt-2 text-[18px] font-bold text-text">
            {credits}{period?.maxCredits ? ' / ' + period.maxCredits : ''} créditos
          </Text>
          {period?.maxCredits ? <ProgressBar progress={Math.min(1, credits / period.maxCredits)} color={COLORS.primary} trackColor="#DAD4FF" height={7} style={{ marginTop: 12 }} /> : null}
        </Card>

        <Card padding={0} radius={22} className="mb-4">
          <View className="border-b border-bg px-4 py-4">
            <Text className="text-[14px] font-bold text-text">Materias del período</Text>
          </View>
          {!items.length ? <Text className="px-4 py-3 text-muted">Aún no hay materias en este período.</Text> : null}
          {items.map((subject) => {
            const status = subjectStatus(subject, rules);
            const color = STATUS_COLORS[status];
            const Icon = status === 'in_progress' ? Clock3 : CheckCircle2;
            return (
              <Pressable key={subject.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/materia/[id]', params: { id: subject.id } })} className="flex-row items-center gap-3 border-b border-bg px-4 py-4">
                <View style={{ backgroundColor: `${color}18` }} className="h-9 w-9 items-center justify-center rounded-xl">
                  <Icon size={18} color={color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-text">{subject.name}</Text>
                  <Text className="mt-0.5 text-[11px] font-semibold text-muted">{subject.credits} créditos · {STATUS_LABELS[status]}</Text>
                </View>
                <ChevronRight size={17} color={COLORS.muted} />
              </Pressable>
            );
          })}

          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/editar-materia', params: { period: active ?? 'unassigned' } })} className="m-4 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-muted/30 py-4">
            <Plus size={18} color={COLORS.primary} />
            <Text className="text-[14px] font-bold text-primary">Agregar materia</Text>
          </Pressable>
        </Card>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
