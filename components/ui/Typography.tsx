import React from 'react';
import { Text, type TextProps } from 'react-native';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';

type Variant = keyof typeof TYPOGRAPHY;

type AppTextProps = TextProps & {
  variant?: Variant;
  muted?: boolean;
};

export function AppText({ variant = 'body', muted, style, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[TYPOGRAPHY[variant], { color: muted ? COLORS.muted : COLORS.text }, style]}
    />
  );
}

export function LargeTitle(props: AppTextProps) {
  return <AppText variant="screenTitle" {...props} />;
}

export function SectionTitle(props: AppTextProps) {
  return <AppText variant="sectionTitle" {...props} />;
}

export function CardTitle(props: AppTextProps) {
  return <AppText variant="cardTitle" {...props} />;
}

export function Body(props: AppTextProps) {
  return <AppText variant="body" {...props} />;
}

export function Label(props: AppTextProps) {
  return <AppText variant="label" {...props} />;
}

export function StatNumber(props: AppTextProps) {
  return <AppText variant="stat" {...props} />;
}
