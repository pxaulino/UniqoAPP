import React from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import Card from './Card';

type StatCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

export default function StatCard({
  label,
  value,
  subtitle,
  icon,
  color = COLORS.primary,
  bgColor = COLORS.primaryLight,
  style,
  delay,
}: StatCardProps) {
  return (
    <Card delay={delay} padding={14} radius={22} style={[{ alignItems: 'center' }, style]}>
      {icon ? (
        <View
          style={{ backgroundColor: bgColor }}
          className="mb-2 h-10 w-10 items-center justify-center rounded-2xl"
        >
          {icon}
        </View>
      ) : null}
      <Text style={[TYPOGRAPHY.stat, { color }]}>
        {value}
      </Text>
      <Text style={[TYPOGRAPHY.labelSemibold, { color: COLORS.muted, textAlign: 'center', marginTop: 2 }]}>
        {label}
      </Text>
      {subtitle ? (
        <Text style={[TYPOGRAPHY.label, { color: COLORS.muted, textAlign: 'center', marginTop: 2 }]}>
          {subtitle}
        </Text>
      ) : null}
    </Card>
  );
}
