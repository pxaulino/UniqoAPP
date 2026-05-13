import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, BookOpen, Clock, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';

const RECOMENDACIONES = [
  { 
    id: '1', 
    title: 'Estructura de Datos', 
    credits: 4, 
    reason: 'Prerrequisito crítico para 3 materias el próximo ciclo',
    difficulty: 'Alta',
    time: '8h / semana',
    color: '#8B5CF6'
  },
  { 
    id: '2', 
    title: 'Ética Profesional', 
    credits: 2, 
    reason: 'Ideal para balancear la carga pesada',
    difficulty: 'Baja',
    time: '2h / semana',
    color: '#10B981'
  },
  { 
    id: '3', 
    title: 'Bases de Datos', 
    credits: 4, 
    reason: 'Continúa tu ruta de especialización',
    difficulty: 'Media',
    time: '5h / semana',
    color: '#3B82F6'
  }
];

export default function RecomendacionesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <View className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
          <Sparkles size={16} color={COLORS.primary} className="mr-2" />
          <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">Motor IA</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} className="px-6 mt-2">
        <Text style={TYPOGRAPHY.screenTitle} className="text-text text-[28px] mb-2">Sugerencias del Ciclo</Text>
        <Text style={TYPOGRAPHY.body} className="text-muted text-[15px] mb-8">Basado en tu progreso y las estadísticas de otros estudiantes, esta es la ruta más óptima para tu próximo cuatrimestre.</Text>

        {RECOMENDACIONES.map((item, index) => (
          <Animated.View 
            key={item.id}
            entering={FadeInDown.delay(index * 150).springify()}
            className="bg-white rounded-[24px] p-5 mb-4 border border-gray-100"
            style={{ shadowColor: COLORS.primary, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 }}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center flex-1">
                <View className="h-10 w-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${item.color}15` }}>
                  <BookOpen size={18} color={item.color} />
                </View>
                <View className="flex-1 pr-2">
                  <Text style={TYPOGRAPHY.cardTitle} className="text-text" numberOfLines={1}>{item.title}</Text>
                  <Text style={TYPOGRAPHY.label} className="text-muted">{item.credits} Créditos</Text>
                </View>
              </View>
              <View className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Text style={TYPOGRAPHY.labelSemibold} className="text-text">Add +</Text>
              </View>
            </View>

            <View className="bg-indigo-50/50 rounded-xl p-3 mb-4 flex-row items-start border border-indigo-50">
              <Sparkles size={14} color={COLORS.primary} className="mr-2 mt-0.5" />
              <Text style={TYPOGRAPHY.bodyMedium} className="text-primary flex-1 leading-5">{item.reason}</Text>
            </View>

            <View className="flex-row items-center justify-between px-1">
              <View className="flex-row items-center">
                <AlertCircle size={14} color="#6B7280" className="mr-1.5" />
                <Text style={TYPOGRAPHY.label} className="text-muted">Dificultad: <Text className="text-text">{item.difficulty}</Text></Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#6B7280" className="mr-1.5" />
                <Text style={TYPOGRAPHY.label} className="text-muted">{item.time}</Text>
              </View>
            </View>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(600).springify()} className="mt-6">
          <Pressable className="bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30">
            <Text style={TYPOGRAPHY.button} className="text-white">Aceptar sugerencia (10 Cr.)</Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </AppFrame>
  );
}
