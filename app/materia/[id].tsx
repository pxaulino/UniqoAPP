import { SubjectDetailSkeleton } from '@/components/skeleton/ScreenSkeletons';
import Card from '@/components/ui/Card';
import { COLORS, subjects } from '@/constants/mockData';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, CheckCircle2, Circle, Plus, Share2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MateriaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loading = useFakeLoading(900);
  const subject = subjects.find((item) => item.id === id) ?? subjects[5];
  const prereqs = subjects.filter((item) => subject.prerequisites.includes(item.id));
  const unlocks = subjects.filter((item) => item.prerequisites.includes(subject.id));

  if (loading) return <SubjectDetailSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
        <LinearGradient colors={['#7B4DFF', '#6C4DFF']} className="rounded-b-[32px] px-5 pb-8 pt-4">
          <View className="mb-8 flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl bg-white/18">
              <ArrowLeft size={22} color={COLORS.white} />
            </Pressable>
            <View className="flex-row gap-3">
              <Share2 size={21} color={COLORS.white} />
              <Bookmark size={21} color={COLORS.white} />
            </View>
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
                <Text className="text-[13px] font-semibold text-white">{subject.credits} creditos</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="-mt-5 rounded-t-[26px] bg-white px-5 pb-6 pt-4">
          <View className="mb-4 flex-row border-b border-bg">
            <View className="border-b-2 border-primary px-6 pb-3">
              <Text className="text-[14px] font-bold text-primary">Informacion</Text>
            </View>
            <View className="px-6 pb-3">
              <Text className="text-[14px] font-bold text-muted">Detalles</Text>
            </View>
          </View>

          <Text className="mb-5 text-[14px] font-medium leading-5 text-text">{subject.description}</Text>

          <Card padding={15} radius={18} className="mb-3" style={{ backgroundColor: '#FAFAFF' }}>
            <Text className="mb-3 text-[14px] font-bold text-text">Requisitos</Text>
            {prereqs.length ? (
              prereqs.map((item) => (
                <View key={item.id} className="mb-3 flex-row items-center gap-3">
                  <Circle size={10} color={item.status === 'approved' ? COLORS.success : COLORS.secondary} fill={item.status === 'approved' ? COLORS.success : COLORS.secondary} />
                  <Text className="flex-1 text-[14px] font-semibold text-text">{item.name}</Text>
                  <CheckCircle2 size={17} color={COLORS.success} />
                </View>
              ))
            ) : (
              <Text className="text-[13px] font-semibold text-muted">No tiene requisitos previos.</Text>
            )}
          </Card>

          <Card padding={15} radius={18} className="mb-3" style={{ backgroundColor: '#FAFAFF' }}>
            <Text className="mb-3 text-[14px] font-bold text-primary">Abre estas materias</Text>
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

          <Card padding={15} radius={18} className="mb-7" style={{ backgroundColor: '#F2EEFF' }}>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-primary">Recomendado para ti</Text>
                <Text className="mt-1 text-[13px] font-medium leading-4 text-muted">
                  Esta materia es clave para tu avance academico.
                </Text>
              </View>
              <Image
                source={require('@/assets/images/brain.png')}
                contentFit="contain"
                style={{ width: 58, height: 58 }}
              />
            </View>
          </Card>

          <Pressable
            className="flex-row items-center justify-center gap-3 rounded-[13px] bg-[#5B38F5] py-[17px]"
            style={{
              shadowColor: '#5B38F5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Plus size={20} color={COLORS.white} />
            <Text className="text-[15px] font-semibold text-white">Agregar a mi plan</Text>
          </Pressable>
        </View>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
