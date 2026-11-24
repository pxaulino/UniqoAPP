/**
 * AnimatedBottomSheet
 * Premium iOS-style bottom sheet with drag-to-close and spring physics
 */

import { GESTURE_THRESHOLDS, SPRING_CONFIGS, VISUAL_CONFIG } from '@/utils/animationConfig';
import { isVelocitySignificant } from '@/utils/gestureHelpers';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect } from 'react';
import {
    Dimensions,
    Modal,
    ModalProps,
    Pressable,
    View,
    type ViewInstance,
    ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AnimatedBottomSheetProps extends Omit<ModalProps, 'transparent' | 'animationType'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  snapPoints?: number[];
  dragEnabled?: boolean;
  showHandle?: boolean;
  headerComponent?: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  blurIntensity?: number;
}

/**
 * Premium animated bottom sheet with drag-to-dismiss
 */
export const AnimatedBottomSheet = React.forwardRef<ViewInstance, AnimatedBottomSheetProps>(
  (
    {
      visible,
      onClose,
      children,
      height = SCREEN_HEIGHT * 0.75,
      snapPoints = [SCREEN_HEIGHT * 0.5, SCREEN_HEIGHT * 0.75],
      dragEnabled = true,
      showHandle = true,
      headerComponent,
      contentContainerStyle,
      blurIntensity = VISUAL_CONFIG.blurIntensity,
      ...props
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const sheetHeight = typeof height === 'string' ? SCREEN_HEIGHT : height;

    // Shared animation values
    const translateY = useSharedValue(sheetHeight);

    // Sheet snap to snap points
    const animateToSnapPoint = useCallback(
      (snapPoint: number, velocity: number = 0) => {
        'worklet';
        translateY.value = withSpring(snapPoint, {
          ...SPRING_CONFIGS.default,
          velocity,
        });
      },
      [translateY],
    );

    // Handle sheet close
    const handleClose = useCallback(() => {
      translateY.value = withSpring(sheetHeight, {
        ...SPRING_CONFIGS.smooth,
      });
      setTimeout(() => {
        runOnJS(onClose)();
      }, 300);
    }, [translateY, sheetHeight, onClose]);

    // Animated backdrop style
    const backdropAnimatedStyle = useAnimatedStyle(() => {
      const progress = interpolate(
        translateY.value,
        [sheetHeight, 0],
        [0, 1],
        Extrapolate.CLAMP,
      );

      return {
        opacity: progress * VISUAL_CONFIG.blurOpacity,
      };
    });

    // Animated sheet style
    const sheetAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    // Pan gesture for vertical drag
    const panGesture = Gesture.Pan()
      .enabled(dragEnabled)
      .onUpdate((event) => {
        const deltaY = event.translationY;

        if (deltaY > 0) {
          // Only allow downward drag
          translateY.value = deltaY;
        }
      })
      .onEnd((event) => {
        const velocity = event.velocityY;
        const dismissThreshold = sheetHeight * 0.25;
        const shouldDismiss =
          event.translationY > dismissThreshold ||
          isVelocitySignificant(velocity, GESTURE_THRESHOLDS.velocityThreshold);

        if (shouldDismiss) {
          runOnJS(Haptics.notificationAsync)(
            Haptics.NotificationFeedbackType.Success,
          );
          runOnJS(handleClose)();
        } else {
          // Find nearest snap point
          let nearestSnapPoint = snapPoints[0];
          let minDistance = Math.abs(event.translationY - snapPoints[0]);

          snapPoints.forEach((point) => {
            const distance = Math.abs(event.translationY - point);
            if (distance < minDistance) {
              minDistance = distance;
              nearestSnapPoint = point;
            }
          });

          runOnJS(Haptics.selectionAsync)();
          runOnJS(animateToSnapPoint)(nearestSnapPoint, velocity);
        }
      });

    // Initialize sheet when visible changes
    useEffect(() => {
      if (visible) {
        translateY.value = withSpring(snapPoints[snapPoints.length - 1], {
          ...SPRING_CONFIGS.gentle,
        });
      }
    }, [snapPoints, translateY, visible]);

    return (
      <Modal
        {...props}
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        {/* Backdrop blur */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'box-none',
            },
            backdropAnimatedStyle,
          ]}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={handleClose}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <BlurView intensity={blurIntensity} style={{ flex: 1 }} />
          </Pressable>
        </Animated.View>

        {/* Bottom sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            ref={ref}
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: sheetHeight,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: VISUAL_CONFIG.cornerRadius,
                borderTopRightRadius: VISUAL_CONFIG.cornerRadius,
                ...VISUAL_CONFIG.shadowConfig,
              },
              sheetAnimatedStyle,
            ]}
          >
            {/* Drag handle */}
            {showHandle && (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingTop: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#EBEBF0',
                  }}
                />
              </View>
            )}

            {/* Header component */}
            {headerComponent && (
              <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                {headerComponent}
              </View>
            )}

            {/* Sheet content */}
            <View
              style={[
                {
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingBottom: insets.bottom + 20,
                },
                contentContainerStyle,
              ]}
            >
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </Modal>
    );
  },
);

AnimatedBottomSheet.displayName = 'AnimatedBottomSheet';

export default AnimatedBottomSheet;
