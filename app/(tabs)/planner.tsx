import { PlannerSkeleton } from '@/components/skeleton/ScreenSkeletons';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS, plannerSemesters } from '@/constants/mockData';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import { CheckCircle2, ChevronRight, Clock3, Plus, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusColor = {
  approved: COLORS.success,
  available: COLORS.secondary,
  in_progress: COLORS.warning,
  locked: COLORS.muted,
};

export default function PlannerScreen() {
  const [active, setActive] = useState(0);
  const loading = useFakeLoading(900);
  const semester = plannerSemesters[active];

  if (loading) return <PlannerSkeleton />;

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
              Organiza tus materias seleccionadas por periodo
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <Settings size={18} color={COLORS.text} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          <View className="flex-row gap-2">
            {plannerSemesters.map((item, index) => {
              const selected = active === index;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setActive(index)}
                  className={`rounded-xl px-4 py-3 ${selected ? 'bg-primary' : 'bg-white'}`}
                >
                  <Text className={`text-[13px] font-bold ${selected ? 'text-white' : 'text-muted'}`}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Card padding={17} radius={22} className="mb-5" style={{ backgroundColor: '#F0EDFF' }}>
          <Text className="text-[13px] font-bold text-primary">Carga del cuatrimestre</Text>
          <Text className="mt-2 text-[18px] font-bold text-text">
            {semester.credits} / {semester.maxCredits} creditos
          </Text>
          <ProgressBar progress={semester.credits / semester.maxCredits} color={COLORS.primary} trackColor="#DAD4FF" height={7} style={{ marginTop: 12 }} />
        </Card>

        <Card padding={0} radius={22} className="mb-4">
          <View className="border-b border-bg px-4 py-4">
            <Text className="text-[14px] font-bold text-text">Materias seleccionadas</Text>
          </View>
          {semester.subjects.map((subject) => {
            const color = statusColor[subject.status];
            const Icon = subject.status === 'in_progress' ? Clock3 : CheckCircle2;
            return (
              <View key={subject.id} className="flex-row items-center gap-3 border-b border-bg px-4 py-4">
                <View style={{ backgroundColor: `${color}18` }} className="h-9 w-9 items-center justify-center rounded-xl">
                  <Icon size={18} color={color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-text">{subject.name}</Text>
                  <Text className="mt-0.5 text-[11px] font-semibold text-muted">{subject.credits} creditos</Text>
                </View>
                <ChevronRight size={17} color={COLORS.muted} />
              </View>
            );
          })}

          <Pressable className="m-4 flex-row items-center justify-center gap-2 rounded-2xl border border-dashed border-muted/30 py-4">
            <Plus size={18} color={COLORS.primary} />
            <Text className="text-[14px] font-bold text-primary">Agregar materia al cuatrimestre</Text>
          </Pressable>
        </Card>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
