import { AcademicForm, useBack } from '@/components/academic/AcademicForm';
import { STATUS_LABELS, subjectStatus } from '@/src/academic/calculations';
import { useAcademicStore } from '@/store/useAcademicStore';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants/mockData';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Circle, Pencil } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MateriaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const back = useBack('/(tabs)/planner');
  const { subjects, periods, rules } = useAcademicStore((state) => state.data);
  const subject = subjects.find((item) => item.id === id);
  if (!subject) return <AcademicForm title="Materia no encontrada" fallback="/(tabs)/planner"><Text>La materia ya no está disponible.</Text></AcademicForm>;
  const prereqs = subjects.filter((item) => subject.prerequisites.includes(item.id));
  const unlocks = subjects.filter((item) => item.prerequisites.includes(subject.id));
  const period = periods.find((item) => item.id === subject.periodId)?.name ?? 'Sin período';
  const status = subjectStatus(subject, rules);

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <LinearGradient colors={['#7B4DFF', '#6C4DFF']} className="rounded-b-[32px] px-5 pb-8 pt-4">
          <View className="mb-8 flex-row items-center justify-between">
            <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Volver" className="h-10 w-10 items-center justify-center rounded-2xl bg-white/18">
              <ArrowLeft size={22} color={COLORS.white} />
            </Pressable>

          </View>
          <View className="items-center">
            <View className="mb-7 h-[92px] w-[92px] items-center justify-center rounded-[24px] bg-white/85">
              <Image
                source={require('@/assets/images/brain.png')}
                contentFit="contain"
                style={{ width: 92, height: 92 }}
              />
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-center text-[22px] font-bold  text-white">{subject.name}</Text>
              <View className="rounded-xl bg-white/18 px-3 py-1.5">
                <Text className="text-[13px] font-semibold text-white">{subject.credits} créditos</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="-mt-5 rounded-t-[26px] bg-white px-5 pb-6 pt-4">
          <Text className="mb-2 text-[16px] font-bold text-text">{subject.code} · {STATUS_LABELS[status]}</Text>
          <Text className="mb-4 font-semibold text-muted">{period} · Nota final: {subject.grade ?? 'sin nota'}{subject.grade !== null ? ' / ' + rules.maximum : ''}</Text>

          <Card padding={15} radius={18} className="mb-3" style={{ backgroundColor: '#FAFAFF' }}>
            <Text className="mb-3 text-[14px] font-bold text-text">Requisitos</Text>
            {prereqs.length ? (
              prereqs.map((item) => (
                <View key={item.id} className="mb-3 flex-row items-center gap-3">
                  <Circle size={10} color={subjectStatus(item, rules) === 'approved' ? COLORS.success : COLORS.secondary} fill={subjectStatus(item, rules) === 'approved' ? COLORS.success : COLORS.secondary} />
                  <Text className="flex-1 text-[14px] font-semibold text-text">{item.name}</Text>
                </View>
              ))
            ) : (
              <Text className="text-[13px] font-semibold text-muted">No tiene requisitos previos.</Text>
            )}
          </Card>

          <Card padding={15} radius={18} className="mb-3" style={{ backgroundColor: '#FAFAFF' }}>
            <Text className="mb-3 text-[14px] font-bold text-primary">Abre estas materias</Text>
            {!unlocks.length ? <Text className="text-[13px] font-semibold text-muted">Ninguna registrada.</Text> : null}
            {unlocks.map((item, index) => (
              <View key={item.id} className="mb-3 flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: [COLORS.danger, COLORS.warning, COLORS.secondary][index % 3] }}
                  className="h-4 w-4 rounded-full"
                />
                <Text className="flex-1 text-[14px] font-semibold text-text">{item.name}</Text>
              </View>
            ))}
          </Card>

          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/editar-materia', params: { id: subject.id } })}
            className="flex-row items-center justify-center gap-3 rounded-[13px] bg-[#5B38F5] py-[17px]"
            style={{
              shadowColor: '#5B38F5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Pencil size={20} color={COLORS.white} />
            <Text className="text-[15px] font-semibold text-white">Editar materia y nota</Text>
          </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
