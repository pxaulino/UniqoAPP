import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Flame, Trophy, Target, Star, Award, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';
import { useAcademicStore } from '@/store/useAcademicStore';

const ACHIEVEMENTS = [
  { id: '1', title: 'Racha Perfecta', desc: '14 días seguidos estudiando', icon: Flame, color: ['#F59E0B', '#D97706'], unlocked: true },
  { id: '2', title: 'Maestro de Física', desc: 'Aprobaste Física I con 100', icon: Star, color: ['#6366F1', '#4F46E5'], unlocked: true },
  { id: '3', title: 'Mitad del Camino', desc: 'Alcanzaste 100 créditos', icon: Target, color: ['#10B981', '#059669'], unlocked: false },
  { id: '4', title: 'Imparable', desc: 'Sin retirar materias en 2 ciclos', icon: Zap, color: ['#EC4899', '#D946EF'], unlocked: false },
];

export default function LogrosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { streakDays, level, xp } = useAcademicStore();
  
  const xpNeeded = level * 1000;
  const progressPercent = (xp / xpNeeded) * 100;

  return (
    <AppFrame>
      <View 
        style={{ 
          paddingTop: insets.top + 10,
          shadowColor: COLORS.primary, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3
        }} 
        className="px-6 pb-4 flex-row items-center justify-between bg-white rounded-b-[32px] z-10"
      >
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
        >
          <ArrowLeft size={20} color={COLORS.text} />
        </Pressable>
        <View className="flex-row items-center bg-[#FFFBEB] px-4 py-2 rounded-full border border-amber-200">
          <Flame size={16} color="#D97706" fill="#F59E0B" className="mr-2" />
          <Text style={TYPOGRAPHY.labelSemibold} className="text-amber-600">{streakDays} Días</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Level Banner */}
        <Animated.View 
          entering={FadeInDown.springify().damping(18)}
          className="mx-6 mt-6 rounded-[32px] overflow-hidden"
          style={{
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <LinearGradient
            colors={['#1E1B4B', '#4C1D95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-8 items-center"
          >
            <View className="h-24 w-24 rounded-full bg-white/10 items-center justify-center mb-4 border-2 border-white/20">
              <Trophy size={40} color="#FBBF24" />
            </View>
            <Text style={TYPOGRAPHY.cardTitle} className="text-white opacity-80 uppercase tracking-widest text-[11px] mb-1">
              Rango Académico
            </Text>
            <Text style={TYPOGRAPHY.stat} className="text-white text-[42px] mb-6">
              Nivel {level}
            </Text>

            <View className="w-full">
              <View className="flex-row justify-between mb-2">
                <Text style={[TYPOGRAPHY.labelSemibold, { color: 'rgba(255,255,255,0.82)' }]}>{xp} XP</Text>
                <Text style={[TYPOGRAPHY.labelSemibold, { color: 'rgba(255,255,255,0.56)' }]}>{xpNeeded} XP</Text>
              </View>
              <View className="h-3 w-full bg-black/30 rounded-full overflow-hidden">
                <Animated.View 
                  className="h-full rounded-full"
                  entering={SlideInRight.delay(300).springify()}
                  style={{ width: `${progressPercent}%`, backgroundColor: '#A78BFA' }}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Badges Grid */}
        <View className="px-6 mt-10">
          <Text style={TYPOGRAPHY.sectionTitle} className="text-text mb-6">Insignias y Logros</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {ACHIEVEMENTS.map((ach, index) => {
              const Icon = ach.icon;
              return (
                <Animated.View 
                  key={ach.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                  className={`w-[48%] bg-white rounded-[24px] p-5 mb-4 border ${ach.unlocked ? 'border-transparent' : 'border-gray-200 opacity-60'}`}
                  style={ach.unlocked ? {
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 16,
                    elevation: 5,
                  } : {}}
                >
                  <LinearGradient
                    colors={ach.unlocked ? (ach.color as [string, string]) : ['#E5E7EB', '#D1D5DB']}
                    className="h-12 w-12 rounded-2xl items-center justify-center mb-4"
                  >
                    <Icon size={24} color="#FFF" />
                  </LinearGradient>
                  
                  <Text style={TYPOGRAPHY.cardTitle} className="text-[15px] text-text mb-1">{ach.title}</Text>
                  <Text style={TYPOGRAPHY.label} className="text-[11px] text-muted leading-4">{ach.desc}</Text>
                  
                  {!ach.unlocked && (
                    <View className="absolute top-4 right-4 bg-gray-100 p-1.5 rounded-full">
                      <Award size={12} color="#9CA3AF" />
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </AppFrame>
  );
}
