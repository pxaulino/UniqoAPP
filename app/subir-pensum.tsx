import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, CloudUpload, FileText, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, gradients } from '@/constants/mockData';
import Card from '@/components/ui/Card';
import { AddPensumSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { useFakeLoading } from '@/hooks/useFakeLoading';

const steps = ['Informacion', 'Subir archivo', 'Validacion', 'Confirmar'];
const extract = ['Materias y codigos', 'Creditos academicos', 'Prerrequisitos y correquisitos', 'Cuatrimestres/Semestres'];

export default function SubirPensumScreen() {
  const router = useRouter();
  const loading = useFakeLoading(900);

  if (loading) return <AddPensumSkeleton />;

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-8 pt-2">
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={22} color={COLORS.text} />
          </Pressable>
          <Text className="text-[15px] font-bold text-text">Subir Pensum</Text>
          <View className="w-10" />
        </View>

        <View className="mb-6 flex-row items-start">
          {steps.map((step, index) => {
            const active = index <= 1;
            return (
              <View key={step} className="flex-1 items-center">
                <View className="w-full flex-row items-center">
                  {index > 0 ? <View className={`h-[2px] flex-1 ${active ? 'bg-primary' : 'bg-line'}`} /> : <View className="flex-1" />}
                  <View className={`h-5 w-5 items-center justify-center rounded-full ${active ? 'bg-primary' : 'bg-line'}`}>
                    {index < 1 ? <Check size={12} color={COLORS.white} /> : <View className="h-2 w-2 rounded-full bg-white" />}
                  </View>
                  {index < steps.length - 1 ? <View className={`h-[2px] flex-1 ${index < 1 ? 'bg-primary' : 'bg-line'}`} /> : <View className="flex-1" />}
                </View>
                <Text className={`mt-2 text-[11px] font-bold ${active ? 'text-primary' : 'text-muted'}`}>{step}</Text>
              </View>
            );
          })}
        </View>

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

        <Card padding={15} radius={18} className="mb-7" style={{ backgroundColor: '#F3F0FF' }}>
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

        <Pressable
          onPress={() => router.push('/validacion-pensum' as never)}
          className="items-center rounded-[13px] bg-[#5B38F5] py-[17px]"
          style={{
            shadowColor: '#5B38F5',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.18,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          <Text className="text-[15px] font-semibold text-white">Continuar</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="items-center py-5">
          <Text className="text-[15px] font-medium text-muted">Volver</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
