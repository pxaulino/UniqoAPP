import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { gradients } from '@/constants/mockData';
import { platformShadow } from '@/utils/platformStyles';

type GradientCardProps = {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  className?: string;
  padding?: number;
  radius?: number;
  delay?: number;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export default function GradientCard({
  children,
  colors = gradients.primary,
  style,
  className,
  padding = 20,
  radius = 28,
  delay = 0,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).springify().damping(18)}
      className={className}
      style={[
        {
          borderRadius: radius,
          ...platformShadow({
            color: colors[0],
            offset: { width: 0, height: 18 },
            opacity: 0.28,
            radius: 30,
            elevation: 10,
          }),
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={{ padding, borderRadius: radius, overflow: 'hidden' }}
      >
        <View
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -28,
            right: -18,
            width: 104,
            height: 104,
            borderRadius: 52,
            backgroundColor: 'rgba(255,255,255,0.18)',
          }}
        />
        <View
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            bottom: -36,
            left: -24,
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: 'rgba(108,77,255,0.07)',
          }}
        />
        <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
      </LinearGradient>
    </Animated.View>
  );
}
