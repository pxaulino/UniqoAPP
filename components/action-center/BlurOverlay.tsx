import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface BlurOverlayProps {
  intensity?: number;
  onPress?: () => void;
}

export default function BlurOverlay({ intensity = 25, onPress }: BlurOverlayProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={StyleSheet.absoluteFill}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
      />
    </Animated.View>
  );
}
