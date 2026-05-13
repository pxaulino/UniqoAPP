import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  Clock3,
  CreditCard,
  GitBranch,
  Lightbulb,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { COLORS, simulationImpactBySubject, simulationTypes, simulatorSubjects } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import { SimulatorSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

const severityColor = {
  Alta: COLORS.danger,
  Media: COLORS.warning,
  Baja: COLORS.success,
};

const riskTone = {
  Alto: { color: COLORS.danger, label: 'ruta critica' },
  Medio: { color: '#C98204', label: 'revisar plan' },
  Bajo: { color: COLORS.success, label: 'impacto bajo' },
};

export default function SimuladorScreen() {
  const [active, setActive] = useState('retirar');
  const [subject, setSubject] = useState(simulatorSubjects[0].id);
  const router = useRouter();
  const loading = useFakeLoading(900);

  const selectedSubject = simulatorSubjects.find((item) => item.id === subject) ?? simulatorSubjects[0];
  const impact = simulationImpactBySubject[subject as keyof typeof simulationImpactBySubject];
  const tone = riskTone[impact.risk as keyof typeof riskTone] ?? riskTone.Medio;
  const nextSubjectIndex = useMemo(
    () => (simulatorSubjects.findIndex((item) => item.id === subject) + 1) % simulatorSubjects.length,
    [subject]
  );

  if (loading) return <SimulatorSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-36 pt-2">
        <View className="mb-7 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={22} color={COLORS.text} />
          </Pressable>
          <Text className="text-[22px] font-bold text-text">Simulador</Text>
          <View className="h-10 w-10" />
        </View>

        <View className="mb-5 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[20px] font-bold text-text">Que quieres simular?</Text>
            <Text className="mt-2 text-[15px] font-medium leading-6 text-muted">
              Descubre como tus decisiones afectan tu tiempo de graduacion.
            </Text>
          </View>
          <View className="h-[96px] w-[96px] items-center justify-end overflow-hidden rounded-[22px] bg-primary/5">
            <Image
              source={require('@/assets/images/estudiante-pensando.png')}
              contentFit="contain"
              style={{ width: 100, height: 100 }}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          <View className="flex-row gap-2">
            {simulationTypes.map((type) => {
              const selectedType = active === type.id;
              return (
                <Pressable
                  key={type.id}
                  onPress={() => setActive(type.id)}
                  className={`rounded-[10px] px-4 py-3 ${selectedType ? 'bg-[#5B38F5]' : 'bg-white'}`}
                  style={
                    selectedType
                      ? {
                          shadowColor: '#5B38F5',
                          shadowOffset: { width: 0, height: 6 },
                          shadowOpacity: 0.14,
                          shadowRadius: 12,
                          elevation: 5,
                        }
                      : undefined
                  }
                >
                  <Text className={`text-[13px] font-semibold ${selectedType ? 'text-white' : 'text-muted'}`}>
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-[13px] font-bold text-text">Materia a retirar</Text>
          <Text className="text-[12px] font-medium text-muted">{impact.confidence}% confianza</Text>
        </View>
        <Card padding={14} radius={18} className="mb-5">
          <Pressable
            onPress={() => setSubject(simulatorSubjects[nextSubjectIndex].id)}
            className="flex-row items-center gap-3"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-blueLight">
              <CreditCard size={18} color={COLORS.secondary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-text">{selectedSubject.name}</Text>
              <Text className="mt-0.5 text-[13px] font-medium text-muted">
                {selectedSubject.code} · {selectedSubject.credits} creditos
              </Text>
            </View>
            <ChevronDown size={18} color={COLORS.text} />
          </Pressable>
        </Card>

        <Card padding={16} radius={20} className="mb-4">
          <View className="mb-5 flex-row items-start justify-between">
            <View>
              <Text className="text-[16px] font-bold text-text">Impacto estimado</Text>
              <Text className="mt-0.5 text-[11px] font-medium text-muted">Actualizado con tu carga actual</Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-center gap-1.5">
                <View style={{ backgroundColor: tone.color }} className="h-1.5 w-1.5 rounded-full" />
                <Text style={{ color: tone.color }} className="text-[11px] font-semibold">{tone.label}</Text>
              </View>
              <Text className="mt-0.5 text-[10px] font-medium text-muted">riesgo {impact.risk.toLowerCase()}</Text>
            </View>
          </View>

          {[
            { label: 'Nuevo tiempo estimado', value: impact.estimate, icon: Clock3, sub: impact.delay },
            { label: 'Materias afectadas', value: `${impact.affected.length} materias`, icon: CalendarClock },
            { label: 'Creditos retrasados', value: `${impact.creditsDelayed} creditos`, icon: CreditCard },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.label} className="mb-4 flex-row items-center gap-3">
                <Icon size={17} color={COLORS.muted} strokeWidth={2} />
                <Text className="flex-1 text-[13px] font-medium text-muted">{item.label}</Text>
                <View className="items-end">
                  <Text className="text-[14px] font-semibold text-text">{item.value}</Text>
                  {item.sub ? <Text className="mt-0.5 text-[11px] font-semibold text-warning">{item.sub}</Text> : null}
                </View>
              </View>
            );
          })}

          <View className="mt-1 flex-row gap-3 rounded-[14px] bg-[#FFF8EF] px-4 py-3.5">
            <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-white">
              <AlertTriangle size={15} color={COLORS.warning} />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-bold text-text">Conviene revisarlo</Text>
              <Text className="mt-1 text-[13px] font-medium leading-5 text-muted">
                Retirar esta materia mueve parte del bloque tecnico. No es grave, pero puede apretar el proximo cuatrimestre.
              </Text>
            </View>
          </View>
        </Card>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[16px] font-bold text-text">Materias afectadas</Text>
          <Text className="text-[12px] font-semibold text-primary">Orden inteligente</Text>
        </View>
        <Card padding={0} radius={20} className="mb-4 overflow-hidden">
          {impact.affected.map((item, index) => {
            const color = severityColor[item.severity as keyof typeof severityColor] ?? COLORS.warning;
            return (
              <View key={item.code} className={`flex-row gap-3 px-4 py-3.5 ${index < impact.affected.length - 1 ? 'border-b border-bg' : ''}`}>
                <View style={{ backgroundColor: `${color}18` }} className="h-10 w-10 items-center justify-center rounded-xl">
                  <GitBranch size={18} color={color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between gap-3">
                    <Text className="text-[14px] font-bold text-text">{item.name}</Text>
                    <View className="flex-row items-center gap-1.5">
                      <View style={{ backgroundColor: color }} className="h-1.5 w-1.5 rounded-full" />
                      <Text style={{ color }} className="text-[11px] font-medium">{item.severity}</Text>
                    </View>
                  </View>
                  <Text className="mt-0.5 text-[12px] font-medium text-muted">
                    {item.code} · {item.credits} creditos
                  </Text>
                  <Text className="mt-1 text-[12px] font-medium leading-4 text-muted">{item.reason}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        <Card padding={15} radius={18} className="mb-5" style={{ backgroundColor: '#F1ECFF' }}>
          <View className="flex-row gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
              <Lightbulb size={18} color={COLORS.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-primary">Sugerencia para tu plan</Text>
              <Text className="mt-1 text-[13px] font-medium leading-5 text-muted">{impact.recommendation}</Text>
            </View>
          </View>
        </Card>

        <Pressable
          className="items-center rounded-[13px] bg-[#5B38F5] py-[17px]"
          style={{
            shadowColor: '#5B38F5',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text className="text-[15px] font-semibold text-white">Ver simulacion detallada</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
