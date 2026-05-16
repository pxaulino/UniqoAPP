import React from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  CloudUpload,
  FileText,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurriculumGraph from '@/components/CurriculumGraph';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import { addUniversitySteps, COLORS, gradients, validationSubjects } from '@/constants/mockData';
import { AddUniversitySkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

const flowSteps = ['Informacion', 'Archivo', 'Validacion', 'Mapa'];
const extract = ['Materias y codigos', 'Creditos academicos', 'Prerrequisitos y correquisitos', 'Cuatrimestres/Semestres'];

type FlowStep = 0 | 1 | 2 | 3;

type AddUniversityFlowProps = {
  initialStep?: FlowStep;
};

function clampStep(step: number): FlowStep {
  if (step <= 0) return 0;
  if (step >= 3) return 3;
  return step as FlowStep;
}

function Stepper({ activeStep }: { activeStep: FlowStep }) {
  return (
    <View className="mb-6 flex-row items-start">
      {flowSteps.map((step, index) => {
        const completed = index < activeStep;
        const active = index <= activeStep;

        return (
          <View key={step} className="flex-1 items-center">
            <View className="w-full flex-row items-center">
              {index > 0 ? (
                <View className={`h-[2px] flex-1 ${active ? 'bg-primary' : 'bg-line'}`} />
              ) : (
                <View className="flex-1" />
              )}
              <View className={`h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-primary' : 'bg-line'}`}>
                {completed ? (
                  <Check size={13} color={COLORS.white} strokeWidth={3} />
                ) : (
                  <View className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : 'bg-muted/40'}`} />
                )}
              </View>
              {index < flowSteps.length - 1 ? (
                <View className={`h-[2px] flex-1 ${completed ? 'bg-primary' : 'bg-line'}`} />
              ) : (
                <View className="flex-1" />
              )}
            </View>
            <Text className={`mt-2 text-[10px] font-bold ${active ? 'text-primary' : 'text-muted'}`}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}

function WelcomeStep() {
  return (
    <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutLeft.duration(160)}>
      <View className="mb-7 items-center">
        <View className="h-[168px] w-full items-center justify-end overflow-hidden">
          <Image
            source={require('@/assets/images/universidad.png')}
            contentFit="contain"
            style={{ width: 348, height: 168 }}
          />
        </View>
        <Text className="mt-4 text-center text-[22px] font-bold text-text">No encuentras tu universidad?</Text>
        <Text className="mt-2 max-w-[300px] text-center text-[15px] font-medium leading-6 text-muted">
          Agrega tu universidad y sube el pensum para comenzar a planificar tu carrera.
        </Text>
      </View>

      {addUniversitySteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Card key={step.title} delay={index * 70} padding={14} radius={20} className="mb-3">
            <View className="flex-row items-center gap-4">
              <View style={{ backgroundColor: step.bg }} className="h-12 w-12 items-center justify-center rounded-2xl">
                <Icon size={22} color={step.color} strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-text">{step.title}</Text>
                <Text className="mt-1 text-[13px] font-semibold text-muted">{step.subtitle}</Text>
              </View>
            </View>
          </Card>
        );
      })}
    </Animated.View>
  );
}

function UploadStep() {
  return (
    <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutLeft.duration(160)}>
      <Card padding={18} radius={24} className="mb-4">
        <Text className="text-center text-[17px] font-bold text-text">Sube el pensum de tu carrera</Text>
        <Text className="mt-1 text-center text-[13px] font-semibold text-muted">Formatos aceptados: PDF, JPG, PNG o Excel</Text>
        <View className="mt-5 items-center rounded-[18px] border border-dashed border-primary/60 bg-bg px-5 py-8">
          <LinearGradient colors={gradients.primary} className="h-14 w-14 items-center justify-center rounded-full">
            <CloudUpload size={30} color={COLORS.white} />
          </LinearGradient>
          <Text className="mt-4 text-[14px] font-bold text-text">Arrastra tu archivo aqui</Text>
          <Text className="mt-1 text-[13px] font-bold text-primary">o selecciona un archivo</Text>
          <Text className="mt-4 text-[11px] font-semibold text-muted">Max. 20MB</Text>
        </View>
      </Card>

      <Card padding={12} radius={16} className="mb-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-dangerLight">
            <FileText size={20} color={COLORS.danger} />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-text">Pensum_Ingenieria_Sistemas.pdf</Text>
            <Text className="mt-0.5 text-[11px] font-semibold text-muted">2.4 MB</Text>
          </View>
          <X size={16} color={COLORS.text} />
        </View>
      </Card>

      <Card padding={15} radius={18} className="mb-2" style={{ backgroundColor: '#F3F0FF' }}>
        <Text className="mb-3 text-[13px] font-bold text-primary">Nuestro sistema extraera automaticamente:</Text>
        {extract.map((item) => (
          <View key={item} className="mb-2 flex-row items-center gap-2">
            <View className="h-4 w-4 items-center justify-center rounded-full border border-primary">
              <Check size={10} color={COLORS.primary} />
            </View>
            <Text className="text-[13px] font-semibold text-text">{item}</Text>
          </View>
        ))}
      </Card>
    </Animated.View>
  );
}

function ValidationStep() {
  return (
    <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutLeft.duration(160)}>
      <View className="items-center pt-2">
        <LinearGradient colors={gradients.success} className="h-20 w-20 items-center justify-center rounded-full">
          <Check size={42} color={COLORS.white} strokeWidth={2.6} />
        </LinearGradient>
        <Text className="mt-5 text-center text-[18px] font-bold text-text">Pensum procesado con exito!</Text>
        <Text className="mt-1 text-center text-[13px] font-semibold text-muted">
          Hemos encontrado 48 materias en tu pensum
        </Text>
      </View>

      <View className="mt-5 flex-row gap-2">
        <StatCard label="Materias detectadas" value="48" color={COLORS.primary} style={{ flex: 1 }} />
        <StatCard label="Creditos totales" value="156" color={COLORS.primary} delay={60} style={{ flex: 1 }} />
        <StatCard label="Cuatrimestres" value="10" color={COLORS.primary} delay={120} style={{ flex: 1 }} />
      </View>

      <Card padding={16} radius={22} className="mt-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[14px] font-bold text-text">Vista previa de materias</Text>
          <Text className="text-[13px] font-bold text-primary">Ver todas</Text>
        </View>
        {validationSubjects.map((subject, index) => (
          <View key={subject.code} className="flex-row items-center gap-3 border-b border-bg py-3">
            <Text className="w-4 text-[14px] font-bold text-text">{index + 1}</Text>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-text">{subject.name}</Text>
              <Text className="mt-1 text-[11px] font-semibold text-muted">
                {subject.code} - {subject.credits} creditos
              </Text>
            </View>
            {subject.ok ? (
              <CheckCircle2 size={18} color={COLORS.success} />
            ) : (
              <AlertTriangle size={18} color={COLORS.warning} />
            )}
          </View>
        ))}
        <Text className="mt-3 text-[13px] font-semibold text-muted">... y 45 materias mas</Text>
      </Card>
    </Animated.View>
  );
}

function MapStep() {
  const legend = [
    { label: 'Aprobada', color: COLORS.success },
    { label: 'Disponible', color: COLORS.secondary },
    { label: 'En curso', color: COLORS.warning },
    { label: 'Bloqueada', color: '#78728E' },
  ];

  return (
    <Animated.View entering={FadeInRight.duration(220)} exiting={FadeOutLeft.duration(160)}>
      <View className="items-center">
        <LinearGradient colors={gradients.primary} className="h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 size={34} color={COLORS.white} strokeWidth={2.4} />
        </LinearGradient>
        <Text className="mt-4 text-center text-[19px] font-bold text-text">Universidad creada</Text>
        <Text className="mt-1 max-w-[290px] text-center text-[13px] font-semibold leading-5 text-muted">
          Tu mapa academico esta listo para revisar dentro de este mismo flujo.
        </Text>
      </View>

      <Card padding={0} radius={24} className="mt-5 overflow-hidden">
        <View className="border-b border-bg px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-bold text-text">Mapa del Pensum</Text>
            <View className="h-9 w-9 items-center justify-center rounded-2xl bg-bg">
              <SlidersHorizontal size={17} color={COLORS.text} />
            </View>
          </View>
          <View className="mt-3 flex-row flex-wrap items-center gap-x-4 gap-y-2">
            {legend.map((item) => (
              <View key={item.label} className="flex-row items-center gap-2">
                <View style={{ backgroundColor: item.color }} className="h-2.5 w-2.5 rounded-full" />
                <Text className="text-[11px] font-medium text-muted">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="h-[520px] items-center overflow-hidden bg-bg pt-2">
          <CurriculumGraph />
        </View>
      </Card>
    </Animated.View>
  );
}

export default function AddUniversityFlow({ initialStep = 0 }: AddUniversityFlowProps) {
  const router = useRouter();
  const loading = useFakeLoading(650);
  const [step, setStep] = React.useState<FlowStep>(initialStep);

  const goBack = React.useCallback(() => {
    if (step > 0) {
      setStep((current) => clampStep(current - 1));
      return;
    }

    router.back();
  }, [router, step]);

  const goNext = React.useCallback(() => {
    if (step < 3) {
      setStep((current) => clampStep(current + 1));
      return;
    }

    router.replace('/(tabs)/mapa' as never);
  }, [router, step]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step > 0) {
          setStep((current) => clampStep(current - 1));
          return true;
        }

        return false;
      });

      return () => subscription.remove();
    }, [step])
  );

  const title = flowSteps[step];
  const primaryLabel = step === 0 ? 'Comenzar' : step === 1 ? 'Continuar' : step === 2 ? 'Confirmar y ver mapa' : 'Abrir mapa completo';
  const secondaryLabel = step === 0 ? 'Cancelar' : 'Volver';

  if (loading) return <AddUniversitySkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8 pt-2">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={goBack} className="h-10 w-10 items-center justify-center rounded-2xl">
              <ArrowLeft size={22} color={COLORS.text} />
            </Pressable>
            <View className="items-center">
              <Text className="text-[15px] font-bold text-text">Agregar Universidad</Text>
              <Text className="mt-0.5 text-[11px] font-semibold text-muted">{title}</Text>
            </View>
            <View className="w-10" />
          </View>

          <Stepper activeStep={step} />

          {step === 0 ? <WelcomeStep /> : null}
          {step === 1 ? <UploadStep /> : null}
          {step === 2 ? <ValidationStep /> : null}
          {step === 3 ? <MapStep /> : null}

          <Pressable
            onPress={goNext}
            className="mt-7 items-center rounded-[13px] bg-[#5B38F5] py-[17px]"
            style={{
              shadowColor: '#5B38F5',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.18,
              shadowRadius: 18,
              elevation: 8,
            }}
          >
            <Text className="text-[15px] font-semibold text-white">{primaryLabel}</Text>
          </Pressable>
          <Pressable onPress={goBack} className="items-center py-5">
            <Text className="text-[15px] font-medium text-muted">{secondaryLabel}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
