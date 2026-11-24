import { useRouter } from 'expo-router';
import { FormButton } from '@/components/academic/AcademicForm';
import { formatAverage } from '@/src/academic/calculations';
import { useAcademicSummary } from '@/store/useAcademicStore';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, BookOpen, PartyPopper, TrendingUp } from 'lucide-react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import ProgressRing from '@/components/ui/ProgressRing';
import StatCard from '@/components/ui/StatCard';

export default function ProgresoScreen() {
  const router = useRouter();
  const summary = useAcademicSummary();
  const stats = [
    { label: 'Créditos aprobados', value: summary.earnedCredits + ' / ' + summary.totalCredits, icon: Award, color: COLORS.success, bg: COLORS.successLight },
    { label: 'Promedio general', value: formatAverage(summary.average), icon: TrendingUp, color: COLORS.warning, bg: COLORS.warningLight },
    { label: 'Materias pendientes', value: summary.remaining, icon: PartyPopper, color: COLORS.danger, bg: COLORS.dangerLight },
    { label: 'Materias aprobadas', value: summary.approved, icon: BookOpen, color: COLORS.primary, bg: COLORS.primaryLight },
  ];

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-32 pt-3">
        <Text className="mb-4 text-[21px] font-bold text-text">Mi Progreso</Text>

        <View className="mb-5 items-center">
          <ProgressRing progress={summary.percent} size={168} strokeWidth={15} />
          <Text className="mt-3 text-[14px] font-bold text-text">Progreso por créditos</Text>
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
              <Text className="text-[13px] font-semibold text-white">Créditos por completar</Text>
              <Text className="mt-4 text-[26px] font-bold  text-white">{summary.remainingCredits}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.86)' }} className="mt-2 text-[13px] font-medium">
                Según tu pensum
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
          <Text className="text-[15px] font-bold text-primary">Historial académico</Text>
          <FormButton label="Ver métricas por período" onPress={() => router.push('/estadisticas-avanzadas')} />
          <FormButton label="Materias aprobadas" kind="secondary" onPress={() => router.push({ pathname: '/materias/[type]', params: { type: 'approved' } })} />
          <FormButton label="Materias pendientes" kind="secondary" onPress={() => router.push({ pathname: '/materias/[type]', params: { type: 'pending' } })} />
          <FormButton label="Materias en curso" kind="secondary" onPress={() => router.push({ pathname: '/materias/[type]', params: { type: 'in_progress' } })} />
        </Card>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
