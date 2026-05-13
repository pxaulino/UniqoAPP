import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Skeleton from './Skeleton';
import SkeletonCircle from './SkeletonCircle';

type ScreenSkeletonProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  withNav?: boolean;
  scroll?: boolean;
};

export function SkeletonBottomNav() {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-3">
      <View
        className="h-[78px] flex-row items-center justify-between rounded-[30px] border border-white/80 bg-white px-4"
        style={{
          shadowColor: '#6C4DFF',
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.12,
          shadowRadius: 32,
          elevation: 10,
        }}
      >
        {[0, 1].map((item) => (
          <View key={item} className="flex-1 items-center">
            <SkeletonCircle size={28} />
            <Skeleton width={44} height={7} borderRadius={4} className="mt-2" />
          </View>
        ))}
        <View className="-mt-8 h-[62px] w-[62px] items-center justify-center rounded-full bg-[#5B38F5]">
          <SkeletonCircle size={26} />
        </View>
        {[2, 3].map((item) => (
          <View key={item} className="flex-1 items-center">
            <SkeletonCircle size={28} />
            <Skeleton width={44} height={7} borderRadius={4} className="mt-2" />
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ScreenSkeleton({
  children,
  className = 'flex-1 bg-bg',
  contentClassName = 'px-5 pb-36 pt-3',
  withNav = false,
  scroll = true,
}: ScreenSkeletonProps) {
  const content = scroll ? (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName={contentClassName}>
      {children}
    </ScrollView>
  ) : (
    <View className={contentClassName}>{children}</View>
  );

  return (
    <SafeAreaView className={className} style={{ backgroundColor: '#F8F7FF' }}>
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(240,237,255,0.4)', 'rgba(248,247,255,0.1)']}
        className="absolute inset-0"
      />
      <View className="absolute -right-20 top-16 h-52 w-52 rounded-full bg-primary/2" />
      <View className="absolute -left-20 bottom-28 h-52 w-52 rounded-full bg-bluex/2" />
      {content}
      {withNav ? <SkeletonBottomNav /> : null}
    </SafeAreaView>
  );
}
