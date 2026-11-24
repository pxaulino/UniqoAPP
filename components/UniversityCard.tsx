import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Image, type ImageSource } from 'expo-image';
import Svg, { Polygon } from 'react-native-svg';
import { COLORS, type University, type UniversityLogoKey } from '@/constants/mockData';
import Card from './ui/Card';

type UniversityCardProps = University & {
  compact?: boolean;
  delay?: number;
};

const logoSources: Record<UniversityLogoKey, ImageSource> = {
  intec: require('@/assets/images/universidades/intec.png'),
  uasd: require('@/assets/images/universidades/uasd.png'),
  apec: require('@/assets/images/universidades/apec.webp'),
};

export function UniversityLogo({
  color,
  text,
  logo,
  size = 48,
}: {
  color: string;
  text: string;
  logo?: UniversityLogoKey | null;
  size?: number;
}) {
  const points = `${size / 2},2 ${size - 4},${size * 0.27} ${size - 4},${size * 0.73} ${size / 2},${size - 2} 4,${size * 0.73} 4,${size * 0.27}`;

  if (logo) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.32),
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: 'rgba(108,77,255,0.08)',
          shadowColor: color,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 3,
        }}
        className="items-center justify-center overflow-hidden"
      >
        <Image
          source={logoSources[logo]}
          contentFit="contain"
          style={{
            width: size * 0.78,
            height: size * 0.78,
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Polygon points={points} fill={color} />
      </Svg>
      <Text className="text-[13px] font-bold lowercase text-white">{text}</Text>
    </View>
  );
}

export default function UniversityCard(props: UniversityCardProps) {
  const router = useRouter();
  const { id, name, slug, location, color, logoText, logo, compact, delay } = props;

  return (
    <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/universidad/[id]', params: { id } })}>
      <Card delay={delay} padding={compact ? 12 : 15} radius={18} className="mb-3" style={{ shadowOpacity: 0.06, elevation: 3 }}>
        <View className="flex-row items-center gap-3">
          <UniversityLogo color={color} text={logoText} logo={logo} size={compact ? 44 : 52} />
          <View className="flex-1">
            <Text className="text-[13px] font-bold leading-5 text-text" numberOfLines={compact ? 2 : 1}>
              {compact ? name : `${name} (${slug})`}
            </Text>
            <Text className="mt-0.5 text-[11px] font-medium text-muted">{location}</Text>
          </View>
          {!compact ? <ChevronRight size={18} color={COLORS.text} /> : null}
        </View>
      </Card>
    </Pressable>
  );
}
