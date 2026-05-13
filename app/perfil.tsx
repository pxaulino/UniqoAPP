import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, BellRing, Target, DownloadCloud, GraduationCap, Building2, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';

const SETTINGS = [
  { id: '1', title: 'Preferencias Académicas', icon: GraduationCap, color: '#8B5CF6' },
  { id: '2', title: 'Metas de Estudio', icon: Target, color: '#10B981' },
  { id: '3', title: 'Cambiar Universidad', icon: Building2, color: '#F59E0B' },
  { id: '4', title: 'Exportar Progreso', icon: DownloadCloud, color: '#3B82F6' },
];

export default function PerfilSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
        <Text style={TYPOGRAPHY.sectionTitle} className="text-text">Configuración</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} className="px-6 mt-4">
        
        {/* Toggles */}
        <Animated.View entering={FadeInDown.springify()} className="bg-white rounded-[24px] p-2 mb-6 border border-gray-100" style={{ shadowColor: COLORS.primary, shadowOpacity: 0.04, shadowRadius: 15, elevation: 2 }}>
          <View className="flex-row items-center justify-between p-4 border-b border-gray-50">
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-full bg-indigo-50 items-center justify-center mr-4">
                <Moon size={18} color="#6366F1" />
              </View>
              <Text style={TYPOGRAPHY.cardTitle} className="text-text">Modo Oscuro</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="h-10 w-10 rounded-full bg-rose-50 items-center justify-center mr-4">
                <BellRing size={18} color="#E11D48" />
              </View>
              <Text style={TYPOGRAPHY.cardTitle} className="text-text">Notificaciones IA</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Animated.View>

        {/* Action List */}
        <Text style={TYPOGRAPHY.cardTitle} className="text-muted uppercase tracking-widest text-[11px] mb-4 ml-2">General</Text>
        <Animated.View entering={FadeInDown.delay(100).springify()} className="bg-white rounded-[24px] overflow-hidden border border-gray-100" style={{ shadowColor: COLORS.primary, shadowOpacity: 0.04, shadowRadius: 15, elevation: 2 }}>
          {SETTINGS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable 
                key={item.id}
                className={`flex-row items-center justify-between p-4 ${index !== SETTINGS.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <View className="flex-row items-center">
                  <View className="h-10 w-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={18} color={item.color} />
                  </View>
                  <Text style={TYPOGRAPHY.cardTitle} className="text-text">{item.title}</Text>
                </View>
                <ChevronRight size={20} color="#D1D5DB" />
              </Pressable>
            );
          })}
        </Animated.View>

      </ScrollView>
    </AppFrame>
  );
}
