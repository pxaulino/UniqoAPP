import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  BellRing,
  Building2,
  ChevronRight,
  GraduationCap,
  Mail,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS, progressData } from '@/constants/mockData';

const profileRows = [
  { label: 'Universidad activa', value: 'INTEC', icon: Building2, color: COLORS.primary, bg: COLORS.primaryLight },
  { label: 'Carrera', value: 'Ingenieria de Software', icon: GraduationCap, color: COLORS.secondary, bg: COLORS.blueLight },
  { label: 'Correo academico', value: 'daniel@estudiante.edu', icon: Mail, color: COLORS.success, bg: COLORS.successLight },
];

const accountActions = [
  { label: 'Preferencias academicas', icon: Target, color: COLORS.primary, route: '/perfil' },
  { label: 'Notificaciones IA', icon: BellRing, color: COLORS.danger, route: '/notificaciones' },
  { label: 'Privacidad y seguridad', icon: ShieldCheck, color: COLORS.success, route: '/perfil' },
];

export default function CuentaScreen() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-32 pt-3">
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-[21px] font-bold text-text">Perfil</Text>
              <Text className="mt-1 text-[13px] font-semibold text-muted">Tu identidad academica y ajustes</Text>
            </View>
            <Pressable
              onPress={() => router.push('/perfil' as never)}
              className="h-10 w-10 items-center justify-center rounded-2xl bg-white"
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 3,
              }}
            >
              <Settings size={18} color={COLORS.text} />
            </Pressable>
          </View>

          <View
            className="mb-5 overflow-hidden rounded-[22px] bg-[#151326] px-5 py-5"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.14,
              shadowRadius: 28,
              elevation: 10,
            }}
          >
            <View className="absolute right-[-28px] top-[-34px] h-28 w-28 rounded-full bg-white/10" />
            <View className="absolute bottom-[-44px] left-[-38px] h-32 w-32 rounded-full bg-primary/25" />
            <View className="flex-row items-center gap-4">
              <Image
                source={require('@/assets/images/daniel.webp')}
                contentFit="cover"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  borderWidth: 3,
                  borderColor: COLORS.white,
                }}
              />
              <View className="flex-1">
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="rounded-full bg-white/14 px-2.5 py-1">
                    <Text className="text-[11px] font-bold text-white">Activo</Text>
                  </View>
                  <Sparkles size={15} color="#FFD64A" />
                </View>
                <Text className="text-[22px] font-bold text-white">Daniel</Text>
                <Text style={{ color: 'rgba(255,255,255,0.78)' }} className="mt-1 text-[13px] font-semibold">
                  Desarrollo de Software - ITLA
                </Text>
              </View>
            </View>
          </View>

          <Card padding={16} radius={20} className="mb-5">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-[15px] font-bold text-text">Resumen academico</Text>
                <Text className="mt-1 text-[12px] font-semibold text-muted">Progreso principal de tu perfil</Text>
              </View>
              <Text className="text-[18px] font-bold text-primary">{progressData.percent}%</Text>
            </View>
            <ProgressBar progress={progressData.percent / 100} color={COLORS.primary} trackColor="#E4DEFF" height={8} />
            <View className="mt-4 flex-row justify-between">
              <View>
                <Text className="text-[11px] font-semibold text-muted">Creditos</Text>
                <Text className="mt-1 text-[14px] font-bold text-text">
                  {progressData.creditsApproved}/{progressData.totalCredits}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-[11px] font-semibold text-muted">Promedio</Text>
                <Text className="mt-1 text-[14px] font-bold text-text">{progressData.gpa}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[11px] font-semibold text-muted">Graduacion</Text>
                <Text className="mt-1 text-[14px] font-bold text-text">{progressData.graduationDate}</Text>
              </View>
            </View>
          </Card>

          <Text className="mb-3 text-[13px] font-bold uppercase tracking-widest text-muted">Datos del perfil</Text>
          <Card padding={0} radius={20} className="mb-5 overflow-hidden">
            {profileRows.map((row, index) => {
              const Icon = row.icon;
              return (
                <View
                  key={row.label}
                  className={`flex-row items-center gap-3 px-4 py-4 ${index < profileRows.length - 1 ? 'border-b border-bg' : ''}`}
                >
                  <View style={{ backgroundColor: row.bg }} className="h-10 w-10 items-center justify-center rounded-xl">
                    <Icon size={18} color={row.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[12px] font-semibold text-muted">{row.label}</Text>
                    <Text className="mt-0.5 text-[14px] font-bold text-text">{row.value}</Text>
                  </View>
                </View>
              );
            })}
          </Card>

          <Text className="mb-3 text-[13px] font-bold uppercase tracking-widest text-muted">Cuenta</Text>
          <Card padding={0} radius={20} className="overflow-hidden">
            {accountActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.label}
                  onPress={() => router.push(action.route as never)}
                  className={`flex-row items-center gap-3 px-4 py-4 ${index < accountActions.length - 1 ? 'border-b border-bg' : ''}`}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-bg">
                    <Icon size={18} color={action.color} />
                  </View>
                  <Text className="flex-1 text-[14px] font-bold text-text">{action.label}</Text>
                  <ChevronRight size={18} color={COLORS.muted} />
                </Pressable>
              );
            })}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
