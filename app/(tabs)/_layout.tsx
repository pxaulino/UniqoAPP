import { Tabs } from 'expo-router';
import { View } from 'react-native';
import FloatingTabBar from '@/components/ui/FloatingTabBar';

// We use a custom FloatingTabBar so hide the default one
export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="universidades" />
        <Tabs.Screen name="mapa" />
        <Tabs.Screen name="planner" />
        <Tabs.Screen name="simulador" />
        <Tabs.Screen name="progreso" />
        <Tabs.Screen name="cuenta" />
      </Tabs>
      <FloatingTabBar />
    </View>
  );
}
