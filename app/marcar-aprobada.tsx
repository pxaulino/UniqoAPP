import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS, subjects } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BookOpenCheck,
  CheckSquare,
  Clock3,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const candidates = subjects.filter((subject) => subject.status === 'available' || subject.status === 'in_progress');

export default function MarcarAprobadaScreen() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);

  const selectedSubjects = candidates.filter((subject) => selected.includes(subject.id));
  const creditsToApprove = selectedSubjects.reduce((sum, subject) => sum + subject.credits, 0);
  const filtered = candidates.filter((subject) =>
    `${subject.name} ${subject.code}`.toLowerCase().includes(query.toLowerCase())
  );

  const toggleSubject = (id: string) => {
    Haptics.selectionAsync();
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <Animated.View entering={FadeIn.duration(240)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-9 pt-2">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                shadowOpacity: 0,
              }}
            >
              <ArrowLeft size={22} color={COLORS.text} strokeWidth={2.1} />
            </Pressable>
            <Text style={TYPOGRAPHY.sectionTitle} className="text-center text-[20px] text-text">
              Marcar aprobada
            </Text>
            <View
              className="h-10 w-10 items-center justify-center rounded-2xl bg-white"
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.055,
                shadowRadius: 16,
                elevation: 3,
              }}
            >
              <BookOpenCheck size={19} color={COLORS.primary} strokeWidth={2.1} />
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(420).springify().damping(18)} className="mb-6 overflow-hidden rounded-[24px]">
            <LinearGradient
              colors={['#7B55FF', '#5B38F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="min-h-[190px] px-5 pb-4 pt-4"
              style={{
                shadowColor: '#5B38F5',
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: 0.16,
                shadowRadius: 24,
                elevation: 8,
              }}
            >
              <View className="absolute right-16 top-7 h-3 w-1.5 rotate-45 rounded-full bg-[#FFE45C]" />
              <View className="absolute right-7 top-20 h-2.5 w-1 rotate-45 rounded-full bg-[#9AF5D0]" />
              <View className="absolute right-8 bottom-20 h-2 w-2 rotate-45 rounded-[3px] bg-[#FFD36D]" />
              <View className="absolute right-28 bottom-24 h-2.5 w-1 -rotate-45 rounded-full bg-[#65E4C0]" />

              <View className="z-10 max-w-[58%]">
                <View className="mb-3 flex-row items-center self-start rounded-full bg-white/14 px-2.5 py-1.5">
                  <Sparkles size={12} color={COLORS.white} />
                  <Text style={{ color: 'rgba(255,255,255,0.92)' }} className="ml-1.5 text-[10px] font-bold uppercase tracking-wide">
                    Actualizacion academica
                  </Text>
                </View>
                <Text className="text-[25px] font-bold leading-[31px] text-white">
                  Registra materias completadas
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.88)' }} className="mt-3 text-[13px] font-medium leading-5">
                  Selecciona las asignaturas que ya aprobaste para recalcular creditos y progreso.
                </Text>
              </View>

              <Image
                source={require('@/assets/images/materias-aprobadas.png')}
                contentFit="contain"
                style={{
                  position: 'absolute',
                  right: -4,
                  top: 34,
                  width: 142,
                  height: 142,
                }}
              />

              <View className="z-10 mt-5 flex-row items-center rounded-[18px] border border-white/16 bg-white/13 px-3 py-3">
                <View className="flex-1 flex-row items-center gap-2.5">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-white/16">
                    <BadgeCheck size={20} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-[12px] font-semibold">Creditos a sumar</Text>
                    <Text className="mt-1 text-[23px] font-bold text-white">{creditsToApprove}</Text>
                  </View>
                </View>
                <View className="mx-3 h-12 w-[1px] bg-white/24" />
                <View className="flex-1 flex-row items-center gap-2.5">
                  <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-white/16">
                    <GraduationCap size={21} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-[12px] font-semibold">Materias</Text>
                    <Text className="mt-1 text-[23px] font-bold text-white">{selected.length}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-text">Materias disponibles</Text>
            <Text className="text-[13px] font-bold text-primary">{filtered.length} para revisar</Text>
          </View>

          <View className="mb-4 flex-row gap-3">
            <View
              className="h-[48px] flex-1 flex-row items-center rounded-[15px] bg-white px-3"
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.055,
                shadowRadius: 16,
                elevation: 3,
              }}
            >
              <Search size={17} color={COLORS.muted} strokeWidth={1.9} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar materia o codigo..."
                placeholderTextColor={COLORS.muted}
                className="ml-3 flex-1 text-[14px] font-medium text-text"
              />
            </View>
            <Pressable
              className="h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-white"
              style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.055,
                shadowRadius: 16,
                elevation: 3,
              }}
            >
              <SlidersHorizontal size={17} color={COLORS.muted} strokeWidth={2} />
            </Pressable>
          </View>

          <View className="mb-4">
            {filtered.map((subject, index) => {
              const isSelected = selected.includes(subject.id);
              const isCurrent = subject.status === 'in_progress';
              const color = isCurrent ? COLORS.warning : COLORS.secondary;
              const progress = isCurrent ? 0.84 : subject.id === 'eda201' ? 0.55 : 0.64;

              return (
                <Animated.View key={subject.id} entering={FadeInDown.delay(index * 55).duration(380).springify().damping(18)}>
                  <Pressable onPress={() => toggleSubject(subject.id)}>
                    <Card padding={0} radius={20} className="mb-3 overflow-hidden">
                      <View className="flex-row items-center gap-3 px-3 py-3.5">
                        <View
                          className="h-11 w-11 items-center justify-center rounded-[14px]"
                          style={{ backgroundColor: isCurrent ? COLORS.warningLight : COLORS.blueLight }}
                        >
                          <Clock3 size={21} color={color} strokeWidth={2.1} />
                        </View>
                        <View className="flex-1">
                          <View className="mb-1.5 flex-row items-start justify-between gap-2">
                            <Text className="flex-1 text-[15px] font-bold text-text">{subject.name}</Text>
                            <View
                              className="rounded-full px-2.5 py-1"
                              style={{ backgroundColor: isCurrent ? COLORS.warningLight : COLORS.blueLight }}
                            >
                              <Text style={{ color }} className="text-[11px] font-bold">
                                {isCurrent ? 'En curso' : 'Disponible'}
                              </Text>
                            </View>
                          </View>
                          <Text className="mb-2 text-[12px] font-semibold text-muted">
                            {subject.code} - {subject.credits} creditos
                          </Text>
                          <ProgressBar progress={progress} color={color} trackColor="#EEEAFB" height={5} />
                        </View>
                        <View
                          className="h-7 w-7 items-center justify-center rounded-lg border-2"
                          style={{
                            borderColor: isSelected ? COLORS.primary : '#B8B5C8',
                            backgroundColor: isSelected ? COLORS.primary : 'transparent',
                          }}
                        >
                          {isSelected ? <CheckSquare size={17} color={COLORS.white} strokeWidth={2.4} /> : null}
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <Card padding={0} radius={22} className="mb-5 overflow-hidden" style={{ backgroundColor: '#F2ECFF' }}>
            <View className="flex-row items-center px-4 py-4">
              <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-white">
                <Award size={21} color={COLORS.primary} strokeWidth={2} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[15px] font-bold text-text">Calificacion final estimada</Text>
                <Text className="mt-1 text-[12px] font-semibold text-muted">Usada para estimar tu promedio</Text>
              </View>
              <View className="items-end">
                <Text className="text-[30px] font-bold text-primary">90</Text>
                <Text className="text-[12px] font-semibold text-muted">Actual</Text>
              </View>
            </View>
            <View className="mx-4 mb-4 flex-row items-center justify-center rounded-full bg-white py-2.5">
              <TrendingUp size={15} color={COLORS.success} />
              <Text className="ml-2 text-[13px] font-bold text-success">+5%</Text>
              <Text className="text-[13px] font-semibold text-muted"> desde tu ultima actualizacion</Text>
            </View>
          </Card>

          <Pressable
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            className="flex-row items-center justify-center rounded-[15px] bg-[#6C4DFF] py-[17px]"
            style={{
              shadowColor: '#5B38F5',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <CheckSquare size={20} color={COLORS.white} strokeWidth={2.3} />
            <Text className="ml-3 text-[15px] font-bold text-white">Marcar seleccionadas ({selected.length})</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
