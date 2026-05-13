/**
 * Hooks for Interactive Scroll Animations
 * Provides utilities for creating scroll-based effects
 */

import {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

/**
 * Hook for scroll-based animations
 * Returns shared values and scroll handler for interactive effects
 */
export const useScrollAnimationValues = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return { scrollY, scrollHandler };
};

/**
 * Interpolate scroll position for header collapse
 */
export const useHeaderCollapseAnimation = (scrollY: SharedValue<number>) => {
  const headerHeight = 120;
  const collapsedHeight = 60;

  const headerTranslateY = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, headerHeight - collapsedHeight],
      [0, -(headerHeight - collapsedHeight)],
      Extrapolate.CLAMP,
    )
  );

  const headerOpacity = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0.3],
      Extrapolate.CLAMP,
    )
  );

  return {
    headerTranslateY,
    headerOpacity,
    collapsedHeight,
  };
};

/**
 * Create parallax effect for hero sections
 */
export const useHeroParallax = (scrollY: SharedValue<number>) =>
  useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [-100, 0],
      [50, 0],
      Extrapolate.CLAMP,
    )
  );

/**
 * Scale cards based on scroll position
 * Great for creating depth effect while scrolling
 */
export const useCardScaleOnScroll = (
  scrollY: SharedValue<number>,
  minScale: number = 0.95,
) => {
  return useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, 200],
      [1, minScale],
      Extrapolate.CLAMP,
    )
  );
};

/**
 * Fade cards in/out based on scroll
 */
export const useCardFadeOnScroll = (scrollY: SharedValue<number>) =>
  useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, 300],
      [1, 0.5],
      Extrapolate.CLAMP,
    )
  );

/**
 * Create sticky header effect
 */
export const useStickyHeaderAnimation = (
  scrollY: SharedValue<number>,
  stickyThreshold: number = 100,
) => {
  const headerOpacity = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, stickyThreshold],
      [0, 1],
      Extrapolate.CLAMP,
    )
  );

  const headerScale = useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, stickyThreshold],
      [0.8, 1],
      Extrapolate.CLAMP,
    )
  );

  return {
    headerOpacity,
    headerScale,
  };
};

/**
 * Create blur increase effect on scroll
 */
export const useScrollBlurEffect = (scrollY: SharedValue<number>) =>
  useDerivedValue(() =>
    interpolate(
      scrollY.value,
      [0, 500],
      [0, 15],
      Extrapolate.CLAMP,
    )
  );

/**
 * Combine multiple scroll-based animations
 */
export const useComplexScrollAnimation = (scrollY: SharedValue<number>) => {
  const headerProgress = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 120], [0, 1], Extrapolate.CLAMP)
  );

  const cardScale = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 100], [1, 0.98], Extrapolate.CLAMP)
  );

  const opacity = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 200], [1, 0.6], Extrapolate.CLAMP)
  );

  const blurAmount = useDerivedValue(() =>
    interpolate(scrollY.value, [0, 300], [0, 10], Extrapolate.CLAMP)
  );

  return {
    headerProgress,
    cardScale,
    opacity,
    blurAmount,
  };
};
