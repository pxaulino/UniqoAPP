import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import { useRouter } from 'expo-router';
import {
  Bell,
  BookPlus,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  Settings,
  Sparkles,
  TrendingUp,
  UploadCloud,
  X,
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionCard from './ActionCard';
import BlurOverlay from './BlurOverlay';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CLOSE_DURATION = 220;

interface AcademicActionCenterProps {
  onClose: () => void;
}

const PRIMARY_ACTIONS = [
  {
    id: 'approve',
    title: 'Marcar aprobada',
    subtitle: 'Actualiza tu progreso',
    icon: CheckCircle2,
    colors: ['#8B5CF6', '#6C4DFF'] as [string, string],
  },
  {
    id: 'assistant',
    title: 'Asistente académico',
    subtitle: 'Revisa tus próximos pasos',
    icon: Bot,
    colors: ['#EC4899', '#D946EF'] as [string, string],
  },
  {
    id: 'upload',
    title: 'Configurar pensum',
    subtitle: 'Agrega tu programa',
    icon: UploadCloud,
    colors: ['#3B82F6', '#2563EB'] as [string, string],
  },
  {
    id: 'roadmap',
    title: 'Ruta de Estudio',
    subtitle: 'Organiza tus períodos',
    icon: BookPlus,
    colors: ['#10B981', '#059669'] as [string, string],
  },
];

const SECONDARY_ACTIONS = [
  { id: 'calendar', title: 'Horario', icon: Calendar, colors: ['#6366F1', '#4F46E5'] as [string, string] },
  { id: 'recommendations', title: 'Sugerencias', icon: Sparkles, colors: ['#F59E0B', '#D97706'] as [string, string] },
  { id: 'stats', title: 'Estadísticas', icon: TrendingUp, colors: ['#F43F5E', '#E11D48'] as [string, string] },
  { id: 'notifications', title: 'Recordatorios', icon: Bell, colors: ['#14B8A6', '#0D9488'] as [string, string] },
  { id: 'uni', title: 'Universidad', icon: Building2, colors: ['#8B5CF6', '#6C4DFF'] as [string, string] },
  { id: 'settings', title: 'Ajustes', icon: Settings, colors: ['#64748B', '#475569'] as [string, string] },
];

export default function AcademicActionCenter({ onClose }: AcademicActionCenterProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isScrolledToTop = React.useRef(true);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosing = React.useRef(false);
  const overlayOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    overlayOpacity.set(withTiming(1, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    }));
    translateY.set(withSpring(0, {
      damping: 30,
      stiffness: 260,
      mass: 0.9,
    }));
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, [overlayOpacity, translateY]);

  const closeWithAnimation = React.useCallback(
    (afterClose?: () => void) => {
      if (isClosing.current) return;
      isClosing.current = true;
      overlayOpacity.set(withTiming(0, {
        duration: CLOSE_DURATION,
        easing: Easing.out(Easing.cubic),
      }));
      translateY.set(withTiming(SCREEN_HEIGHT, {
        duration: CLOSE_DURATION,
        easing: Easing.out(Easing.cubic),
      }));
      closeTimer.current = setTimeout(() => {
        closeTimer.current = null;
        afterClose?.();
        onClose();
      }, CLOSE_DURATION);
    },
    [onClose, overlayOpacity, translateY]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bottomInset = Math.max(insets.bottom, 20);

  const closeNow = React.useCallback(() => {
    closeWithAnimation();
  }, [closeWithAnimation]);

  const closeWithGesture = React.useCallback(() => {
    if (closeTimer.current) return;
    closeWithAnimation();
  }, [closeWithAnimation]);

  const panResponder = React.useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- PanResponder registers handlers that read refs only during gestures.
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const isMostlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.4;
          const isDraggingDown = gestureState.dy > 10;
          return isMostlyVertical && isDraggingDown && isScrolledToTop.current;
        },
        onStartShouldSetPanResponder: (e) => e.nativeEvent.locationY < 132,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.set(Math.min(gestureState.dy, SCREEN_HEIGHT * 0.55));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldClose = gestureState.dy > 135 || (gestureState.dy > 64 && gestureState.vy > 1.05);
          if (shouldClose) {
            closeWithGesture();
            return;
          }
          translateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
        onPanResponderTerminate: () => {
          translateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
      }),
    [closeWithGesture, translateY]
  );

  const handleAction = (id: string) => {
    closeWithAnimation(() => {
      if (id === 'approve') router.push('/marcar-aprobada');
      else if (id === 'assistant') router.push('/asistente-academico');
      else if (id === 'upload') router.push('/subir-pensum');
      else if (id === 'roadmap') router.push('/ruta-inteligente');
      else if (id === 'calendar') router.push('/calendario');
      else if (id === 'recommendations') router.push('/recomendaciones');
      else if (id === 'stats') router.push('/estadisticas-avanzadas');
      else if (id === 'notifications') router.push('/notificaciones');
      else if (id === 'uni') router.navigate('/(tabs)/universidades');
      else if (id === 'settings') router.push('/perfil');
    });
  };

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={closeNow}
    >
      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
          { justifyContent: 'flex-end' },
        ]}
      >
        <Pressable
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          onPress={closeNow}
        >
          <Animated.View style={[{ flex: 1 }, backdropStyle]}>
            <BlurOverlay intensity={36} />
          </Animated.View>
        </Pressable>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            sheetStyle,
            {
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              overflow: 'hidden',
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: bottomInset + 10,
              maxHeight: SCREEN_HEIGHT * 0.85,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: -12 },
              shadowOpacity: 0.1,
              shadowRadius: 28,
              elevation: 20,
            },
          ]}
        >
          <View style={{ width: '100%', alignItems: 'center', paddingVertical: 16 }}>
            <View style={{ width: 56, height: 5, borderRadius: 999, backgroundColor: COLORS.line }} />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={[TYPOGRAPHY.screenTitle, { color: COLORS.text, fontSize: 26 }]}>
              Centro Academico
            </Text>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.muted, fontSize: 15, marginTop: 4 }]}>
              Gestiona rapidamente tu progreso
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              isScrolledToTop.current = e.nativeEvent.contentOffset.y <= 0;
            }}
          >
            <Text
              style={[
                TYPOGRAPHY.cardTitle,
                { color: COLORS.muted, fontSize: 11, lineHeight: 16, textTransform: 'uppercase', marginBottom: 16 },
              ]}
            >
              Acciones Principales
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {PRIMARY_ACTIONS.map((action, index) => (
                <ActionCard
                  key={action.id}
                  index={index}
                  title={action.title}
                  subtitle={action.subtitle}
                  icon={action.icon}
                  colors={action.colors}
                  onPress={() => handleAction(action.id)}
                />
              ))}
            </View>

            <Text
              style={[
                TYPOGRAPHY.cardTitle,
                {
                  color: COLORS.muted,
                  fontSize: 11,
                  lineHeight: 16,
                  textTransform: 'uppercase',
                  marginTop: 16,
                  marginBottom: 16,
                },
              ]}
            >
              Otras herramientas
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 32 }}>
              {SECONDARY_ACTIONS.map((action, index) => (
                <ActionCard
                  key={action.id}
                  index={index + 4}
                  title={action.title}
                  icon={action.icon}
                  colors={action.colors}
                  onPress={() => handleAction(action.id)}
                />
              ))}
            </View>
          </ScrollView>

          <Pressable
            onPress={closeNow}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 40,
              height: 40,
              borderRadius: 999,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <X size={20} color={COLORS.text} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
