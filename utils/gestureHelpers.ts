/**
 * Gesture Utilities
 * Helper functions for iOS-style gesture handling
 */

import {
    SharedValue,
    interpolate,
    interpolateColor,
    useDerivedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

/**
 * Calculate velocity from gesture movement
 * Returns pixels per millisecond
 */
export const calculateVelocity = (
  distance: number,
  duration: number,
): number => {
  if (duration === 0) return 0;
  return Math.abs(distance / duration);
};

/**
 * Determine if gesture velocity is sufficient for momentum-based action
 */
export const isVelocitySignificant = (
  velocity: number,
  threshold: number = 500,
): boolean => {
  return Math.abs(velocity) > threshold;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

/**
 * Map a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  'worklet';
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/**
 * Create interpolated styles for swipe gesture
 * Used for swipe-to-close animations
 */
export const useSwipeGestureAnimation = (
  translateX: SharedValue<number>,
  screenWidth: number,
) => {
  const opacity = useDerivedValue(() =>
    interpolate(Math.abs(translateX.value), [0, screenWidth * 0.5], [1, 0], 'clamp')
  );

  const backgroundScale = useDerivedValue(() =>
    interpolate(Math.abs(translateX.value), [0, screenWidth * 0.3], [1, 0.96], 'clamp')
  );

  const blurIntensity = useDerivedValue(() =>
    interpolate(Math.abs(translateX.value), [0, screenWidth * 0.3], [0, 10], 'clamp')
  );

  return {
    opacity,
    backgroundScale,
    blurIntensity,
  };
};

/**
 * Create animated style for card press effect
 */
export const useCardPressAnimation = () => {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.15);

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 12, mass: 1, stiffness: 200 });
    shadowOpacity.value = withTiming(0.3, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 12, mass: 1, stiffness: 200 });
    shadowOpacity.value = withTiming(0.15, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    scale,
    shadowOpacity,
    onPressIn,
    onPressOut,
    animatedStyle,
  };
};

/**
 * Create scroll-based animation values
 * Useful for header collapse, parallax effects, etc.
 */
export const useScrollAnimation = (scrollY: SharedValue<number>) => {
  const headerProgress = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 120], [0, 1], 'clamp')
  );

  const headerOpacity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 200], [1, 0.6], 'clamp')
  );

  const cardScale = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 100], [1, 0.98], 'clamp')
  );

  return {
    headerProgress,
    headerOpacity,
    cardScale,
  };
};

/**
 * Create parallax offset for elements
 */
export const useParallaxEffect = (
  scrollY: SharedValue<number>,
  parallaxAmount: number = 0.3,
) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 500],
          [0, 500 * parallaxAmount],
          'clamp',
        ),
      },
    ],
  }));
};

/**
 * Create momentum-based spring animation
 */
export const withMomentum = (
  targetValue: number,
  velocity: number,
  config = { damping: 10, mass: 1, stiffness: 100 },
) => {
  'worklet';
  return withSpring(targetValue, {
    ...config,
    velocity,
  });
};

/**
 * Generate interpolated color transition
 * Useful for dynamic status-based coloring
 */
export const useColorAnimation = (
  value: SharedValue<number>,
  colors: string[],
  inputRange: number[],
) => {
  return useDerivedValue(() => interpolateColor(value.value, inputRange, colors));
};

/**
 * Create haptic feedback timing
 */
export const hapticTiming = {
  light: 100,
  medium: 150,
  heavy: 200,
};
