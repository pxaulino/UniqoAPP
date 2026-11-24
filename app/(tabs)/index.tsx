import { FormButton } from '@/components/academic/AcademicForm';
import { STATUS_COLORS } from '@/components/academic/subjectStyles';
import Card from '@/components/ui/Card';
import GradientCard from '@/components/ui/GradientCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS } from '@/constants/mockData';
import { formatAverage, STATUS_LABELS, subjectStatus } from '@/src/academic/calculations';
import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { Bell, BookMarked, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

function StatTile({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <Card padding={14} radius={18} style={{ width: '48%', marginBottom: 12 }}>
      <View style={{ backgroundColor: bg }} className="mb-3 h-11 w-11 items-center justify-center rounded-[14px]">
        {icon}
      </View>
      <Text style={{ color }} className="text-[24px] font-bold">
        {value}
      </Text>
      <Text className="mt-1 text-[12px] font-semibold leading-4 text-muted">{label}</Text>
    </Card>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile, plan, subjects, periods, activePeriodId, rules } = useAcademicStore((state) => state.data);
  const recovered = useAcademicStore((state) => state.recovered);
  const summary = useAcademicSummary();
  const firstName = profile?.name.split(/\s+/)[0] || 'Estudiante';
  const universityName = plan?.university ?? 'Universidad pendiente';
  const careerName = plan?.career ?? 'Carrera pendiente';
  const pensumName = plan?.curriculum ?? 'Pensum pendiente';
  const subjectsPreview = subjects.slice(0, 5);
  const periodoLabel = periods.find(({ id }) => id === activePeriodId)?.name ?? 'Sin período';
  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-36 pt-3"
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable accessibilityRole="button" accessibilityLabel="Editar perfil" onPress={() => router.push('/perfil')} className="flex-1 flex-row items-center gap-3">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-2xl bg-primaryLight"><Text className="text-[20px] font-bold text-primary">{firstName[0]?.toUpperCase()}</Text></View>
              <View className="flex-1">
                <Text className="text-[21px] font-bold text-text">Hola, {firstName}</Text>
                <Text className="mt-1 text-[12px] font-semibold text-muted" numberOfLines={1}>
                  {universityName}
                </Text>
                <Text className="text-[12px] font-semibold text-muted" numberOfLines={1}>
                  {careerName}
                </Text>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button" accessibilityLabel="Ver recordatorios" onPress={() => router.push('/notificaciones')}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
            >
              <Bell size={22} color={COLORS.text} strokeWidth={1.9} />
            </Pressable>
          </View>

          {recovered ? <Text accessibilityRole="alert" className="mb-3 font-semibold text-primary">Se recuperó una copia local de tus datos.</Text> : null}
          <Animated.View entering={FadeInDown.duration(420).springify().damping(18)}>
            <GradientCard colors={['#F8F5FF', '#E9E1FF']} padding={18} radius={22} className="mb-5">
              <View className="mb-4 flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-[13px] font-bold uppercase text-primary">Progreso general</Text>
                  <Text className="mt-2 text-[38px] font-bold text-text">{summary.percent}%</Text>
                  <Text className="mt-1 text-[13px] font-semibold text-muted" numberOfLines={1}>
                    {pensumName}
                  </Text>
                </View>
                <View className="rounded-[16px] bg-white/80 px-3 py-2">
                  <Text className="text-[11px] font-bold text-primary">Período</Text>
                  <Text className="mt-1 text-[16px] font-bold text-text">{periodoLabel}</Text>
                </View>
              </View>
              <ProgressBar progress={summary.percent / 100} color={COLORS.primary} trackColor="#D9D1FF" height={8} />
              <View className="mt-5 flex-row">
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold text-muted">Créditos</Text>
                  <Text className="mt-1 text-[18px] font-bold text-text">
                    {summary.earnedCredits} / {summary.totalCredits}
                  </Text>
                </View>
                <View className="mx-4 w-[1px] bg-line" />
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold text-muted">Materias</Text>
                  <Text className="mt-1 text-[18px] font-bold text-text">
                    {summary.approved} / {summary.totalSubjects}
                  </Text>
                </View>
              </View>
            </GradientCard>
          </Animated.View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-text">Resumen académico</Text>
            <Pressable onPress={() => router.navigate('/(tabs)/progreso')}>
              <Text className="text-[13px] font-bold text-primary">Ver progreso</Text>
            </Pressable>
          </View>

          <View className="mb-4 flex-row flex-wrap justify-between">
            <StatTile
              label="Materias aprobadas"
              value={summary.approved}
              icon={<CheckCircle2 size={21} color={COLORS.success} />}
              color={COLORS.success}
              bg={COLORS.successLight}
            />
            <StatTile
              label="Materias pendientes"
              value={summary.remaining}
              icon={<CalendarDays size={21} color={COLORS.danger} />}
              color={COLORS.danger}
              bg={COLORS.dangerLight}
            />
            <StatTile
              label="Materias en curso"
              value={summary.inProgress}
              icon={<Clock3 size={21} color={COLORS.warning} />}
              color={COLORS.warning}
              bg={COLORS.warningLight}
            />
            <StatTile
              label="Promedio general"
              value={formatAverage(summary.average)}
              icon={<BookMarked size={21} color={COLORS.primary} />}
              color={COLORS.primary}
              bg={COLORS.primaryLight}
            />
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-text">Materias del pensum</Text>
            <Pressable onPress={() => router.navigate('/(tabs)/planner')}>
              <Text className="text-[13px] font-bold text-primary">Mis estudios</Text>
            </Pressable>
          </View>

          {!plan ? (
            <Card padding={18} radius={22}>
              <Text className="text-[17px] font-bold text-text">Configura tu ruta académica</Text>
              <FormButton label="Agregar universidad y pensum" onPress={() => router.push('/agregar-universidad')} />
              {!profile ? <FormButton label="Crear perfil" kind="secondary" onPress={() => router.push('/perfil')} /> : null}
            </Card>
          ) : subjectsPreview.length === 0 ? (
            <Card padding={18} radius={22}>
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-primaryLight">
                <BookMarked size={22} color={COLORS.primary} />
              </View>
              <Text className="text-[17px] font-bold text-text">Aun no hay materias</Text>
              <Text className="mt-2 text-[14px] font-medium leading-5 text-muted">
                Agrega las materias de tu carrera y registra tus notas.
              </Text>
              <FormButton label="Agregar materia" onPress={() => router.push('/editar-materia')} />
            </Card>
          ) : (
            <View>
              {subjectsPreview.map((subject, index) => {
                const status = subjectStatus(subject, rules);
                const color = STATUS_COLORS[status];
                const period = periods.find((item) => item.id === subject.periodId)?.name ?? 'Sin período';

                return (
                  <Animated.View key={subject.id} entering={FadeInDown.delay(index * 55).duration(360)}>
                    <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/materia/[id]', params: { id: subject.id } })}>
                    <Card padding={14} radius={20} className="mb-3">
                      <View className="flex-row items-start gap-3">
                        <View style={{ backgroundColor: color + '18' }} className="h-11 w-11 items-center justify-center rounded-[14px]">
                          <BookMarked size={20} color={color} strokeWidth={2.1} />
                        </View>
                        <View className="flex-1">
                          <View className="mb-1.5 flex-row items-start justify-between gap-2">
                            <Text className="flex-1 text-[15px] font-bold leading-5 text-text">{subject.name}</Text>
                            <View style={{ backgroundColor: color + '18' }} className="rounded-full px-2.5 py-1">
                              <Text style={{ color: color }} className="text-[10px] font-bold">
                                {STATUS_LABELS[status]}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-[12px] font-semibold text-muted">
                            {subject.code} · {subject.credits} créditos · {period}
                          </Text>
                        </View>
                      </View>
                    </Card>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
