import React, { useEffect } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  secondaryColor?: string;
  trackColor?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function ProgressRing({
  progress,
  size = 156,
  strokeWidth = 14,
  color = COLORS.primary,
  secondaryColor = COLORS.success,
  trackColor = '#E7E2FF',
  label = 'Completado',
  style,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clamped, { duration: 950 });
  }, [animatedProgress, clamped]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedProgress.value / 100) * circumference,
  }));

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: color,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 22,
          elevation: 6,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: size - 26,
          height: size - 26,
          borderRadius: (size - 26) / 2,
          backgroundColor: 'rgba(255,255,255,0.72)',
        }}
      />
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="progressRingGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7A5CFF" />
            <Stop offset="0.58" stopColor="#5B38F5" />
            <Stop offset="1" stopColor="#3CC7A5" />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.22} ${circumference}`}
          strokeLinecap="round"
          fill="none"
          rotation="132"
          origin={`${size / 2}, ${size / 2}`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressRingGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text style={[TYPOGRAPHY.heroTitle, { color: COLORS.text }]}>{clamped}%</Text>
        <Text style={[TYPOGRAPHY.labelSemibold, { color: COLORS.muted }]}>{label}</Text>
      </View>
    </View>
  );
}
