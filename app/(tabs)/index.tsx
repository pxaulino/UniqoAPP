import { HomeSkeleton } from '@/components/skeleton/ScreenSkeletons';
import Card from '@/components/ui/Card';
import GradientCard from '@/components/ui/GradientCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { COLORS } from '@/constants/mockData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookMarked,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LockKeyhole,
  RefreshCcw,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { platformShadow } from '@/utils/platformStyles';

type DashboardUser = {
  nombre?: string;
  nombre_completo?: string;
  foto_url?: string;
  tiene_pensum_activo?: boolean;
  progreso_porcentaje?: number;
  creditos_aprobados?: number;
  creditos_totales?: number;
  materias_aprobadas?: number;
  materias_totales?: number;
  materias_en_curso?: number;
  materias_pendientes?: number;
  periodo_actual?: number;
  tipo_periodo?: string;
};

type DashboardDoc = Record<string, unknown> | null;

type DashboardSubject = {
  id: string;
  nombre?: string;
  name?: string;
  materia_nombre?: string;
  codigo?: string;
  code?: string;
  materia_codigo?: string;
  creditos?: number;
  credits?: number;
  periodo?: number;
  periodo_numero?: number;
  cuatrimestre?: number;
  semestre?: number;
  estado?: SubjectStatus;
  motivo_bloqueo?: string;
};

type SubjectStatus = 'disponible' | 'bloqueada' | 'en_curso' | 'aprobada' | 'reprobada' | 'retirada' | string;

type DashboardData = {
  user: DashboardUser;
  blocked?: boolean;
  reason?: string;
  hasActivePensum?: boolean;
  university: DashboardDoc;
  career: DashboardDoc;
  pensum: DashboardDoc;
  userPensum: DashboardDoc;
  subjects: DashboardSubject[];
};

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  disponible: { label: 'Disponible', color: COLORS.secondary, bg: COLORS.blueLight },
  bloqueada: { label: 'Bloqueada', color: COLORS.muted, bg: COLORS.lockedLight },
  en_curso: { label: 'En curso', color: COLORS.warning, bg: COLORS.warningLight },
  aprobada: { label: 'Aprobada', color: COLORS.success, bg: COLORS.successLight },
  reprobada: { label: 'Reprobada', color: COLORS.danger, bg: COLORS.dangerLight },
  retirada: { label: 'Retirada', color: COLORS.danger, bg: COLORS.dangerLight },
};

function getTextValue(data: DashboardDoc | DashboardSubject | DashboardUser, keys: string[], fallback = 'No disponible') {
  if (!data) return fallback;

  for (const key of keys) {
    const value = data[key as keyof typeof data];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }

  return fallback;
}

function getNumberValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeProgress(value: unknown) {
  const progress = getNumberValue(value, 0);
  return Math.max(0, Math.min(100, progress));
}

function getSubjectStatus(subject: DashboardSubject) {
  const status = subject.estado || 'disponible';
  return statusStyles[status] ?? { label: status.replace(/_/g, ' '), color: COLORS.primary, bg: COLORS.primaryLight };
}

function getFriendlyError(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'No pudimos cargar tu inicio. Revisa tu conexion e intenta nuevamente.';
}

function ProfileAvatar({ user }: { user: DashboardUser }) {
  if (user.foto_url) {
    return (
      <Image
        source={{ uri: user.foto_url }}
        contentFit="cover"
        style={{
          width: 50,
          height: 50,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: COLORS.white,
        }}
      />
    );
  }

  const initial = (user.nombre || user.nombre_completo || 'U').trim().charAt(0).toUpperCase();

  return (
    <View className="h-[50px] w-[50px] items-center justify-center rounded-2xl bg-primaryLight">
      <Text className="text-[20px] font-bold text-primary">{initial}</Text>
    </View>
  );
}

function StateScreen({
  title,
  message,
  actionLabel,
  onAction,
  refreshing,
  onRefresh,
  icon,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  icon: React.ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView
        contentContainerClassName="flex-grow px-5 pb-32 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View className="flex-1 justify-center">
          <Card padding={22} radius={24}>
            <View className="mb-5 h-14 w-14 items-center justify-center rounded-2xl bg-primaryLight">{icon}</View>
            <Text className="text-[24px] font-bold leading-8 text-text">{title}</Text>
            <Text className="mt-3 text-[15px] font-medium leading-6 text-muted">{message}</Text>
            <Pressable
              onPress={onAction}
              className="mt-7 flex-row items-center justify-center rounded-[16px] bg-primary py-4"
              style={{
                ...platformShadow({
                  color: COLORS.primary,
                  offset: { width: 0, height: 12 },
                  opacity: 0.18,
                  radius: 20,
                  elevation: 8,
                }),
              }}
            >
              <Text className="mr-2 text-[15px] font-bold text-white">{actionLabel}</Text>
              <ArrowRight size={18} color={COLORS.white} />
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  const [dashboard, setDashboard] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadDashboard = React.useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    setError('');

    try {
      const firebaseConfig = (await import('@/src/config/firebase')) as {
        auth: { currentUser: { uid: string } | null };
      };
      const currentUser = firebaseConfig.auth.currentUser;

      if (!currentUser) {
        throw new Error('No hay una sesion activa. Inicia sesion nuevamente para continuar.');
      }

      const { getCurrentUserDashboard } = await import('@/src/services/dashboardService');
      const data = await getCurrentUserDashboard(currentUser.uid);
      setDashboard(data as DashboardData);
    } catch (loadError) {
      setError(getFriendlyError(loadError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = React.useCallback(() => {
    loadDashboard('refresh');
  }, [loadDashboard]);

  if (loading) return <HomeSkeleton />;

  if (error) {
    return (
      <StateScreen
        title="No pudimos cargar tu inicio"
        message={error}
        actionLabel="Intentar de nuevo"
        onAction={() => loadDashboard()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        icon={<AlertCircle size={28} color={COLORS.primary} />}
      />
    );
  }

  if (!dashboard) {
    return (
      <StateScreen
        title="Sin datos disponibles"
        message="No encontramos informacion para mostrar en este momento."
        actionLabel="Recargar"
        onAction={() => loadDashboard()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        icon={<RefreshCcw size={28} color={COLORS.primary} />}
      />
    );
  }

  if (dashboard.blocked) {
    return (
      <StateScreen
        title="Acceso bloqueado"
        message={dashboard.reason || 'Tu cuenta no esta activa. Contacta soporte para revisar tu acceso.'}
        actionLabel="Revisar perfil"
        // ProfileScreen placeholder route.
        onAction={() => router.push('/perfil' as never)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        icon={<LockKeyhole size={28} color={COLORS.primary} />}
      />
    );
  }

  const user = dashboard.user;
  const hasActivePensum = dashboard.hasActivePensum && user.tiene_pensum_activo;
  const firstName = getTextValue(user, ['nombre', 'nombre_completo'], 'Estudiante').split(' ')[0];
  const universityName = getTextValue(dashboard.university, ['nombre', 'name', 'nombre_completo', 'fullName'], 'Universidad pendiente');
  const careerName = getTextValue(dashboard.career, ['nombre', 'name', 'nombre_carrera', 'titulo'], 'Carrera pendiente');
  const pensumName = getTextValue(dashboard.pensum, ['nombre', 'name', 'version', 'plan'], 'Pensum activo');
  const progress = normalizeProgress(user.progreso_porcentaje);
  const progressRatio = progress / 100;
  const subjectsPreview = [...(dashboard.subjects || [])].slice(0, 5);
  const periodoLabel = `${getNumberValue(user.periodo_actual, 0)} ${user.tipo_periodo || 'periodo'}`;

  if (!hasActivePensum) {
    return (
      <StateScreen
        title={`Hola, ${firstName}`}
        message="Todavia no tienes una carrera activa. Elige tu universidad, carrera y pensum para activar tu dashboard academico."
        actionLabel="Elegir universidad"
        // OnboardingUniversityScreen placeholder route.
        onAction={() => router.push('/agregar-universidad' as never)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        icon={<GraduationCap size={29} color={COLORS.primary} />}
      />
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-36 pt-3"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <View className="mb-5 flex-row items-center justify-between">
            {/* ProfileScreen placeholder route. */}
            <Pressable onPress={() => router.push('/perfil' as never)} className="flex-1 flex-row items-center gap-3">
              <ProfileAvatar user={user} />
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
              onPress={() => router.push('/notificaciones' as never)}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
            >
              <Bell size={22} color={COLORS.text} strokeWidth={1.9} />
            </Pressable>
          </View>

          <Animated.View entering={FadeInDown.duration(420).springify().damping(18)}>
            <GradientCard colors={['#F8F5FF', '#E9E1FF']} padding={18} radius={22} className="mb-5">
              <View className="mb-4 flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-[13px] font-bold uppercase text-primary">Progreso general</Text>
                  <Text className="mt-2 text-[38px] font-bold text-text">{progress}%</Text>
                  <Text className="mt-1 text-[13px] font-semibold text-muted" numberOfLines={1}>
                    {pensumName}
                  </Text>
                </View>
                <View className="rounded-[16px] bg-white/80 px-3 py-2">
                  <Text className="text-[11px] font-bold text-primary">Periodo</Text>
                  <Text className="mt-1 text-[16px] font-bold text-text">{periodoLabel}</Text>
                </View>
              </View>
              <ProgressBar progress={progressRatio} color={COLORS.primary} trackColor="#D9D1FF" height={8} />
              <View className="mt-5 flex-row">
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold text-muted">Creditos</Text>
                  <Text className="mt-1 text-[18px] font-bold text-text">
                    {getNumberValue(user.creditos_aprobados)} / {getNumberValue(user.creditos_totales)}
                  </Text>
                </View>
                <View className="mx-4 w-[1px] bg-line" />
                <View className="flex-1">
                  <Text className="text-[12px] font-semibold text-muted">Materias</Text>
                  <Text className="mt-1 text-[18px] font-bold text-text">
                    {getNumberValue(user.materias_aprobadas)} / {getNumberValue(user.materias_totales)}
                  </Text>
                </View>
              </View>
            </GradientCard>
          </Animated.View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-text">Resumen academico</Text>
            <Pressable onPress={() => router.push('/(tabs)/progreso' as never)}>
              <Text className="text-[13px] font-bold text-primary">Ver progreso</Text>
            </Pressable>
          </View>

          <View className="mb-4 flex-row flex-wrap justify-between">
            <StatTile
              label="Materias aprobadas"
              value={getNumberValue(user.materias_aprobadas)}
              icon={<CheckCircle2 size={21} color={COLORS.success} />}
              color={COLORS.success}
              bg={COLORS.successLight}
            />
            <StatTile
              label="Materias pendientes"
              value={getNumberValue(user.materias_pendientes)}
              icon={<CalendarDays size={21} color={COLORS.danger} />}
              color={COLORS.danger}
              bg={COLORS.dangerLight}
            />
            <StatTile
              label="Materias en curso"
              value={getNumberValue(user.materias_en_curso)}
              icon={<Clock3 size={21} color={COLORS.warning} />}
              color={COLORS.warning}
              bg={COLORS.warningLight}
            />
            <StatTile
              label="Creditos aprobados"
              value={getNumberValue(user.creditos_aprobados)}
              icon={<BookMarked size={21} color={COLORS.primary} />}
              color={COLORS.primary}
              bg={COLORS.primaryLight}
            />
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[18px] font-bold text-text">Materias del pensum</Text>
            {/* PensumScreen placeholder route. */}
            <Pressable onPress={() => router.push('/(tabs)/planner' as never)}>
              <Text className="text-[13px] font-bold text-primary">Ver pensum</Text>
            </Pressable>
          </View>

          {subjectsPreview.length === 0 ? (
            <Card padding={18} radius={22}>
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-primaryLight">
                <BookMarked size={22} color={COLORS.primary} />
              </View>
              <Text className="text-[17px] font-bold text-text">Aun no hay materias</Text>
              <Text className="mt-2 text-[14px] font-medium leading-5 text-muted">
                Cuando tus materias esten cargadas, veras aqui el avance, estado y creditos de cada una.
              </Text>
            </Card>
          ) : (
            <View>
              {subjectsPreview.map((subject, index) => {
                const status = getSubjectStatus(subject);
                const name = getTextValue(subject, ['nombre', 'name', 'materia_nombre'], 'Materia sin nombre');
                const code = getTextValue(subject, ['codigo', 'code', 'materia_codigo'], 'Sin codigo');
                const credits = getNumberValue(subject.creditos ?? subject.credits);
                const period = getNumberValue(subject.periodo ?? subject.periodo_numero ?? subject.cuatrimestre ?? subject.semestre);

                return (
                  <Animated.View key={subject.id} entering={FadeInDown.delay(index * 55).duration(360)}>
                    <Card padding={14} radius={20} className="mb-3">
                      <View className="flex-row items-start gap-3">
                        <View style={{ backgroundColor: status.bg }} className="h-11 w-11 items-center justify-center rounded-[14px]">
                          <BookMarked size={20} color={status.color} strokeWidth={2.1} />
                        </View>
                        <View className="flex-1">
                          <View className="mb-1.5 flex-row items-start justify-between gap-2">
                            <Text className="flex-1 text-[15px] font-bold leading-5 text-text">{name}</Text>
                            <View style={{ backgroundColor: status.bg }} className="rounded-full px-2.5 py-1">
                              <Text style={{ color: status.color }} className="text-[10px] font-bold">
                                {status.label}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-[12px] font-semibold text-muted">
                            {code} - {credits} creditos - Periodo {period || 'N/D'}
                          </Text>
                          {subject.estado === 'bloqueada' && subject.motivo_bloqueo ? (
                            <Text className="mt-2 text-[12px] font-semibold leading-4 text-muted">
                              {subject.motivo_bloqueo}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </Card>
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
