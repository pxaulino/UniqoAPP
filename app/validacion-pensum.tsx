import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Check, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, gradients, validationSubjects } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { ValidationPensumSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

export default function ValidacionPensumScreen() {
  const router = useRouter();
  const loading = useFakeLoading(900);

  if (loading) return <ValidationPensumSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8 pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={22} color={COLORS.text} />
          </Pressable>
          <Text className="text-[15px] font-bold text-text">Validacion del Pensum</Text>
          <View className="w-10" />
        </View>

        <View className="items-center pt-5">
          <LinearGradient colors={gradients.success} className="h-20 w-20 items-center justify-center rounded-full">
            <Check size={42} color={COLORS.white} strokeWidth={2.6} />
          </LinearGradient>
          <Text className="mt-5 text-center text-[18px] font-bold text-text">Pensum procesado con exito!</Text>
          <Text className="mt-1 text-center text-[13px] font-semibold text-muted">
            Hemos encontrado 48 materias en tu pensum
          </Text>
        </View>

        <View className="mt-5 flex-row gap-2">
          <StatCard label="Materias detectadas" value="48" color={COLORS.primary} style={{ flex: 1 }} />
          <StatCard label="Creditos totales" value="156" color={COLORS.primary} delay={60} style={{ flex: 1 }} />
          <StatCard label="Cuatrimestres detectados" value="10" color={COLORS.primary} delay={120} style={{ flex: 1 }} />
        </View>

        <Card padding={16} radius={22} className="mt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[14px] font-bold text-text">Vista previa de materias</Text>
            <Text className="text-[13px] font-bold text-primary">Ver todas</Text>
          </View>
          {validationSubjects.map((subject, index) => (
            <View key={subject.code} className="flex-row items-center gap-3 border-b border-bg py-3">
              <Text className="w-4 text-[14px] font-bold text-text">{index + 1}</Text>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-text">{subject.name}</Text>
                <Text className="mt-1 text-[11px] font-semibold text-muted">
                  {subject.code} - {subject.credits} creditos
                </Text>
              </View>
              {subject.ok ? (
                <CheckCircle2 size={18} color={COLORS.success} />
              ) : (
                <AlertTriangle size={18} color={COLORS.warning} />
              )}
            </View>
          ))}
          <Text className="mt-3 text-[13px] font-semibold text-muted">... y 45 materias mas</Text>
        </Card>

        <Pressable
          onPress={() => router.replace('/(tabs)/mapa' as never)}
          className="mt-7 items-center rounded-[13px] bg-[#5B38F5] py-[17px]"
          style={{
            shadowColor: '#5B38F5',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text className="text-[15px] font-semibold text-white">Confirmar y crear universidad</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="items-center py-5">
          <Text className="text-[15px] font-medium text-muted">Volver</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
