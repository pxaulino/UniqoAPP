/**
 * AnimatedCard
 * Premium card component with press, lift, and scale animations
 */

import { SPRING_CONFIGS, VISUAL_CONFIG } from '@/utils/animationConfig';
import React, { ReactNode } from 'react';
import {
    Pressable,
    PressableProps,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedCardProps extends PressableProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  /**
   * Enable scale animation on press
   */
  enablePressAnimation?: boolean;
  /**
   * Enable hover lift effect
   */
  enableHoverEffect?: boolean;
  /**
   * Custom shadow config
   */
  shadowConfig?: typeof VISUAL_CONFIG.shadowConfig;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Animated card with premium press and hover effects
 */
export const AnimatedCard = React.forwardRef<Animated.View, AnimatedCardProps>(
  (
    {
      children,
      style,
      padding = 16,
      radius = 18,
      backgroundColor = '#FFFFFF',
      borderColor,
      borderWidth = 0,
      enablePressAnimation = true,
      enableHoverEffect = false,
      shadowConfig = VISUAL_CONFIG.shadowConfig,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    // Animation values
    const scale = useSharedValue(1);
    const shadowOpacity = useSharedValue(shadowConfig.shadowOpacity || 0.15);
    const translateY = useSharedValue(0);

    // Handle press in
    const handlePressIn = (e: any) => {
      if (enablePressAnimation) {
        scale.value = withSpring(0.97, SPRING_CONFIGS.tight);
        shadowOpacity.value = withTiming(0.1, { duration: 100 });
      }
      onPressIn?.(e);
    };

    // Handle press out
    const handlePressOut = (e: any) => {
      if (enablePressAnimation) {
        scale.value = withSpring(1, SPRING_CONFIGS.tight);
        shadowOpacity.value = withTiming(shadowConfig.shadowOpacity || 0.15, {
          duration: 200,
        });
      }
      onPressOut?.(e);
    };

    // Animated style
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      shadowOpacity: shadowOpacity.value,
    }));

    return (
      <AnimatedPressable
        ref={ref}
        style={[
          {
            paddingHorizontal: padding,
            paddingVertical: padding,
            borderRadius: radius,
            backgroundColor,
            borderColor,
            borderWidth,
            shadowColor: shadowConfig.shadowColor,
            shadowRadius: shadowConfig.shadowRadius,
            shadowOffset: shadowConfig.shadowOffset,
            elevation: shadowConfig.elevation,
          },
          animatedStyle,
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  },
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;
