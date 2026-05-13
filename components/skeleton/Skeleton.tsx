import React, { useEffect } from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const SKELETON_TOKENS = {
  base: '#F4F2FF',       // Casi blanco lavender
  highlight: '#FFFFFF',
  tint: 'rgba(108,77,255,0.03)', // Mucho más transparente
  background: '#F8F7FF',
  border: 'rgba(108,77,255,0.02)', // Casi invisible
};

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 12,
  className,
  style,
  delay = 0,
}: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      progress.value = withRepeat(withTiming(1, { duration: 1450 }), -1, false);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -200 + progress.value * 600 }],
  }));

  return (
    <View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: SKELETON_TOKENS.base,
          borderWidth: 1,
          borderColor: SKELETON_TOKENS.border,
        },
        style,
      ]}
    >

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: -10,
            bottom: -10,
            width: 250,
          },
          shimmerStyle,
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
