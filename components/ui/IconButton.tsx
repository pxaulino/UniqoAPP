import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';

type IconButtonProps = {
  icon: React.ReactNode;
  label?: string;
  onPress?: () => void;
  color?: string;
  bgColor?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function IconButton({
  icon,
  label,
  onPress,
  bgColor = COLORS.white,
  size = 44,
  style,
  className,
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 14, stiffness: 260 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 260 });
      }}
      className={className}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.36,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 6,
        },
        animatedStyle,
        style,
      ]}
    >
      {icon}
      {label ? <Text style={[TYPOGRAPHY.tab, { color: COLORS.text, marginTop: 4 }]}>{label}</Text> : null}
    </AnimatedPressable>
  );
}
