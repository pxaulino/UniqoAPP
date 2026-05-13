import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, BarChart3, PieChart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';

export default function EstadisticasAvanzadasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const performanceData = [65, 78, 85, 82, 95, 88, 92]; // GPAs or similar metrics

  return (
    <AppFrame>
      <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-4 flex-row items-center justify-between">
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          style={{ shadowColor: COLORS.primary, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 }}
        >
          <ArrowLeft size={20} color={COLORS.text} />
        </Pressable>
        <Text style={TYPOGRAPHY.sectionTitle} className="text-text">Métricas</Text>
        <View className="h-10 w-10 items-center justify-center bg-rose-50 rounded-full">
          <TrendingUp size={18} color="#E11D48" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} className="px-6 mt-2">
        {/* Main Chart */}
        <Animated.View 
          entering={FadeInDown.springify()}
          className="bg-white rounded-[32px] p-6 mb-6"
          style={{ shadowColor: COLORS.primary, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 }}
        >
          <View className="flex-row justify-between items-end mb-6">
            <View>
              <Text style={TYPOGRAPHY.cardTitle} className="text-muted uppercase tracking-widest text-[11px] mb-1">Índice Académico</Text>
              <Text style={TYPOGRAPHY.stat} className="text-text text-[36px]">3.8<Text className="text-[20px] text-muted">/4.0</Text></Text>
            </View>
            <View className="bg-emerald-50 px-2 py-1 rounded-md mb-2">
              <Text style={TYPOGRAPHY.labelSemibold} className="text-emerald-600">+0.2</Text>
            </View>
          </View>

          {/* Custom Animated Bar Chart */}
          <View className="flex-row h-32 items-end justify-between border-b border-gray-100 pb-2">
            {performanceData.map((val, idx) => (
              <View key={idx} className="w-[10%] items-center">
                <Animated.View 
                  entering={SlideInUp.delay(idx * 100).springify()}
                  className="w-full bg-[#6C4DFF] rounded-t-lg"
                  style={{ height: `${val}%`, opacity: idx === performanceData.length - 1 ? 1 : 0.4 }}
                />
              </View>
            ))}
          </View>
          <View className="flex-row justify-between mt-2 px-1">
            <Text style={TYPOGRAPHY.label} className="text-muted text-[10px]">C1</Text>
            <Text style={TYPOGRAPHY.label} className="text-muted text-[10px]">C7</Text>
          </View>
        </Animated.View>

        {/* Secondary Metrics */}
        <View className="flex-row justify-between mb-6">
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            className="bg-white rounded-[24px] p-5 w-[48%]"
            style={{ shadowColor: COLORS.primary, shadowOpacity: 0.06, shadowRadius: 15, elevation: 4 }}
          >
            <PieChart size={24} color="#F59E0B" className="mb-4" />
            <Text style={TYPOGRAPHY.cardTitle} className="text-muted text-[11px] uppercase mb-1">Tasa de Aprobación</Text>
            <Text style={TYPOGRAPHY.sectionTitle} className="text-text text-[24px]">98%</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            className="bg-white rounded-[24px] p-5 w-[48%]"
            style={{ shadowColor: COLORS.primary, shadowOpacity: 0.06, shadowRadius: 15, elevation: 4 }}
          >
            <BarChart3 size={24} color="#10B981" className="mb-4" />
            <Text style={TYPOGRAPHY.cardTitle} className="text-muted text-[11px] uppercase mb-1">Créditos / Ciclo</Text>
            <Text style={TYPOGRAPHY.sectionTitle} className="text-text text-[24px]">18.5</Text>
          </Animated.View>
        </View>

        {/* Heatmap Placeholder */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          className="bg-indigo-900 rounded-[32px] p-6 overflow-hidden"
        >
          <LinearGradient
            colors={['#1E1B4B', '#4C1D95']}
            style={{ position: 'absolute', inset: 0 }}
          />
          <Text style={[TYPOGRAPHY.cardTitle, { color: 'rgba(255,255,255,0.92)' }]} className="text-[16px] mb-4">Dificultad vs Rendimiento</Text>
          
          <View className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <View className="flex-row justify-between items-center mb-3">
              <Text style={TYPOGRAPHY.bodyMedium} className="text-white">Materias de Ciencias</Text>
              <Text style={TYPOGRAPHY.labelSemibold} className="text-emerald-400">Excelente</Text>
            </View>
            <View className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <View className="h-full w-[85%] bg-emerald-400 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mt-4 mb-3">
              <Text style={TYPOGRAPHY.bodyMedium} className="text-white">Materias de Letras</Text>
              <Text style={TYPOGRAPHY.labelSemibold} className="text-amber-400">Regular</Text>
            </View>
            <View className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <View className="h-full w-[60%] bg-amber-400 rounded-full" />
            </View>
          </View>
        </Animated.View>

      </ScrollView>
    </AppFrame>
  );
}
