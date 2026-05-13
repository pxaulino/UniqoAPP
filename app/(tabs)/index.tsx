import { HomeSkeleton } from '@/components/skeleton/ScreenSkeletons';
import Card from '@/components/ui/Card';
import GradientCard from '@/components/ui/GradientCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { AcademicRecordStatus, academicRecords, COLORS, nextClass, notifications, progressData, quickActions } from '@/constants/mockData';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import { useScrollAnimationValues } from '@/hooks/useScrollAnimations';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowUpRight,
  Bell,
  BookMarked,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock3,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SUMMARY_CLOSE_DURATION = 220;

type SummaryAction = {
  id: 'approved' | 'in_progress' | 'pending' | 'credits';
  label: string;
  value: number;
  suffix?: string;
  modalTitle: string;
  modalCta: string;
  status?: AcademicRecordStatus;
  icon: typeof CircleCheck;
  color: string;
  bg: string;
};

const summary: SummaryAction[] = [
  {
    id: 'approved',
    label: 'Aprobadas',
    value: academicRecords.filter((item) => item.status === 'approved').length,
    modalTitle: 'Materias aprobadas',
    modalCta: 'Ver todas las aprobadas',
    status: 'approved',
    icon: CircleCheck,
    color: COLORS.success,
    bg: COLORS.successLight,
  },
  {
    id: 'in_progress',
    label: 'En curso',
    value: academicRecords.filter((item) => item.status === 'in_progress').length,
    modalTitle: 'Materias en curso',
    modalCta: 'Ver materias seleccionadas',
    status: 'in_progress',
    icon: Clock3,
    color: COLORS.warning,
    bg: COLORS.warningLight,
  },
  {
    id: 'pending',
    label: 'Pendientes',
    value: academicRecords.filter((item) => item.status === 'pending').length,
    modalTitle: 'Materias pendientes',
    modalCta: 'Ver todas las pendientes',
    status: 'pending',
    icon: CalendarDays,
    color: COLORS.danger,
    bg: COLORS.dangerLight,
  },
  {
    id: 'credits',
    label: 'Creditos',
    value: progressData.creditsApproved,
    suffix: `/${progressData.totalCredits}`,
    modalTitle: 'Creditos aprobados',
    modalCta: 'Ver mi progreso',
    icon: BookMarked,
    color: COLORS.primary,
    bg: COLORS.primaryLight,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const loading = useFakeLoading(900);
  const [activeSummary, setActiveSummary] = React.useState<SummaryAction | null>(null);
  const [isSummaryModalMounted, setIsSummaryModalMounted] = React.useState(false);
  const unreadNotifications = notifications.filter((item) => item.unread).length;
  const modalCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingSummary = React.useRef(false);
  const isModalScrolledToTop = React.useRef(true);
  const modalOverlayOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(SCREEN_HEIGHT);
  
  // Scroll animation
  const { scrollY, scrollHandler } = useScrollAnimationValues();
  
  const heroCardAnimatedStyle = useAnimatedStyle(() => {
    const cardScale = interpolate(scrollY.value, [0, 200], [1, 0.97], Extrapolate.CLAMP);
    const cardFade = interpolate(scrollY.value, [0, 300], [1, 0.5], Extrapolate.CLAMP);
    const headerTranslateY = interpolate(scrollY.value, [0, 100], [0, 30], Extrapolate.CLAMP);

    return {
      transform: [
        { scale: cardScale },
        { translateY: headerTranslateY },
      ],
      opacity: cardFade,
    };
  });

  React.useEffect(() => {
    if (activeSummary) {
      setIsSummaryModalMounted(true);
      isClosingSummary.current = false;
      if (modalCloseTimer.current) {
        clearTimeout(modalCloseTimer.current);
        modalCloseTimer.current = null;
      }
      modalOverlayOpacity.value = withTiming(1, {
        duration: 160,
        easing: Easing.out(Easing.cubic),
      });
      modalTranslateY.value = withSpring(0, {
        damping: 30,
        stiffness: 260,
        mass: 0.9,
      });
    }
  }, [activeSummary, modalOverlayOpacity, modalTranslateY]);

  React.useEffect(() => {
    return () => {
      if (modalCloseTimer.current) {
        clearTimeout(modalCloseTimer.current);
      }
    };
  }, []);

  const closeSummaryModal = React.useCallback(
    (afterClose?: () => void) => {
      if (isClosingSummary.current) return;
      isClosingSummary.current = true;
      modalOverlayOpacity.value = withTiming(0, {
        duration: SUMMARY_CLOSE_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      modalTranslateY.value = withTiming(SCREEN_HEIGHT, {
        duration: SUMMARY_CLOSE_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      modalCloseTimer.current = setTimeout(() => {
        modalCloseTimer.current = null;
        setIsSummaryModalMounted(false);
        setActiveSummary(null);
        modalTranslateY.value = SCREEN_HEIGHT;
        afterClose?.();
      }, SUMMARY_CLOSE_DURATION);
    },
    [modalOverlayOpacity, modalTranslateY]
  );

  const modalBackdropStyle = useAnimatedStyle(() => ({
    opacity: modalOverlayOpacity.value,
  }));

  const modalSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  const modalPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const isMostlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.35;
          const isDraggingDown = gestureState.dy > 10;
          return isMostlyVertical && isDraggingDown && isModalScrolledToTop.current;
        },
        onStartShouldSetPanResponder: (e) => e.nativeEvent.locationY < 132,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            modalTranslateY.value = Math.min(gestureState.dy, SCREEN_HEIGHT * 0.55);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldClose = gestureState.dy > 135 || (gestureState.dy > 64 && gestureState.vy > 1.05);
          if (shouldClose) {
            closeSummaryModal();
            return;
          }
          modalTranslateY.value = withSpring(0, { damping: 28, stiffness: 260 });
        },
        onPanResponderTerminate: () => {
          modalTranslateY.value = withSpring(0, { damping: 28, stiffness: 260 });
        },
      }),
    [closeSummaryModal, modalTranslateY]
  );

  if (loading) return <HomeSkeleton />;

  const modalRecords = activeSummary?.status
    ? academicRecords.filter((item) => item.status === activeSummary.status).slice(0, 5)
    : [];

  const handleSummaryPress = (item: SummaryAction) => {
    if (item.id === 'in_progress') {
      router.push('/(tabs)/planner' as never);
      return;
    }

    if (item.id === 'credits') {
      return;
    }

    setActiveSummary(item);
  };

  const handleModalCta = () => {
    if (!activeSummary) return;

    const status = activeSummary.status;
    closeSummaryModal(() => {
      if (status === 'approved' || status === 'pending') {
        router.push(`/materias/${status}` as never);
      }
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <Animated.ScrollView 
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 144, paddingTop: 12 }}
        >
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={require('@/assets/images/daniel.webp')}
              contentFit="cover"
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: COLORS.white,
              }}
            />
            <View>
              <Text className="text-[20px] font-bold  text-text">Hola, Daniel!</Text>
              <Text className="mt-1 text-[13px] font-semibold text-muted">Desarrollo de Software - Itla</Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/notificaciones' as never)}
            className="h-11 w-11 items-center justify-center"
          >
            <Bell size={25} color={COLORS.text} strokeWidth={1.9} />
            {unreadNotifications > 0 ? (
              <View className="absolute right-2.5 top-2 h-2.5 w-2.5 rounded-full bg-danger">
                <View className="absolute -inset-0.5 rounded-full border border-bg" />
              </View>
            ) : null}
          </Pressable>
        </View>

        <GradientCard colors={['#F8F5FF', '#E9E1FF']} padding={0} radius={18} className="mb-5" style={heroCardAnimatedStyle}>
          <View className="h-[154px] flex-row items-center overflow-hidden rounded-[18px] px-5 py-4">
            <View className="absolute right-[124px] top-5 h-2 w-2 rounded-full bg-primary/20" />
            <View className="absolute right-[94px] top-10 h-1.5 w-1.5 rounded-full bg-bluex/20" />
            <View className="z-10 flex-1">
              <View className="mb-1 flex-row items-center gap-2">
                <Text className="text-[14px] font-semibold text-muted">Progreso general</Text>
                <View className="rounded-full bg-white/75 px-2 py-0.5">
                  <Text className="text-[10px] font-semibold text-primary">Actualizado</Text>
                </View>
              </View>
              <Text className="mt-2 text-[34px] font-bold  text-text">62%</Text>
              <ProgressBar progress={0.62} color="#5B38F5" trackColor="#D9D1FF" height={7} style={{ marginTop: 9, width: 150 }} />
              <Text className="mt-3 text-[13px] font-medium text-muted">124 / 200 creditos</Text>
            </View>
            <View className="absolute bottom-0 right-0 h-[154px] w-[155px] items-end justify-end overflow-hidden">
              <Image
                source={require('@/assets/images/estudiante.png')}
                contentFit="contain"
                style={{ width: 158, height: 158 }}
              />
            </View>
          </View>
        </GradientCard>

        <View className="mb-5 flex-row justify-between">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Pressable
                key={action.id}
                onPress={() => router.push(action.route as never)}
                className="w-[76px] items-center"
              >
                <Card delay={index * 55} padding={0} radius={18} border={false} style={{ backgroundColor: action.color }}>
                  <View className="h-[64px] w-[64px] items-center justify-center rounded-[18px]">
                    <Icon size={30} color={COLORS.white} strokeWidth={1.9} />
                  </View>
                </Card>
                <Text className="mt-2 text-center text-[12px] font-bold leading-4 text-text" numberOfLines={2}>
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-bold  text-text">Proxima clase</Text>
          <Text className="text-[12px] font-medium text-muted">Hoy</Text>
        </View>
        <Card padding={14} radius={22} className="mb-6" style={{ backgroundColor: '#FFF0F6' }}>
          <View className="flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <BookMarked size={25} color={COLORS.danger} strokeWidth={1.8} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-text">{nextClass.subject}</Text>
              <Text className="mt-1 text-[13px] font-semibold text-muted">
                {nextClass.day}, {nextClass.time}
              </Text>
              <Text className="text-[13px] font-semibold text-muted">{nextClass.room}</Text>
            </View>
            <View className="mr-1 h-2 w-2 rounded-full bg-danger" />
            <ChevronRight size={20} color={COLORS.text} />
          </View>
        </Card>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-bold  text-text">Resumen rapido</Text>
          <Pressable onPress={() => router.push('/(tabs)/progreso' as never)}>
            <Text className="text-[13px] font-bold text-primary">Ver mi progreso</Text>
          </Pressable>
        </View>
        <Card padding={0} radius={16} className="overflow-hidden" style={{ shadowOpacity: 0.045, elevation: 2 }}>
          <View className="flex-row flex-wrap">
          {summary.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.label}
                onPress={() => handleSummaryPress(item)}
                className={`w-1/2 flex-row items-center gap-3 px-3 py-3 ${index < 2 ? 'border-b border-bg' : ''} ${index % 2 === 0 ? 'border-r border-bg' : ''}`}
              >
                <View style={{ backgroundColor: item.bg }} className="h-11 w-11 items-center justify-center rounded-[13px]">
                  <Icon size={20} color={item.color} strokeWidth={2.3} />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-medium text-muted">{item.label}</Text>
                  <Text className="mt-0.5 text-[18px] font-bold text-text">
                    {item.value}
                    {item.suffix ? <Text className="text-[12px] font-semibold text-muted">{item.suffix}</Text> : null}
                  </Text>
                </View>
                {item.id !== 'credits' ? <ChevronRight size={15} color={COLORS.muted} /> : null}
              </Pressable>
            );
          })}
          </View>
        </Card>
        </Animated.ScrollView>

        <Modal
          visible={isSummaryModalMounted}
          transparent
          statusBarTranslucent
          animationType="none"
          onRequestClose={() => closeSummaryModal()}
        >
          <View className="flex-1 justify-end">
            <Pressable className="absolute inset-0" onPress={() => closeSummaryModal()}>
              <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(17,16,24,0.34)' }, modalBackdropStyle]} />
            </Pressable>
            <Animated.View
              {...modalPanResponder.panHandlers}
              className="mx-4 mb-4 rounded-[28px] bg-white px-5 pb-5 pt-3"
              style={[
                modalSheetStyle,
                {
                  shadowColor: COLORS.primary,
                  shadowOffset: { width: 0, height: -12 },
                  shadowOpacity: 0.12,
                  shadowRadius: 28,
                  elevation: 18,
                },
              ]}
            >
              <View className="mb-5 items-center">
                <View className="h-1.5 w-16 rounded-full bg-line" />
              </View>

              {activeSummary ? (
                <>
                  <View className="mb-5 flex-row items-center gap-4">
                    <View style={{ backgroundColor: activeSummary.bg }} className="h-[68px] w-[68px] items-center justify-center rounded-[20px]">
                      <activeSummary.icon size={32} color={activeSummary.color} strokeWidth={2.3} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[22px] font-bold text-text">{activeSummary.modalTitle}</Text>
                      <Text className="mt-1 text-[15px] font-semibold text-muted">
                        Total: {activeSummary.value} materias
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => closeSummaryModal()}
                      className="h-11 w-11 items-center justify-center rounded-full bg-bg"
                    >
                      <X size={21} color={COLORS.text} />
                    </Pressable>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(e) => {
                      isModalScrolledToTop.current = e.nativeEvent.contentOffset.y <= 0;
                    }}
                    style={{ maxHeight: 360 }}
                  >
                    {modalRecords.map((record) => (
                      <View
                        key={record.id}
                        className="mb-2 flex-row items-center gap-3 rounded-[16px] bg-[#FCFBFF] px-3 py-3"
                        style={{ borderWidth: 1, borderColor: 'rgba(108,77,255,0.055)' }}
                      >
                        <View style={{ backgroundColor: activeSummary.bg }} className="h-10 w-10 items-center justify-center rounded-[12px]">
                          <activeSummary.icon size={19} color={activeSummary.color} strokeWidth={2.4} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-[14px] font-bold text-text">{record.name}</Text>
                          <Text className="mt-0.5 text-[12px] font-semibold text-muted">
                            {record.code} - {record.credits} creditos
                          </Text>
                        </View>
                        <View style={{ backgroundColor: activeSummary.bg }} className="rounded-full px-3 py-1.5">
                          <Text style={{ color: activeSummary.color }} className="text-[11px] font-bold">
                            {activeSummary.label}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>

                  <Pressable
                    onPress={handleModalCta}
                    className="mt-4 flex-row items-center justify-center gap-3 rounded-[16px] bg-primary py-4"
                  >
                    <ArrowUpRight size={20} color={COLORS.white} />
                    <Text className="text-[15px] font-bold text-white">{activeSummary.modalCta}</Text>
                  </Pressable>
                </>
              ) : null}
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </Animated.View>
  );
}
