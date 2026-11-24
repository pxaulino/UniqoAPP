import React from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import { platformShadow } from '@/utils/platformStyles';

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
        scale.set(withSpring(0.92, { damping: 14, stiffness: 260 }));
      }}
      onPressOut={() => {
        scale.set(withSpring(1, { damping: 14, stiffness: 260 }));
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
          ...platformShadow({
            color: COLORS.shadow,
            offset: { width: 0, height: 8 },
            opacity: 0.12,
            radius: 18,
            elevation: 6,
          }),
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
