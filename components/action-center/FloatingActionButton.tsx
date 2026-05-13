import { COLORS } from '@/constants/mockData';
import { SPRING_CONFIGS } from '@/utils/animationConfig';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Layers } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingActionButtonProps {
  onPress: () => void;
  isOpen: boolean;
}

export default function FloatingActionButton({ onPress, isOpen }: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const openScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.35);

  React.useEffect(() => {
    openScale.value = withSpring(isOpen ? 1.08 : 1, {
      ...SPRING_CONFIGS.bouncy,
    });
  }, [isOpen, openScale]);

  const fabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value * openScale.value },
      ],
      shadowOpacity: shadowOpacity.value,
    };
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.85, SPRING_CONFIGS.tight);
    shadowOpacity.value = withTiming(0.5, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIGS.tight);
    shadowOpacity.value = withTiming(0.35, { duration: 200 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        fabStyle,
        {
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 20,
          elevation: 16,
        }
      ]}
      className="-mt-10 h-[62px] w-[62px] items-center justify-center rounded-full"
    >
      <LinearGradient
        colors={['#7A5CFF', '#5B38F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-full w-full items-center justify-center rounded-full"
      >
        <Layers
          size={26} 
          color="#FFF" 
          strokeWidth={2.4} 
        />
      </LinearGradient>
    </AnimatedPressable>
  );
}
