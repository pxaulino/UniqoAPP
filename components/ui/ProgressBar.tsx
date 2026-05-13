import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';

type ProgressBarProps = {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export default function ProgressBar({
  progress,
  color = COLORS.primary,
  trackColor = COLORS.primaryLight,
  height = 8,
  radius = 99,
  style,
}: ProgressBarProps) {
  const width = useSharedValue(0);
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 760 });
  }, [clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={[
        { height, borderRadius: radius, backgroundColor: trackColor, overflow: 'hidden', width: '100%' },
        style,
      ]}
    >
      <Animated.View style={[{ height, borderRadius: radius, backgroundColor: color }, fillStyle]} />
    </View>
  );
}
