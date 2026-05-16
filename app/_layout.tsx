import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import '../nativewind-interop';
import { configureTypography } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';

configureTypography();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppFrame>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          fullScreenGestureShadowEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="universidad/[id]"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="materia/[id]"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="materias/[type]"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="agregar-pensum"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="agregar-universidad"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="subir-pensum"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="validacion-pensum"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="notificaciones"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="asistente-academico"
          options={{ headerShown: false, presentation: 'modal' }}
        />
        <Stack.Screen
          name="logros"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="marcar-aprobada"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="ruta-inteligente"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="estadisticas-avanzadas"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="recomendaciones"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="calendario"
          options={{ headerShown: false, presentation: 'card' }}
        />
        <Stack.Screen
          name="perfil"
          options={{ headerShown: false, presentation: 'card' }}
        />
      </Stack>
      <StatusBar style="dark" backgroundColor="#F8F7FF" />
    </AppFrame>
  );
}
