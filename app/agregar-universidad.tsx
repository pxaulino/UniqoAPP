import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { addUniversitySteps, COLORS } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import { AddUniversitySkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

export default function AgregarUniversidadScreen() {
  const router = useRouter();
  const loading = useFakeLoading(900);

  if (loading) return <AddUniversitySkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8 pt-2">
        <View className="mb-6 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={22} color={COLORS.text} />
          </Pressable>
          <Text className="text-[15px] font-bold text-text">Agregar Universidad</Text>
          <View className="w-10" />
        </View>

        <View className="mb-7 items-center">
          <View className="h-[168px] w-full items-center justify-end overflow-hidden">
            <Image
              source={require('@/assets/images/universidad.png')}
              contentFit="contain"
              style={{ width: 348, height: 168 }}
            />
          </View>
          <Text className="mt-4 text-center text-[22px] font-bold  text-text">
            No encuentras tu universidad?
          </Text>
          <Text className="mt-2 max-w-[300px] text-center text-[15px] font-medium leading-6 text-muted">
            Agrega tu universidad y sube el pensum para comenzar a planificar tu carrera.
          </Text>
        </View>

        {addUniversitySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={step.title} delay={index * 70} padding={14} radius={20} className="mb-3">
              <View className="flex-row items-center gap-4">
                <View style={{ backgroundColor: step.bg }} className="h-12 w-12 items-center justify-center rounded-2xl">
                  <Icon size={22} color={step.color} strokeWidth={2.2} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-text">{step.title}</Text>
                  <Text className="mt-1 text-[13px] font-semibold text-muted">{step.subtitle}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        <Pressable
          onPress={() => router.push('/subir-pensum' as never)}
          className="mt-8 items-center rounded-[13px] bg-[#5B38F5] py-[17px]"
          style={{
            shadowColor: '#5B38F5',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text className="text-[15px] font-semibold text-white">Comenzar</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="items-center py-5">
          <Text className="text-[15px] font-medium text-muted">Cancelar</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
