import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import ScreenSkeleton from './ScreenSkeleton';
import Skeleton from './Skeleton';
import SkeletonCard from './SkeletonCard';
import SkeletonCircle from './SkeletonCircle';
import SkeletonLine from './SkeletonLine';

function HeaderSkeleton({ centered = false }: { centered?: boolean }) {
  return (
    <View className="mb-5 flex-row items-center justify-between">
      <Skeleton width={44} height={44} borderRadius={16} />
      {centered ? <SkeletonLine width={130} height={16} /> : null}
      <Skeleton width={44} height={44} borderRadius={16} />
    </View>
  );
}

function ButtonSkeleton({ className = 'mt-6' }: { className?: string }) {
  return <Skeleton width="100%" height={54} borderRadius={13} className={className} />;
}

function SmallTabRow({ count = 3 }: { count?: number }) {
  return (
    <View className="mb-5 flex-row gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width={index === 0 ? 100 : 106} height={42} borderRadius={12} />
      ))}
    </View>
  );
}

function SubjectRowSkeleton({ last = false }: { last?: boolean }) {
  return (
    <View className={`flex-row items-center gap-3 px-4 py-4 ${last ? '' : 'border-b border-bg'}`}>
      <SkeletonCircle size={38} />
      <View className="flex-1">
        <SkeletonLine width="62%" height={13} />
        <SkeletonLine width="34%" height={10} className="mt-2" />
      </View>
      <SkeletonCircle size={18} />
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <ScreenSkeleton withNav>
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Skeleton width={48} height={48} borderRadius={16} />
          <View>
            <SkeletonLine width={145} height={18} />
            <SkeletonLine width={170} height={11} className="mt-3" />
          </View>
        </View>
        <SkeletonCircle size={42} />
      </View>

      <SkeletonCard radius={18} padding={0} className="mb-5 overflow-hidden" style={{ backgroundColor: '#F1ECFF' }}>
        <View className="h-[154px] flex-row items-center px-5 py-4">
          <View className="flex-1">
            <SkeletonLine width={138} height={13} />
            <SkeletonLine width={82} height={32} className="mt-4" />
            <Skeleton width={150} height={7} borderRadius={6} className="mt-4" />
            <SkeletonLine width={118} height={11} className="mt-4" />
          </View>
          <Skeleton width={132} height={132} borderRadius={30} />
        </View>
      </SkeletonCard>

      <View className="mb-5 flex-row justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="items-center">
            <Skeleton width={64} height={64} borderRadius={18} />
            <SkeletonLine width={48} height={10} className="mt-3" />
          </View>
        ))}
      </View>

      <View className="mb-3 flex-row items-center justify-between">
        <SkeletonLine width={118} height={16} />
        <SkeletonLine width={36} height={10} />
      </View>
      <SkeletonCard radius={22} padding={14} className="mb-6" style={{ backgroundColor: '#FFF6FA' }}>
        <View className="flex-row items-center gap-3">
          <Skeleton width={56} height={56} borderRadius={18} />
          <View className="flex-1">
            <SkeletonLine width="62%" height={13} />
            <SkeletonLine width="46%" height={10} className="mt-3" />
            <SkeletonLine width="34%" height={10} className="mt-2" />
          </View>
          <SkeletonCircle size={18} />
        </View>
      </SkeletonCard>

      <View className="mb-3 flex-row items-center justify-between">
        <SkeletonLine width={126} height={16} />
        <SkeletonLine width={54} height={11} />
      </View>
      <SkeletonCard radius={16} padding={0} className="overflow-hidden">
        <View className="flex-row flex-wrap">
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              className={`w-1/2 flex-row items-center gap-3 px-3 py-3 ${index < 2 ? 'border-b border-bg' : ''} ${index % 2 === 0 ? 'border-r border-bg' : ''}`}
            >
              <Skeleton width={44} height={44} borderRadius={13} />
              <View>
                <SkeletonLine width={64} height={10} />
                <SkeletonLine width={36} height={16} className="mt-2" />
              </View>
            </View>
          ))}
        </View>
      </SkeletonCard>
    </ScreenSkeleton>
  );
}

export function UniversitiesSkeleton() {
  return (
    <ScreenSkeleton withNav contentClassName="px-5 pb-32 pt-2">
      <SkeletonCard radius={18} padding={16} className="mb-4" style={{ backgroundColor: '#F0EDFF' }}>
        <View className="mb-3 flex-row items-center justify-between">
          <SkeletonLine width={142} height={16} />
          <Skeleton width={78} height={30} borderRadius={12} />
        </View>
        {[0, 1].map((item) => (
          <View key={item} className="mb-2 flex-row items-center gap-3 rounded-[16px] bg-white px-3 py-2.5">
            <Skeleton width={44} height={44} borderRadius={14} />
            <View className="flex-1">
              <SkeletonLine width={72} height={13} />
              <SkeletonLine width={132} height={10} className="mt-2" />
            </View>
            <SkeletonCircle size={46} />
          </View>
        ))}
        <Skeleton width="100%" height={44} borderRadius={15} className="mt-1" />
      </SkeletonCard>

      <View className="mb-3 flex-row items-center justify-between">
        <SkeletonLine width={166} height={16} />
        <SkeletonLine width={58} height={11} />
      </View>
      <Skeleton width="100%" height={46} borderRadius={13} className="mb-3" />
      <SmallTabRow count={4} />
      <SkeletonLine width={148} height={11} className="mb-3" />
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} radius={18} padding={14} className="mb-3">
          <View className="flex-row items-center gap-3">
            <Skeleton width={46} height={46} borderRadius={14} />
            <View className="flex-1">
              <SkeletonLine width="78%" height={12} />
              <SkeletonLine width="44%" height={10} className="mt-2" />
              <SkeletonLine width="38%" height={9} className="mt-2" />
            </View>
            <Skeleton width={58} height={50} borderRadius={14} />
          </View>
        </SkeletonCard>
      ))}
    </ScreenSkeleton>
  );
}

export function UniversityDetailSkeleton() {
  return (
    <ScreenSkeleton contentClassName="pb-8" className="flex-1 bg-bg">
      <LinearGradient colors={['#A895FF', '#8EB4FF']} className="mx-[10px] mt-0 rounded-[30px] px-4 pb-7 pt-4">
        <HeaderSkeleton centered />
        <View className="flex-row items-center gap-4">
          <Skeleton width={68} height={68} borderRadius={20} />
          <View className="flex-1">
            <SkeletonLine width="90%" height={20} />
            <SkeletonLine width="72%" height={20} className="mt-3" />
            <SkeletonLine width="54%" height={12} className="mt-5" />
            <SkeletonLine width="44%" height={12} className="mt-3" />
          </View>
        </View>
        <View className="mt-5 flex-row gap-3">
          <Skeleton width={76} height={34} borderRadius={16} />
          <Skeleton width={132} height={34} borderRadius={16} />
        </View>
      </LinearGradient>
      <View className="-mt-3 flex-row gap-2 px-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} radius={20} padding={14} style={{ flex: 1 }}>
            <SkeletonLine width="56%" height={20} />
            <SkeletonLine width="88%" height={10} className="mt-3" />
          </SkeletonCard>
        ))}
      </View>
      <View className="px-5 pt-6">
        <SkeletonLine width={170} height={18} className="mb-3" />
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} radius={20} padding={14} className="mb-3">
            <View className="flex-row items-center gap-3">
              <Skeleton width={44} height={44} borderRadius={16} />
              <View className="flex-1">
                <SkeletonLine width="62%" height={13} />
                <SkeletonLine width="46%" height={10} className="mt-2" />
                <Skeleton width="100%" height={5} borderRadius={5} className="mt-3" />
              </View>
              <SkeletonLine width={34} height={13} />
            </View>
          </SkeletonCard>
        ))}
        <ButtonSkeleton className="mt-2" />
      </View>
    </ScreenSkeleton>
  );
}

export function AddPensumSkeleton() {
  return (
    <ScreenSkeleton contentClassName="px-5 pb-8 pt-2">
      <HeaderSkeleton centered />
      <View className="mb-6 flex-row items-start justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="flex-1 items-center">
            <SkeletonCircle size={20} />
            <SkeletonLine width={58} height={9} className="mt-2" />
          </View>
        ))}
      </View>
      <SkeletonCard radius={24} padding={18} className="mb-4">
        <SkeletonLine width="72%" height={16} className="self-center" />
        <SkeletonLine width="58%" height={11} className="mt-3 self-center" />
        <View className="mt-5 items-center rounded-[18px] border border-dashed border-primary/30 bg-bg px-5 py-8">
          <SkeletonCircle size={56} />
          <SkeletonLine width={156} height={13} className="mt-4" />
          <SkeletonLine width={138} height={12} className="mt-2" />
          <SkeletonLine width={62} height={9} className="mt-4" />
        </View>
      </SkeletonCard>
      <SkeletonCard radius={16} padding={12} className="mb-4">
        <View className="flex-row items-center gap-3">
          <Skeleton width={40} height={40} borderRadius={12} />
          <View className="flex-1">
            <SkeletonLine width="68%" height={12} />
            <SkeletonLine width="22%" height={10} className="mt-2" />
          </View>
          <SkeletonCircle size={16} />
        </View>
      </SkeletonCard>
      <SkeletonCard radius={18} padding={15} className="mb-7" style={{ backgroundColor: '#F3F0FF' }}>
        <SkeletonLine width="72%" height={12} className="mb-4" />
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="mb-3 flex-row items-center gap-2">
            <SkeletonCircle size={16} />
            <SkeletonLine width={index % 2 ? '55%' : '72%'} height={11} />
          </View>
        ))}
      </SkeletonCard>
      <ButtonSkeleton className="mt-0" />
      <SkeletonLine width={54} height={13} className="mt-6 self-center" />
    </ScreenSkeleton>
  );
}

export function CurriculumMapSkeleton() {
  const nodes = [
    [122, 8],
    [42, 92],
    [204, 92],
    [42, 178],
    [204, 178],
    [42, 276],
    [204, 276],
    [42, 374],
    [204, 374],
    [122, 482],
  ];

  return (
    <ScreenSkeleton withNav scroll={false} contentClassName="flex-1 px-5 pt-2">
      <View className="mb-2 flex-row items-center justify-between">
        <SkeletonCircle size={40} />
        <SkeletonLine width={130} height={15} />
        <SkeletonCircle size={40} />
      </View>
      <View className="mb-1 flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="flex-row items-center gap-2">
            <SkeletonCircle size={10} />
            <SkeletonLine width={58} height={9} />
          </View>
        ))}
      </View>
      <View className="flex-1 items-center pb-24">
        <View className="relative h-[610px] w-[330px]">
          <Svg width={330} height={610} style={{ position: 'absolute', inset: 0 }}>
            {[
              'M 175 72 C 175 98, 95 98, 95 121',
              'M 175 72 C 175 98, 257 98, 257 121',
              'M 95 150 C 95 174, 95 174, 95 207',
              'M 257 150 C 257 174, 257 174, 257 207',
              'M 95 236 C 95 262, 95 262, 95 305',
              'M 257 236 C 257 262, 257 262, 257 305',
              'M 95 334 C 95 360, 95 360, 95 403',
              'M 257 334 C 257 360, 257 360, 257 403',
              'M 95 432 C 95 464, 175 464, 175 511',
            ].map((d) => (
              <Path key={d} d={d} stroke="rgba(108,77,255,0.15)" strokeWidth={2} fill="none" strokeLinecap="round" />
            ))}
          </Svg>
          {nodes.map(([left, top], index) => (
            <Skeleton key={index} width={106} height={58} borderRadius={14} style={{ position: 'absolute', left, top }} />
          ))}
        </View>
      </View>
      <SkeletonCircle size={56} className="absolute bottom-28 right-5" />
    </ScreenSkeleton>
  );
}

export function SubjectDetailSkeleton() {
  return (
    <ScreenSkeleton contentClassName="pb-8">
      <LinearGradient colors={['#B098FF', '#9E85FF']} className="rounded-b-[32px] px-5 pb-8 pt-4">
        <View className="mb-8 flex-row items-center justify-between">
          <SkeletonCircle size={40} />
          <View className="flex-row gap-3">
            <SkeletonCircle size={22} />
            <SkeletonCircle size={22} />
          </View>
        </View>
        <View className="items-center">
          <Skeleton width={92} height={92} borderRadius={24} />
          <View className="mt-7 flex-row items-center gap-3">
            <SkeletonLine width={190} height={21} />
            <Skeleton width={78} height={30} borderRadius={12} />
          </View>
        </View>
      </LinearGradient>
      <View className="-mt-5 rounded-t-[26px] bg-white px-5 pb-6 pt-4">
        <View className="mb-4 flex-row border-b border-bg">
          <SkeletonLine width={94} height={14} className="mb-3 ml-6" />
          <SkeletonLine width={70} height={14} className="mb-3 ml-9" />
        </View>
        <SkeletonLine width="96%" height={12} />
        <SkeletonLine width="86%" height={12} className="mt-3" />
        <SkeletonLine width="72%" height={12} className="mb-5 mt-3" />
        {[0, 1].map((card) => (
          <SkeletonCard key={card} radius={18} padding={15} className="mb-3" style={{ backgroundColor: '#FAFAFF' }}>
            <SkeletonLine width={card ? 142 : 92} height={13} className="mb-4" />
            {Array.from({ length: card ? 3 : 2 }).map((_, index) => (
              <View key={index} className="mb-3 flex-row items-center gap-3">
                <SkeletonCircle size={12} />
                <SkeletonLine width={index % 2 ? '44%' : '58%'} height={12} />
                {card ? null : <SkeletonCircle size={16} className="ml-auto" />}
              </View>
            ))}
          </SkeletonCard>
        ))}
        <SkeletonCard radius={18} padding={15} className="mb-7" style={{ backgroundColor: '#F2EEFF' }}>
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <SkeletonLine width={138} height={13} />
              <SkeletonLine width="86%" height={11} className="mt-3" />
              <SkeletonLine width="64%" height={11} className="mt-2" />
            </View>
            <Skeleton width={58} height={58} borderRadius={18} />
          </View>
        </SkeletonCard>
        <ButtonSkeleton className="mt-0" />
      </View>
    </ScreenSkeleton>
  );
}

export function PlannerSkeleton() {
  return (
    <ScreenSkeleton withNav contentClassName="px-5 pb-32 pt-3">
      <View className="mb-5 flex-row items-center justify-between">
        <SkeletonLine width={160} height={20} />
        <SkeletonCircle size={40} />
      </View>
      <SmallTabRow count={3} />
      <SkeletonCard radius={22} padding={17} className="mb-5" style={{ backgroundColor: '#F0EDFF' }}>
        <SkeletonLine width={118} height={12} />
        <SkeletonLine width={128} height={18} className="mt-3" />
        <Skeleton width="100%" height={7} borderRadius={6} className="mt-4" />
      </SkeletonCard>
      <SkeletonCard radius={22} padding={0} className="mb-4">
        <View className="border-b border-bg px-4 py-4">
          <SkeletonLine width={152} height={13} />
        </View>
        {Array.from({ length: 4 }).map((_, index) => (
          <SubjectRowSkeleton key={index} />
        ))}
        <Skeleton width="90%" height={54} borderRadius={16} className="m-4 self-center" />
      </SkeletonCard>
    </ScreenSkeleton>
  );
}

export function SimulatorSkeleton() {
  return (
    <ScreenSkeleton withNav contentClassName="px-5 pb-36 pt-2">
      <HeaderSkeleton centered />
      <View className="mb-5 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <SkeletonLine width={178} height={20} />
          <SkeletonLine width="90%" height={13} className="mt-3" />
          <SkeletonLine width="70%" height={13} className="mt-2" />
        </View>
        <Skeleton width={96} height={96} borderRadius={22} />
      </View>
      <SmallTabRow count={3} />
      <View className="mb-2 flex-row items-center justify-between">
        <SkeletonLine width={112} height={12} />
        <SkeletonLine width={84} height={11} />
      </View>
      <SkeletonCard radius={18} padding={14} className="mb-5">
        <View className="flex-row items-center gap-3">
          <Skeleton width={40} height={40} borderRadius={12} />
          <View className="flex-1">
            <SkeletonLine width={126} height={13} />
            <SkeletonLine width={86} height={10} className="mt-2" />
          </View>
          <SkeletonCircle size={18} />
        </View>
      </SkeletonCard>
      <SkeletonCard radius={20} padding={16} className="mb-4">
        <View className="mb-5 flex-row items-start justify-between">
          <View>
            <SkeletonLine width={136} height={15} />
            <SkeletonLine width={154} height={10} className="mt-2" />
          </View>
          <SkeletonLine width={76} height={11} />
        </View>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="mb-4 flex-row items-center gap-3">
            <SkeletonCircle size={18} />
            <SkeletonLine width="48%" height={12} />
            <SkeletonLine width={index === 0 ? 82 : 70} height={13} className="ml-auto" />
          </View>
        ))}
        <SkeletonCard radius={14} padding={14} style={{ backgroundColor: '#FFF8EF', shadowOpacity: 0 }}>
          <View className="flex-row gap-3">
            <SkeletonCircle size={28} />
            <View className="flex-1">
              <SkeletonLine width={116} height={13} />
              <SkeletonLine width="96%" height={11} className="mt-3" />
              <SkeletonLine width="74%" height={11} className="mt-2" />
            </View>
          </View>
        </SkeletonCard>
      </SkeletonCard>
      <View className="mb-3 flex-row items-center justify-between">
        <SkeletonLine width={140} height={15} />
        <SkeletonLine width={98} height={11} />
      </View>
      <SkeletonCard radius={20} padding={0} className="mb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SubjectRowSkeleton key={index} last={index === 2} />
        ))}
      </SkeletonCard>
      <ButtonSkeleton className="mt-0" />
    </ScreenSkeleton>
  );
}

export function ProgressSkeleton() {
  return (
    <ScreenSkeleton withNav contentClassName="px-5 pb-32 pt-3">
      <SkeletonLine width={128} height={20} className="mb-4" />
      <View className="mb-5 items-center">
        <SkeletonCircle size={168} />
        <SkeletonLine width={152} height={13} className="mt-3" />
      </View>
      <View className="mb-6 flex-row flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} radius={20} padding={14} style={{ width: '48%' }}>
            <SkeletonCircle size={34} />
            <SkeletonLine width="78%" height={10} className="mt-4" />
            <SkeletonLine width="42%" height={16} className="mt-2" />
          </SkeletonCard>
        ))}
      </View>
      <SkeletonCard radius={16} padding={0} className="mb-6 overflow-hidden" style={{ backgroundColor: '#F3F0FF' }}>
        <View className="h-[142px] flex-row items-center px-5">
          <View className="z-10 w-[58%]">
            <SkeletonLine width={142} height={13} />
            <SkeletonLine width={96} height={26} className="mt-4" />
            <SkeletonLine width={158} height={12} className="mt-3" />
          </View>
          <Skeleton width={178} height={124} borderRadius={26} style={{ position: 'absolute', right: -6, bottom: 8 }} />
        </View>
      </SkeletonCard>
      <SkeletonCard radius={22} padding={18} style={{ backgroundColor: '#F0EDFF' }}>
        <SkeletonLine width={92} height={14} />
        <SkeletonLine width="94%" height={12} className="mt-3" />
        <SkeletonLine width="72%" height={12} className="mt-2" />
      </SkeletonCard>
    </ScreenSkeleton>
  );
}

export function AddUniversitySkeleton() {
  return (
    <ScreenSkeleton contentClassName="px-5 pb-8 pt-2">
      <HeaderSkeleton centered />
      <View className="mb-7 items-center">
        <Skeleton width="100%" height={168} borderRadius={28} />
        <SkeletonLine width={270} height={20} className="mt-5" />
        <SkeletonLine width={292} height={13} className="mt-3" />
        <SkeletonLine width={230} height={13} className="mt-2" />
      </View>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} radius={20} padding={14} className="mb-3">
          <View className="flex-row items-center gap-4">
            <Skeleton width={48} height={48} borderRadius={16} />
            <View className="flex-1">
              <SkeletonLine width="54%" height={13} />
              <SkeletonLine width="76%" height={11} className="mt-2" />
            </View>
          </View>
        </SkeletonCard>
      ))}
      <ButtonSkeleton className="mt-8" />
      <SkeletonLine width={64} height={13} className="mt-6 self-center" />
    </ScreenSkeleton>
  );
}

export function ValidationPensumSkeleton() {
  return (
    <ScreenSkeleton contentClassName="px-5 pb-8 pt-2">
      <HeaderSkeleton centered />
      <View className="items-center pt-5">
        <SkeletonCircle size={80} />
        <SkeletonLine width={230} height={18} className="mt-5" />
        <SkeletonLine width={242} height={12} className="mt-3" />
      </View>
      <View className="mt-5 flex-row gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} radius={20} padding={14} style={{ flex: 1 }}>
            <SkeletonLine width="58%" height={20} />
            <SkeletonLine width="88%" height={10} className="mt-3" />
          </SkeletonCard>
        ))}
      </View>
      <SkeletonCard radius={22} padding={16} className="mt-5">
        <View className="mb-3 flex-row items-center justify-between">
          <SkeletonLine width={156} height={13} />
          <SkeletonLine width={56} height={11} />
        </View>
        {Array.from({ length: 3 }).map((_, index) => (
          <SubjectRowSkeleton key={index} />
        ))}
        <SkeletonLine width={120} height={12} className="mt-3" />
      </SkeletonCard>
      <ButtonSkeleton className="mt-7" />
      <SkeletonLine width={54} height={13} className="mt-6 self-center" />
    </ScreenSkeleton>
  );
}

export function NotificationsSkeleton() {
  return (
    <ScreenSkeleton contentClassName="px-5 pb-8 pt-2">
      <HeaderSkeleton centered />
      <SkeletonCard radius={24} padding={18} className="mb-5" style={{ backgroundColor: '#F1ECFF' }}>
        <View className="flex-row items-center gap-4">
          <Skeleton width={48} height={48} borderRadius={16} />
          <View className="flex-1">
            <SkeletonLine width={92} height={18} />
            <SkeletonLine width="92%" height={12} className="mt-3" />
            <SkeletonLine width="68%" height={12} className="mt-2" />
          </View>
        </View>
      </SkeletonCard>
      <View className="mb-3 flex-row items-center justify-between">
        <SkeletonLine width={44} height={15} />
        <SkeletonLine width={82} height={12} />
      </View>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} radius={20} padding={14} className="mb-3">
          <View className="flex-row gap-3">
            <Skeleton width={44} height={44} borderRadius={16} />
            <View className="flex-1">
              <View className="flex-row items-start justify-between gap-3">
                <SkeletonLine width="62%" height={13} />
                <SkeletonLine width={42} height={10} />
              </View>
              <SkeletonLine width="92%" height={11} className="mt-3" />
              <SkeletonLine width="70%" height={11} className="mt-2" />
            </View>
            <SkeletonCircle size={10} />
          </View>
        </SkeletonCard>
      ))}
    </ScreenSkeleton>
  );
}
