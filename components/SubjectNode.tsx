import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, type SubjectStatus } from '@/constants/mockData';

type SubjectNodeProps = {
  id: string;
  code: string;
  name: string;
  credits: number;
  status: SubjectStatus;
  width?: number;
  height?: number;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STATUS_CONFIG: Record<SubjectStatus, { bg: string; border: string; text: string; iconBg: string; icon: 'check' | 'lock' | 'dot' }> = {
  approved: { bg: '#ECFBF3', border: COLORS.success, text: '#149761', iconBg: COLORS.success, icon: 'check' },
  available: { bg: '#F2F7FF', border: COLORS.secondary, text: '#2563EB', iconBg: COLORS.secondary, icon: 'check' },
  in_progress: { bg: '#FFF7E7', border: COLORS.warning, text: '#C27A05', iconBg: COLORS.warning, icon: 'dot' },
  locked: { bg: '#FFFFFF', border: '#D7D3E7', text: '#58546A', iconBg: '#F2F0FA', icon: 'lock' },
};

function StatusIcon({ status }: { status: SubjectStatus }) {
  const cfg = STATUS_CONFIG[status];
  if (cfg.icon === 'lock') return <Lock size={11} color={COLORS.text} strokeWidth={2.5} />;
  if (cfg.icon === 'dot') return <View className="h-2 w-2 rounded-full bg-white" />;
  return <Check size={10} color={COLORS.white} strokeWidth={3} />;
}

export default function SubjectNode({
  code,
  name,
  credits,
  status,
  width = 104,
  height = 58,
  onPress,
}: SubjectNodeProps) {
  const cfg = STATUS_CONFIG[status];
  const scale = useSharedValue(1);
  const press = useSharedValue(1);

  useEffect(() => {
    if (status === 'available') {
      scale.value = withRepeat(
        withSequence(withTiming(1.025, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true
      );
    }
  }, [scale, status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * press.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        press.value = withSpring(0.96, { damping: 14, stiffness: 260 });
      }}
      onPressOut={() => {
        press.value = withSpring(1, { damping: 14, stiffness: 260 });
      }}
      style={[
        {
          width,
          height,
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
          shadowColor: status === 'locked' ? '#AFA9CD' : cfg.border,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: status === 'locked' ? 0.07 : 0.13,
          shadowRadius: 10,
          elevation: 4,
        },
        animatedStyle,
      ]}
      className="justify-center rounded-[10px] border px-3"
    >
      <View className="mb-1 flex-row items-start justify-between gap-1">
        <Text style={{ color: cfg.text, maxWidth: width - 36 }} className="text-[11px] font-bold leading-3" numberOfLines={2}>
          {name}
        </Text>
        <View
          style={{ backgroundColor: cfg.iconBg }}
          className="h-[18px] w-[18px] items-center justify-center rounded-full"
        >
          <StatusIcon status={status} />
        </View>
      </View>
      <Text style={{ color: cfg.text }} className="text-[8px] font-medium">
        {credits} creditos
      </Text>
      <Text className="mt-0.5 text-[7px] font-semibold text-muted">{code}</Text>
    </AnimatedPressable>
  );
}
