import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import '../nativewind-interop';
import { configureTypography } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';
import { ConfirmAction, FormButton, FormError, useSave } from '@/components/academic/AcademicForm';
import { COLORS } from '@/constants/mockData';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

configureTypography();

export const unstable_settings = {
  anchor: 'index',
};

function AcademicStartup() {
  const status = useAcademicStore((state) => state.status);
  const error = useAcademicStore((state) => state.error);
  const initialize = useAcademicStore((state) => state.initialize);
  const reset = useAcademicStore((state) => state.reset);
  const save = useSave();

  useEffect(() => { void initialize(); }, [initialize]);
  return (
    <View className="flex-1 justify-center px-8">
      {status === 'loading' ? <ActivityIndicator accessibilityLabel="Cargando datos locales" color={COLORS.primary} /> : (
        <>
          <Text accessibilityRole="header" className="text-[21px] font-bold text-text">Datos locales</Text>
          <FormError error={error ?? ''} />
          <FormError error={save.error} />
          <FormButton label="Reintentar" onPress={() => save.run(initialize)} disabled={save.busy} />
          <ConfirmAction label="Reiniciar demo" prompt="Se iniciará una demo vacía. Se guardará una copia de los datos ilegibles."
            busy={save.busy} onConfirm={() => save.run(reset)} />
        </>
      )}
    </View>
  );
}

function AcademicNavigator() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
          fullScreenGestureShadowEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="register" options={{ headerShown: false, presentation: 'card' }} />
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
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  const status = useAcademicStore((state) => state.status);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppFrame>{status === 'ready' ? <AcademicNavigator /> : <AcademicStartup />}</AppFrame>
    </GestureHandlerRootView>
  );
}
