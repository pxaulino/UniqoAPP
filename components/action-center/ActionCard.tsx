import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import { SPRING_CONFIGS } from '@/utils/animationConfig';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  colors: [string, string];
  onPress?: () => void;
  index: number;
}

export default function ActionCard({ title, subtitle, icon: Icon, colors, onPress, index }: ActionCardProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    Haptics.selectionAsync();
    scale.value = withSpring(0.97, SPRING_CONFIGS.tight);
    translateY.value = withTiming(1, { duration: 120 });
    shadowOpacity.value = withTiming(0.12, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIGS.tight);
    translateY.value = withTiming(0, { duration: 200 });
    shadowOpacity.value = withTiming(0.08, { duration: 200 });
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 50).springify().damping(16).stiffness(220)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          width: '48%',
          minHeight: subtitle ? 126 : 102,
          marginBottom: 16,
          padding: 16,
          borderRadius: 20,
          backgroundColor: COLORS.white,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 12,
          elevation: 5,
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 48,
          height: 48,
          marginBottom: 12,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={24} color="#FFF" strokeWidth={2.2} />
      </LinearGradient>
      
      <Text
        style={[TYPOGRAPHY.cardTitle, { color: COLORS.text, fontSize: 15, lineHeight: 20 }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      {subtitle && (
        <Text
          style={[TYPOGRAPHY.label, { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 4 }]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      )}
    </AnimatedPressable>
  );
}
