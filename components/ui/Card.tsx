import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { platformShadow } from '@/utils/platformStyles';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  padding?: number;
  radius?: number;
  delay?: number;
  border?: boolean;
};

export default function Card({
  children,
  style,
  className,
  padding = 18,
  radius = 26,
  delay = 0,
  border = true,
}: CardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).springify().damping(18)}
      className={className}
      style={[
        {
          padding,
          borderRadius: radius,
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderWidth: border ? 1 : 0,
          borderColor: 'rgba(108,77,255,0.075)',
          ...platformShadow({
            color: COLORS.shadow,
            offset: { width: 0, height: 12 },
            opacity: 0.085,
            radius: 24,
            elevation: 5,
          }),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
