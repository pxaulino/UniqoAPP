import { AcademicForm, useBack } from '@/components/academic/AcademicForm';
import GradientCard from '@/components/ui/GradientCard';
import { UniversityLogo } from '@/components/UniversityCard';
import { COLORS, gradients, universities } from '@/constants/mockData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Building2, Globe2, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UniversidadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const back = useBack('/(tabs)/universidades');
  const university = universities.find((item) => item.id === id);

  if (!university) return <AcademicForm title="Universidad no encontrada" fallback="/(tabs)/universidades"><Text>Esta universidad no está en el catálogo.</Text></AcademicForm>;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <GradientCard colors={gradients.primary} radius={30} padding={0} style={{ marginHorizontal: 10, marginTop: 2 }}>
          <View className="px-4 pb-7 pt-4">
            <View className="mb-6 flex-row items-center justify-between">
              <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Volver" className="h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <ArrowLeft size={21} color={COLORS.white} />
              </Pressable>
              <Text className="text-[14px] font-bold text-white">Detalle de Universidad</Text>
              <View className="h-10 w-10" />
            </View>

            <View className="flex-row items-center gap-4">
              <UniversityLogo color={university.color} text={university.logoText} logo={university.logo} size={68} />
              <View className="flex-1">
                <Text className="text-[21px] font-bold leading-7  text-white">
                  {university.fullName}
                </Text>
                <View className="mt-4 flex-row items-center gap-2">
                  <MapPin size={13} color="rgba(255,255,255,0.82)" />
                  <Text style={{ color: 'rgba(255,255,255,0.82)' }} className="text-[13px] font-semibold">{university.location}</Text>
                </View>
                <View className="mt-2 flex-row items-center gap-2">
                  <Globe2 size={13} color="rgba(255,255,255,0.82)" />
                  <Text style={{ color: 'rgba(255,255,255,0.82)' }} className="text-[13px] font-semibold">{university.website}</Text>
                </View>
              </View>
            </View>

            <View className="mt-5 flex-row gap-3">
              <View
                className="rounded-2xl border border-white/25 bg-white/18 px-4 py-2"
                style={{
                  shadowColor: '#FFFFFF',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                }}
              >
                <Text className="text-[13px] font-bold text-white">{university.type}</Text>
              </View>
              <View
                className="rounded-2xl border border-white/25 bg-white/18 px-4 py-2"
                style={{
                  shadowColor: '#FFFFFF',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                }}
              >
                <Text className="text-[13px] font-bold text-white">{university.founded}</Text>
              </View>
            </View>
          </View>
        </GradientCard>

        <View className="px-5 pt-6">
          <Pressable
            onPress={() => router.push({ pathname: '/subir-pensum', params: { university: university.name } })}
            className="mt-2 flex-row items-center justify-center gap-2 rounded-[13px] bg-[#5B38F5] py-[17px]"
            style={{
              shadowColor: '#5B38F5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Building2 size={18} color={COLORS.white} />
            <Text className="text-[15px] font-semibold text-white">Usar esta universidad</Text>
          </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
