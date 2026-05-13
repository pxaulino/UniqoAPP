import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Skeleton from './Skeleton';

type SkeletonLineProps = {
  width?: DimensionValue;
  height?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SkeletonLine({ width = '100%', height = 12, className, style }: SkeletonLineProps) {
  return <Skeleton width={width} height={height} borderRadius={height / 2} className={className} style={style} />;
}
