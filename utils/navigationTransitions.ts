/**
 * Navigation Transition Configurations
 * iOS-style screen transitions for smooth, fluid navigation
 */

import { Platform } from 'react-native';

const TransitionIOSSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
};

/**
 * Premium iOS-style fade and scale transition
 */
export const fadeScaleTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    return {
      cardStyle: {
        opacity: current.progress,
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.3],
        }),
      },
    };
  },
};

/**
 * Smooth slide from right (default iOS)
 */
export const slideFromRightTransition = {
  cardStyleInterpolator: ({ current, next, layouts }: any) => {
    const progress = current.progress;
    const nextOpacity = next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.9],
        })
      : 1;

    return {
      cardStyle: {
        transform: [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: nextOpacity,
        transform: [
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.96],
                })
              : 1,
          },
        ],
      },
    };
  },
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
};

/**
 * Layered depth transition - previous screen scales and blurs
 */
export const layeredDepthTransition = {
  cardStyleInterpolator: ({ current, next, layouts }: any) => {
    const progress = current.progress;
    const nextProgress = next ? next.progress : 0;

    return {
      cardStyle: {
        transform: [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.98],
            }),
          },
        ],
        opacity: progress,
      },
      overlayStyle: {
        opacity: nextProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.25],
        }),
        transform: [
          {
            scale: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                })
              : 1,
          },
        ],
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 2,
        restDisplacementThreshold: 2,
      },
    },
    close: {
      animation: 'spring',
      config: {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restSpeedThreshold: 2,
        restDisplacementThreshold: 2,
      },
    },
  },
};

/**
 * Subtle blur transition
 */
export const blurTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    const progress = current.progress;

    return {
      cardStyle: {
        transform: [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width * 0.3, 0],
            }),
          },
        ],
        opacity: progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
        }),
      },
    };
  },
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec,
  },
};

/**
 * Modal fade transition (bottom sheet style)
 */
export const modalFadeTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    const progress = current.progress;

    return {
      cardStyle: {
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.4],
        }),
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        damping: 12,
        mass: 1,
        stiffness: 200,
        overshootClamping: false,
        restSpeedThreshold: 2,
        restDisplacementThreshold: 2,
      },
    },
    close: {
      animation: 'spring',
      config: {
        damping: 12,
        mass: 1,
        stiffness: 200,
        overshootClamping: false,
        restSpeedThreshold: 2,
        restDisplacementThreshold: 2,
      },
    },
  },
};

/**
 * Get platform-specific default transition
 */
export const getPlatformTransition = () => {
  return Platform.OS === 'ios' ? slideFromRightTransition : layeredDepthTransition;
};

/**
 * All available transitions
 */
export const TRANSITIONS = {
  fadeScale: fadeScaleTransition,
  slideFromRight: slideFromRightTransition,
  layeredDepth: layeredDepthTransition,
  blur: blurTransition,
  modalFade: modalFadeTransition,
};
