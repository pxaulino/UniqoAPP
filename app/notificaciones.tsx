import Card from '@/components/ui/Card';
import { NotificationsSkeleton } from '@/components/skeleton/ScreenSkeletons';
import { COLORS, notifications } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BookOpen, CheckCheck, Clock3, Sparkles, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const iconMap = {
  class: Clock3,
  unlock: Sparkles,
  simulation: BookOpen,
  progress: TrendingUp,
};

type Notification = (typeof notifications)[number];

function NotificationCard({
  item,
  index,
  read,
  onPress,
}: {
  item: Notification;
  index: number;
  read: boolean;
  onPress: () => void;
}) {
  const Icon = iconMap[item.type as keyof typeof iconMap] ?? Bell;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 55).duration(420).springify().damping(18)}
      onPress={onPress}
      onPressIn={() => {
        Haptics.selectionAsync();
        scale.value = withSpring(0.98, { damping: 16, stiffness: 260 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 260 });
      }}
      style={animatedStyle}
      className="mb-3"
    >
      <Card padding={14} radius={20} style={{ backgroundColor: read ? 'rgba(255,255,255,0.74)' : '#FFFFFF' }}>
        <View className="flex-row gap-3">
          <View style={{ backgroundColor: item.bg }} className="h-11 w-11 items-center justify-center rounded-2xl">
            <Icon size={20} color={item.color} strokeWidth={2.1} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-start justify-between gap-3">
              <Text style={TYPOGRAPHY.cardTitle} className={`flex-1 text-[14px] ${read ? 'text-text/75' : 'text-text'}`}>
                {item.title}
              </Text>
              <Text style={TYPOGRAPHY.label} className={read ? 'text-muted/70' : 'text-primary'}>
                {item.time}
              </Text>
            </View>
            <Text style={TYPOGRAPHY.body} className={`mt-1 text-[13px] leading-5 ${read ? 'text-muted/70' : 'text-muted'}`}>
              {item.message}
            </Text>
          </View>
          {!read ? <View className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" /> : null}
        </View>
      </Card>
    </AnimatedPressable>
  );
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const loading = useFakeLoading(650);
  const [readIds, setReadIds] = React.useState<string[]>(notifications.filter((item) => !item.unread).map((item) => item.id));

  const unreadCount = notifications.filter((item) => !readIds.includes(item.id)).length;
  const today = notifications.filter((item) => !readIds.includes(item.id));
  const previous = notifications.filter((item) => readIds.includes(item.id));

  if (loading) return <NotificationsSkeleton />;

  const markAllAsRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setReadIds(notifications.map((item) => item.id));
  };

  return (
    <Animated.View entering={FadeIn.duration(240)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-10 pt-2">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-2xl">
              <ArrowLeft size={22} color={COLORS.text} />
            </Pressable>
            <Text style={TYPOGRAPHY.sectionTitle} className="text-text">
              Notificaciones
            </Text>
            <Pressable onPress={markAllAsRead} className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <CheckCheck size={19} color={COLORS.primary} />
            </Pressable>
          </View>

          <Card padding={18} radius={24} className="mb-5" style={{ backgroundColor: '#F1ECFF' }}>
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Bell size={22} color={COLORS.primary} />
              </View>
              <View className="flex-1">
                <Text style={TYPOGRAPHY.cardTitle} className="text-[18px] text-text">
                  {unreadCount} nuevas
                </Text>
                <Text style={TYPOGRAPHY.body} className="mt-1 text-[14px] leading-5 text-muted">
                  Avisos academicos, progreso y cambios importantes de tu ruta.
                </Text>
              </View>
            </View>
          </Card>

          <View className="mb-3 flex-row items-center justify-between">
            <Text style={TYPOGRAPHY.cardTitle} className="text-[16px] text-text">
              Hoy
            </Text>
            <Pressable onPress={markAllAsRead}>
              <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">
                Marcar todo
              </Text>
            </Pressable>
          </View>

          {today.length ? (
            today.map((item, index) => (
              <NotificationCard
                key={item.id}
                item={item}
                index={index}
                read={false}
                onPress={() => setReadIds((current) => Array.from(new Set([...current, item.id])))}
              />
            ))
          ) : (
            <Card padding={18} radius={22} className="mb-5">
              <Text style={TYPOGRAPHY.cardTitle} className="text-text">
                Todo al dia
              </Text>
              <Text style={TYPOGRAPHY.body} className="mt-1 text-[13px] leading-5 text-muted">
                No tienes notificaciones nuevas por ahora.
              </Text>
            </Card>
          )}

          <Text style={TYPOGRAPHY.cardTitle} className="mb-3 mt-3 text-[16px] text-text">
            Anteriores
          </Text>
          {previous.map((item, index) => (
            <NotificationCard
              key={item.id}
              item={item}
              index={index + today.length}
              read
              onPress={() => null}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
