import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, CircleDashed, Milestone, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';
import { useAcademicStore } from '@/store/useAcademicStore';

const TIMELINE = [
  { id: '1', title: 'Cuatrimestre 1', status: 'completed', subjects: 5, credits: 20 },
  { id: '2', title: 'Cuatrimestre 2', status: 'completed', subjects: 4, credits: 16 },
  { id: '3', title: 'Cuatrimestre 3', status: 'current', subjects: 4, credits: 16, alert: 'Cuidado con Cálculo II' },
  { id: '4', title: 'Cuatrimestre 4', status: 'future', subjects: 5, credits: 20 },
  { id: '5', title: 'Graduación', status: 'milestone', desc: 'Diciembre 2027' },
];

export default function RutaInteligenteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { creditsEarned, totalCredits } = useAcademicStore();
  const progress = (creditsEarned / totalCredits) * 100;

  return (
    <AppFrame>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-6 bg-white rounded-b-[40px] shadow-sm z-10">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable 
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
          >
            <ArrowLeft size={20} color={COLORS.text} />
          </Pressable>
          <View className="bg-indigo-50 px-4 py-2 rounded-full flex-row items-center">
            <Milestone size={16} color={COLORS.primary} className="mr-2" />
            <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">Ruta Optimizada</Text>
          </View>
        </View>

        <Text style={TYPOGRAPHY.screenTitle} className="text-text text-[28px] mb-2">Tu Camino</Text>
        <Text style={TYPOGRAPHY.body} className="text-muted text-[15px]">Estás en el 22% de tu carrera. Mantén el ritmo para graduarte a tiempo.</Text>
        
        {/* Progress Bar */}
        <View className="mt-6">
          <View className="flex-row justify-between mb-2">
            <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">{creditsEarned} Cr.</Text>
            <Text style={TYPOGRAPHY.labelSemibold} className="text-muted">{totalCredits} Cr.</Text>
          </View>
          <View className="h-2.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
            <Animated.View 
              entering={SlideInUp.delay(300).springify()}
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }} className="px-8">
        {TIMELINE.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isMilestone = item.status === 'milestone';

          return (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.delay(index * 150).springify().damping(20)}
              className="flex-row mb-6 relative"
            >
              {/* Connecting Line */}
              {index !== TIMELINE.length - 1 && (
                <View 
                  className={`absolute left-[15px] top-[30px] bottom-[-40px] w-0.5 ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} 
                  style={isCurrent ? { opacity: 0.3 } : {}}
                />
              )}

              {/* Status Icon */}
              <View className="mr-5 mt-1 relative bg-[#F8F7FF]">
                {isCompleted ? (
                  <View className="h-8 w-8 rounded-full bg-primary items-center justify-center">
                    <CheckCircle2 size={16} color="#FFF" />
                  </View>
                ) : isCurrent ? (
                  <LinearGradient
                    colors={['#8B5CF6', '#6C4DFF']}
                    className="h-8 w-8 rounded-full items-center justify-center shadow-md shadow-primary/30"
                  >
                    <View className="h-3 w-3 bg-white rounded-full" />
                  </LinearGradient>
                ) : isMilestone ? (
                  <View className="h-8 w-8 rounded-full bg-pink-500 items-center justify-center shadow-md shadow-pink-500/30">
                    <Milestone size={16} color="#FFF" />
                  </View>
                ) : (
                  <View className="h-8 w-8 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                    <CircleDashed size={16} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Content Card */}
              <View 
                className={`flex-1 p-5 rounded-[24px] ${isCurrent ? 'bg-white border-2 border-primary/20' : isMilestone ? 'bg-pink-50' : 'bg-white'}`}
                style={isCurrent || isMilestone ? { shadowColor: COLORS.primary, shadowOpacity: 0.08, shadowRadius: 15, elevation: 5 } : {}}
              >
                <Text style={TYPOGRAPHY.cardTitle} className={isMilestone ? 'text-pink-600' : 'text-text'}>{item.title}</Text>
                
                {item.desc && <Text style={TYPOGRAPHY.bodyMedium} className="text-pink-500/80 mt-1">{item.desc}</Text>}
                
                {item.subjects && (
                  <Text style={TYPOGRAPHY.label} className="text-muted mt-1">
                    {item.subjects} materias • {item.credits} créditos
                  </Text>
                )}

                {item.alert && (
                  <View className="flex-row items-center bg-amber-50 rounded-xl p-3 mt-3 border border-amber-100">
                    <AlertTriangle size={14} color="#D97706" className="mr-2" />
                    <Text style={TYPOGRAPHY.labelSemibold} className="text-amber-700">{item.alert}</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </AppFrame>
  );
}
