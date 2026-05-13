import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crosshair, SlidersHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/mockData';
import CurriculumGraph from '@/components/CurriculumGraph';
import { CurriculumMapSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

const legend = [
  { label: 'Aprobada', color: COLORS.success },
  { label: 'Disponible', color: COLORS.secondary },
  { label: 'En curso', color: COLORS.warning },
  { label: 'Bloqueada', color: '#78728E' },
];

export default function MapaScreen() {
  const router = useRouter();
  const loading = useFakeLoading(900);

  if (loading) return <CurriculumMapSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <View className="px-5 pt-2">
        <View className="mb-2 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={22} color={COLORS.text} />
          </Pressable>
          <Text className="text-[16px] font-bold text-text">Mapa del Pensum</Text>
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
            <SlidersHorizontal size={18} color={COLORS.text} />
          </View>
        </View>
        <View className="mb-1 flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {legend.map((item) => (
            <View key={item.label} className="flex-row items-center gap-2">
              <View style={{ backgroundColor: item.color }} className="h-2.5 w-2.5 rounded-full" />
              <Text className="text-[11px] font-medium text-muted">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="flex-1 items-center pb-24">
        <CurriculumGraph />
      </View>

      <Pressable
        className="absolute bottom-28 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary"
        style={{
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.34,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        <Crosshair size={25} color={COLORS.white} />
      </Pressable>

      </SafeAreaView>
    </Animated.View>
  );
}
