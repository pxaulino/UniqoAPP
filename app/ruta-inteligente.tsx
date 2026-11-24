import { useBack } from '@/components/academic/AcademicForm';
import { subjectStatus, sumCredits } from '@/src/academic/calculations';
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle2, CircleDashed, Milestone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';

export default function RutaInteligenteScreen() {
  const back = useBack('/(tabs)/planner');
  const insets = useSafeAreaInsets();
  const { subjects, rules, periods, activePeriodId } = useAcademicStore((state) => state.data);
  const { earnedCredits, totalCredits, percent } = useAcademicSummary();
  const timeline = periods.map((period) => {
    const items = subjects.filter(({ periodId }) => periodId === period.id);
    const complete = items.length > 0 && items.every((subject) => subjectStatus(subject, rules) === 'approved');
    return { ...period, complete, current: period.id === activePeriodId, subjects: items.length, credits: sumCredits(items) };
  });

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-6 bg-white rounded-b-[40px] shadow-sm z-10">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={back} accessibilityRole="button" accessibilityLabel="Volver"
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
          >
            <ArrowLeft size={20} color={COLORS.text} />
          </Pressable>
          <View className="bg-indigo-50 px-4 py-2 rounded-full flex-row items-center">
            <Milestone size={16} color={COLORS.primary} className="mr-2" />
            <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">Ruta académica</Text>
          </View>
        </View>

        <Text style={TYPOGRAPHY.screenTitle} className="text-text text-[28px] mb-2">Tu Camino</Text>
        <Text style={TYPOGRAPHY.body} className="text-muted text-[15px]">{percent}% de los créditos del pensum completados.</Text>

        {/* Progress Bar */}
        <View className="mt-6">
          <View className="flex-row justify-between mb-2">
            <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">{earnedCredits} Cr.</Text>
            <Text style={TYPOGRAPHY.labelSemibold} className="text-muted">{totalCredits} Cr.</Text>
          </View>
          <View className="h-2.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
            <Animated.View
              entering={SlideInUp.delay(300).springify()}
              className="h-full bg-primary rounded-full"
              style={{ width: `${percent}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }} className="px-8">
        {!timeline.length ? <Text className="text-muted">Agrega períodos desde Mis estudios para ver tu ruta.</Text> : null}
        {timeline.map((item, index) => {
          const isCompleted = item.complete;
          const isCurrent = item.current;

          return (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 150).springify().damping(20)}
              className="flex-row mb-6 relative"
            >
              {/* Connecting Line */}
              {index !== timeline.length - 1 && (
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
                ) : (
                  <View className="h-8 w-8 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                    <CircleDashed size={16} color="#9CA3AF" />
                  </View>
                )}
              </View>

              {/* Content Card */}
              <View
                className={`flex-1 p-5 rounded-[24px] ${isCurrent ? 'bg-white border-2 border-primary/20' : 'bg-white'}`}
                style={isCurrent ? { shadowColor: COLORS.primary, shadowOpacity: 0.08, shadowRadius: 15, elevation: 5 } : {}}
              >
                <Text style={TYPOGRAPHY.cardTitle} className="text-text">{item.name}</Text>


                {(
                  <Text style={TYPOGRAPHY.label} className="text-muted mt-1">
                    {item.subjects} materias • {item.credits} créditos
                  </Text>
                )}

              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}
