import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronDown, Clock3, Layers3 } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/ui/Card';
import { AcademicRecord, AcademicRecordStatus, academicRecords, COLORS } from '@/constants/mockData';

const pageConfig = {
  approved: {
    title: 'Materias aprobadas',
    subtitle: 'Historial organizado por cuatrimestre',
    label: 'Aprobada',
    icon: CheckCircle2,
    color: COLORS.success,
    bg: COLORS.successLight,
  },
  pending: {
    title: 'Materias pendientes',
    subtitle: 'Lo que falta por completar en tu ruta',
    label: 'Pendiente',
    icon: CalendarDays,
    color: COLORS.danger,
    bg: COLORS.dangerLight,
  },
  in_progress: {
    title: 'Materias en curso',
    subtitle: 'Carga academica seleccionada actualmente',
    label: 'En curso',
    icon: Clock3,
    color: COLORS.warning,
    bg: COLORS.warningLight,
  },
} satisfies Record<AcademicRecordStatus, {
  title: string;
  subtitle: string;
  label: string;
  icon: typeof CheckCircle2;
  color: string;
  bg: string;
}>;

function groupBySemester(records: AcademicRecord[]) {
  return records.reduce<Record<number, AcademicRecord[]>>((groups, record) => {
    groups[record.semester] = [...(groups[record.semester] ?? []), record];
    return groups;
  }, {});
}

export default function MateriasByStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const type = params.type === 'pending' || params.type === 'in_progress' ? params.type : 'approved';
  const config = pageConfig[type];
  const Icon = config.icon;
  const records = academicRecords.filter((record) => record.status === type);
  const totalCredits = records.reduce((sum, record) => sum + record.credits, 0);
  const grouped = groupBySemester(records);
  const semesters = Object.keys(grouped).map(Number).sort((a, b) => a - b);
  const [openSemesters, setOpenSemesters] = React.useState<number[]>(() => (semesters[0] ? [semesters[0]] : []));

  const toggleSemester = (semester: number) => {
    setOpenSemesters((current) =>
      current.includes(semester)
        ? current.filter((item) => item !== semester)
        : [...current, semester]
    );
  };

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-10 pt-3">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <ArrowLeft size={21} color={COLORS.text} />
            </Pressable>
            <Text className="text-[16px] font-bold text-text">Detalle academico</Text>
            <View className="h-10 w-10" />
          </View>

          <View
            className="mb-5 overflow-hidden rounded-[22px] bg-[#151326] px-5 py-5"
            style={{
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.14,
              shadowRadius: 28,
              elevation: 9,
            }}
          >
            <View className="absolute right-[-40px] top-[-36px] h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute bottom-[-54px] left-[-42px] h-36 w-36 rounded-full bg-primary/25" />
            <View className="flex-row items-center gap-4">
              <View style={{ backgroundColor: config.bg }} className="h-16 w-16 items-center justify-center rounded-[20px]">
                <Icon size={30} color={config.color} strokeWidth={2.4} />
              </View>
              <View className="flex-1">
                <Text className="text-[24px] font-bold text-white">{config.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.76)' }} className="mt-1 text-[13px] font-semibold leading-5">
                  {config.subtitle}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-5 flex-row gap-3">
            <Card padding={14} radius={18} className="flex-1">
              <Text className="text-[12px] font-semibold text-muted">Materias</Text>
              <Text className="mt-2 text-[22px] font-bold text-text">{records.length}</Text>
            </Card>
            <Card padding={14} radius={18} className="flex-1">
              <Text className="text-[12px] font-semibold text-muted">Creditos</Text>
              <Text className="mt-2 text-[22px] font-bold text-text">{totalCredits}</Text>
            </Card>
            <Card padding={14} radius={18} className="flex-1">
              <Text className="text-[12px] font-semibold text-muted">Periodos</Text>
              <Text className="mt-2 text-[22px] font-bold text-text">{semesters.length}</Text>
            </Card>
          </View>

          {semesters.map((semester) => {
            const semesterRecords = grouped[semester];
            const semesterCredits = semesterRecords.reduce((sum, record) => sum + record.credits, 0);
            const isOpen = openSemesters.includes(semester);

            return (
              <Animated.View
                key={semester}
                layout={LinearTransition.duration(160)}
                className="mb-4"
              >
                <Pressable
                  onPress={() => toggleSemester(semester)}
                  className="flex-row items-center gap-3 rounded-[18px] bg-white px-4 py-4"
                  style={{
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.055,
                    shadowRadius: 18,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(108,77,255,0.06)',
                  }}
                >
                  <View style={{ backgroundColor: config.bg }} className="h-11 w-11 items-center justify-center rounded-[14px]">
                    <Layers3 size={18} color={config.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[16px] font-bold text-text">Cuatrimestre {semester}</Text>
                    <Text className="mt-1 text-[12px] font-semibold text-muted">
                      {semesterRecords.length} materias - {semesterCredits} creditos
                    </Text>
                  </View>
                  <Animated.View
                    layout={LinearTransition.duration(120)}
                    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                    className="h-9 w-9 items-center justify-center rounded-full bg-bg"
                  >
                    <ChevronDown size={18} color={COLORS.text} />
                  </Animated.View>
                </Pressable>

                {isOpen ? (
                  <Animated.View
                    layout={LinearTransition.duration(160)}
                    className="mt-3"
                  >
                    <Card
                      padding={0}
                      radius={20}
                      border={false}
                      className="overflow-hidden"
                      style={{ backgroundColor: 'rgba(255,255,255,0.98)' }}
                    >
                      {semesterRecords.map((record, index) => (
                        <View
                          key={record.id}
                          className="flex-row items-center gap-3 px-4 py-4"
                          style={
                            index < semesterRecords.length - 1
                              ? { borderBottomWidth: 1, borderBottomColor: 'rgba(108,77,255,0.045)' }
                              : undefined
                          }
                        >
                          <View style={{ backgroundColor: config.bg }} className="h-10 w-10 items-center justify-center rounded-xl">
                            <Icon size={19} color={config.color} strokeWidth={2.4} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-[14px] font-bold text-text">{record.name}</Text>
                            <Text className="mt-0.5 text-[12px] font-semibold text-muted">
                              {record.code} - {record.credits} creditos
                            </Text>
                          </View>
                          <View style={{ backgroundColor: config.bg }} className="rounded-full px-3 py-1.5">
                            <Text style={{ color: config.color }} className="text-[11px] font-bold">{config.label}</Text>
                          </View>
                        </View>
                      ))}
                    </Card>
                  </Animated.View>
                ) : null}
              </Animated.View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
