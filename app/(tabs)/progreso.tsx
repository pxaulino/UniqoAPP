import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, BookOpen, PartyPopper, TrendingUp } from 'lucide-react-native';
import { Image } from 'expo-image';
import { COLORS, progressData } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import ProgressRing from '@/components/ui/ProgressRing';
import StatCard from '@/components/ui/StatCard';
import { ProgressSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

const stats = [
  { label: 'Creditos aprobados', value: `${progressData.creditsApproved} / ${progressData.totalCredits}`, icon: Award, color: COLORS.success, bg: COLORS.successLight },
  { label: 'Promedio general', value: progressData.gpa, icon: TrendingUp, color: COLORS.warning, bg: COLORS.warningLight },
  { label: 'Racha de estudio', value: `${progressData.streak} dias`, icon: PartyPopper, color: COLORS.danger, bg: COLORS.dangerLight },
  { label: 'Materias aprobadas', value: progressData.subjectsApproved, icon: BookOpen, color: COLORS.primary, bg: COLORS.primaryLight },
];

export default function ProgresoScreen() {
  const loading = useFakeLoading(950);

  if (loading) return <ProgressSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-32 pt-3">
        <Text className="mb-4 text-[21px] font-bold text-text">Mi Progreso</Text>

        <View className="mb-5 items-center">
          <ProgressRing progress={progressData.percent} size={168} strokeWidth={15} />
          <Text className="mt-3 text-[14px] font-bold text-text">Vas por buen camino!</Text>
        </View>

        <View className="mb-6 flex-row flex-wrap gap-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                color={COLORS.text}
                bgColor={item.bg}
                icon={<Icon size={18} color={item.color} />}
                delay={index * 60}
                style={{ width: '48%' }}
              />
            );
          })}
        </View>

        <View
          className="mb-6 overflow-hidden rounded-[16px] bg-[#5B38F5] px-5 py-4"
          style={{
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.18,
            shadowRadius: 28,
            elevation: 10,
          }}
        >
          <View className="absolute right-10 top-7 h-2 w-2 rotate-45 bg-[#FFD64A]" />
          <View className="absolute right-24 top-12 h-1.5 w-1.5 rounded-full bg-white/70" />
          <View className="absolute right-32 bottom-10 h-1.5 w-1.5 rounded-full bg-[#65E4C0]" />
          <View className="absolute right-16 bottom-7 h-2 w-1 rotate-45 rounded-full bg-white/40" />
          <View className="h-[142px] flex-row items-center">
            <View className="z-10 w-[58%]">
              <Text className="text-[13px] font-semibold text-white">Graduacion estimada</Text>
              <Text className="mt-4 text-[26px] font-bold  text-white">{progressData.graduationDate}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.86)' }} className="mt-2 text-[13px] font-medium">
                Si mantienes tu ritmo actual
              </Text>
            </View>
            <View className="absolute bottom-[-10px] right-[-20px] h-[170px] w-[220px] items-center justify-center overflow-hidden">
              <Image
                source={require('@/assets/images/graduacion.png')}
                contentFit="contain"
                style={{ width: 220, height: 170 }}
              />
            </View>
          </View>
        </View>

        <Card padding={18} radius={22} style={{ backgroundColor: '#F0EDFF' }}>
          <Text className="text-[15px] font-bold text-primary">Motivacion</Text>
          <Text className="mt-2 text-[14px] font-semibold leading-5 text-muted">
            Has completado mas de la mitad del camino. Tu proximo bloque de materias desbloquea la ruta de datos e inteligencia artificial.
          </Text>
        </Card>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
