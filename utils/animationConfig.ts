/**
 * iOS-style Animation Configuration
 * Provides spring physics and easing configurations for premium gestures
 */

export const SPRING_CONFIGS = {
  // Tight, snappy spring - used for quick interactions
  tight: {
    damping: 12,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
  },
  // Default spring - balanced response
  default: {
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  },
  // Gentle spring - smooth, elegant motion
  gentle: {
    damping: 8,
    mass: 1.2,
    stiffness: 60,
    overshootClamping: false,
  },
  // Bouncy spring - playful, energetic
  bouncy: {
    damping: 6,
    mass: 1,
    stiffness: 120,
    overshootClamping: false,
  },
  // Very smooth spring - for large movements
  smooth: {
    damping: 15,
    mass: 1.5,
    stiffness: 40,
    overshootClamping: false,
  },
};

export const TIMING_CONFIGS = {
  // Very quick micro-interactions
  snap: {
    duration: 200,
  },
  // Standard transition
  standard: {
    duration: 300,
  },
  // Slower, more deliberate
  slow: {
    duration: 400,
  },
  // Very slow, cinematic
  cinematic: {
    duration: 500,
  },
};

// Easing curves iOS-style
export const EASING = {
  // Material Design inspired cubic-bezier
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  // iOS-like ease
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // Apple's preferred easing
  easeInOutExpo: (t: number): number => {
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
};

// Gesture thresholds
export const GESTURE_THRESHOLDS = {
  // Minimum distance to trigger swipe
  minDistance: 30,
  // Velocity threshold for momentum-based dismissal
  velocityThreshold: 500,
  // Drag distance needed to confirm close (0-1 scale)
  dismissRatio: 0.3,
  // Maximum drag distance before clamping
  maxDragDistance: 1000,
};

// Visual parameters
export const VISUAL_CONFIG = {
  // Background blur when modal is open
  blurIntensity: 20,
  // Scale of background page when modal is open (0-1)
  backgroundScale: 0.96,
  // Opacity of blur overlay
  blurOpacity: 0.4,
  // Corner radius for modals
  cornerRadius: 24,
  // Shadow configuration
  shadowConfig: {
    elevation: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
};
