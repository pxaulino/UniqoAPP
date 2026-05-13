import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type SkeletonCardProps = {
  children?: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  radius?: number;
};

export default function SkeletonCard({
  children,
  className,
  style,
  padding = 16,
  radius = 24,
}: SkeletonCardProps) {
  return (
    <View
      className={className}
      style={[
        {
          padding,
          borderRadius: radius,
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderWidth: 1,
          borderColor: 'rgba(108,77,255,0.075)',
          shadowColor: '#6C4DFF',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.04,
          shadowRadius: 16,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
