import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Skeleton from './Skeleton';

type SkeletonCircleProps = {
  size?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SkeletonCircle({ size = 44, className, style }: SkeletonCircleProps) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} className={className} style={style} />;
}
