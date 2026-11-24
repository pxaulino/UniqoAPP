import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, CalendarDays, Home, UserRound } from 'lucide-react-native';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import FloatingActionButton from '../action-center/FloatingActionButton';
import AcademicActionCenter from '../action-center/AcademicActionCenter';
import { platformShadow } from '@/utils/platformStyles';

const TABS = [
  { label: 'Inicio', icon: Home, route: '/(tabs)' },
  { label: 'Universidades', icon: BookOpen, route: '/(tabs)/universidades' },
  { label: 'Mis estudios', icon: CalendarDays, route: '/(tabs)/planner' },
  { label: 'Perfil', icon: UserRound, route: '/(tabs)/cuenta' },
] as const;

function isTabActive(pathname: string, route: string) {
  const normalizedRoute = route.replace('/(tabs)', '') || '/';
  if (normalizedRoute === '/') return pathname === '/' || pathname === '/(tabs)';
  return pathname === normalizedRoute || pathname === route;
}

export default function FloatingTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [isActionCenterVisible, setIsActionCenterVisible] = useState(false);

  return (
    <>
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 10), pointerEvents: 'box-none' }}
        className="absolute bottom-0 left-0 right-0 px-5 pt-3"
      >
        <View
          className="h-[78px] flex-row items-center justify-between rounded-[30px] border border-white/80 bg-white px-3"
          style={{
            ...platformShadow({
              color: COLORS.primary,
              offset: { width: 0, height: 18 },
              opacity: 0.2,
              radius: 32,
              elevation: 18,
            }),
          }}
        >
          {TABS.slice(0, 2).map((tab) => {
            const active = isTabActive(pathname, tab.route);
            const Icon = tab.icon;
            return (
              <Pressable
                key={tab.route}
                accessibilityRole="tab" accessibilityState={{ selected: active }}
                onPress={() => router.navigate(tab.route)}
                className="flex-1 items-center justify-center"
              >
                <View
                  style={{
                    width: 34,
                    height: 30,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? 'rgba(108,77,255,0.1)' : 'transparent',
                  }}
                >
                  <Icon size={21} color={active ? COLORS.primary : COLORS.muted} strokeWidth={active ? 2.5 : 1.8} />
                </View>
                <Text style={[TYPOGRAPHY.tab, { color: active ? COLORS.primary : COLORS.muted, marginTop: 4 }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}

          <FloatingActionButton 
            isOpen={isActionCenterVisible}
            onPress={() => setIsActionCenterVisible(true)}
          />

          {TABS.slice(2).map((tab) => {
            const active = isTabActive(pathname, tab.route);
            const Icon = tab.icon;
            return (
              <Pressable
                key={tab.route}
                accessibilityRole="tab" accessibilityState={{ selected: active }}
                onPress={() => router.navigate(tab.route)}
                className="flex-1 items-center justify-center"
              >
                <View
                  style={{
                    width: 34,
                    height: 30,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? 'rgba(108,77,255,0.1)' : 'transparent',
                  }}
                >
                  <Icon size={21} color={active ? COLORS.primary : COLORS.muted} strokeWidth={active ? 2.5 : 1.8} />
                </View>
                <Text style={[TYPOGRAPHY.tab, { color: active ? COLORS.primary : COLORS.muted, marginTop: 4 }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isActionCenterVisible && (
        <AcademicActionCenter onClose={() => setIsActionCenterVisible(false)} />
      )}
    </>
  );
}
