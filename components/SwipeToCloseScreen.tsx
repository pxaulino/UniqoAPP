/**
 * SwipeToCloseScreen
 * Provides iOS-style swipe-to-close functionality for screens and modals
 * with physics-based animations and haptic feedback
 */

import { GESTURE_THRESHOLDS, SPRING_CONFIGS, VISUAL_CONFIG } from '@/utils/animationConfig';
import { clamp, isVelocitySignificant } from '@/utils/gestureHelpers';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useDerivedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface SwipeToCloseScreenProps extends ViewProps {
  children: React.ReactNode;
  onClose?: () => void;
  dismissEnabled?: boolean;
  showBlur?: boolean;
  blurIntensity?: number;
  backdropScale?: number;
  sceneDimensions?: {
    width?: number;
    height?: number;
  };
}

/**
 * Wrapper component that adds swipe-to-close gesture to any screen
 * Perfect for detail screens, modals, and bottom sheets
 */
export const SwipeToCloseScreen = React.forwardRef<
  Animated.View,
  SwipeToCloseScreenProps
>(
  (
    {
      children,
      onClose,
      dismissEnabled = true,
      showBlur = true,
      blurIntensity = VISUAL_CONFIG.blurIntensity,
      backdropScale = VISUAL_CONFIG.backgroundScale,
      sceneDimensions,
      style,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();

    // Shared animation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const gestureVelocity = useSharedValue(0);

    const dismissProgress = useDerivedValue(() =>
      interpolate(
        Math.abs(translateX.value),
        [0, SCREEN_WIDTH * GESTURE_THRESHOLDS.dismissRatio],
        [0, 1],
        Extrapolate.CLAMP,
      )
    );

    // Animated styles for the screen
    const screenAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        dismissProgress.value,
        [0, 1],
        [1, 0.8],
        Extrapolate.CLAMP,
      );

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
        opacity,
      };
    });

    // Animated backdrop blur and scale
    const backdropAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        dismissProgress.value,
        [0, 1],
        [1, backdropScale],
        Extrapolate.CLAMP,
      );

      const blurOpacity = interpolate(
        dismissProgress.value,
        [0, 1],
        [0, VISUAL_CONFIG.blurOpacity],
        Extrapolate.CLAMP,
      );

      return {
        opacity: blurOpacity,
        transform: [{ scale }],
      };
    });

    // Handle close action
    const handleClose = useCallback(() => {
      'worklet';
      if (onClose) {
        runOnJS(onClose)();
      } else {
        runOnJS(router.back)();
      }
    }, [onClose, router]);

    // Pan gesture for horizontal swipe
    const panGesture = Gesture.Pan()
      .enabled(dismissEnabled)
      .onStart((event) => {
        startX.value = event.x;
        startY.value = event.y;
      })
      .onUpdate((event) => {
        const deltaX = event.x - startX.value;
        const deltaY = Math.abs(event.y - startY.value);

        // Only allow horizontal swipe if movement is mostly horizontal
        if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > GESTURE_THRESHOLDS.minDistance) {
          translateX.value = clamp(
            deltaX,
            -GESTURE_THRESHOLDS.maxDragDistance,
            GESTURE_THRESHOLDS.maxDragDistance,
          );
          gestureVelocity.value = event.velocityX;
        }
      })
      .onEnd((event) => {
        const velocity = Math.abs(event.velocityX);
        const dismissDistance = SCREEN_WIDTH * GESTURE_THRESHOLDS.dismissRatio;
        const shouldDismiss =
          Math.abs(translateX.value) > dismissDistance ||
          isVelocitySignificant(velocity, GESTURE_THRESHOLDS.velocityThreshold);

        if (shouldDismiss) {
          // Animate to dismiss
          const targetX = translateX.value > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
          translateX.value = withSpring(targetX, {
            ...SPRING_CONFIGS.smooth,
            velocity,
          }, (finished) => {
            if (finished) {
              handleClose();
            }
          });
          
          // Trigger haptic feedback
          runOnJS(Haptics.notificationAsync)(
            Haptics.NotificationFeedbackType.Success,
          );

        } else {
          // Snap back to original position
          runOnJS(Haptics.selectionAsync)();
          translateX.value = withSpring(0, SPRING_CONFIGS.default);
        }
      });

    return (
      <>
        {/* Backdrop blur and scale effect */}
        {showBlur && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
              },
              backdropAnimatedStyle,
            ]}
          >
            <BlurView intensity={blurIntensity} style={{ flex: 1 }} />
          </Animated.View>
        )}

        {/* Main screen content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            ref={ref}
            style={[
              {
                flex: 1,
                width: sceneDimensions?.width || SCREEN_WIDTH,
                height: sceneDimensions?.height || SCREEN_HEIGHT,
              },
              screenAnimatedStyle,
              style,
            ]}
            {...props}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

SwipeToCloseScreen.displayName = 'SwipeToCloseScreen';

export default SwipeToCloseScreen;
