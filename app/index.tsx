import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Redirect, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/mockData";
import { TYPOGRAPHY } from "@/constants/typography";
import { auth } from "@/src/config/firebase";
import { getUserProfile, updateLastAccess } from "@/src/services/userService";

type AppRoute = "/login" | "/agregar-universidad" | "/(tabs)";

type UserProfile = {
  estado_cuenta?: string;
  tiene_pensum_activo?: boolean;
};

function withTimeout<T>(promise: Promise<T>, milliseconds: number, message: string) {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), milliseconds);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export default function IndexScreen() {
  const [targetRoute, setTargetRoute] = React.useState<AppRoute | null>(null);
  const [message, setMessage] = React.useState("Preparando tu sesion...");
  const [error, setError] = React.useState("");
  const [retryKey, setRetryKey] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      setError("");
      setTargetRoute(null);

      if (!firebaseUser) {
        setTargetRoute("/login");
        return;
      }

      try {
        setMessage("Cargando tu perfil...");
        const profile = (await withTimeout(
          getUserProfile(firebaseUser.uid),
          12000,
          "Firebase tardo demasiado en responder. Revisa tu conexion e intenta otra vez."
        )) as UserProfile | null;

        if (!mounted) return;

        if (!profile) {
          await signOut(auth);
          setTargetRoute("/login");
          return;
        }

        if (profile.estado_cuenta !== "activo") {
          await signOut(auth);
          setTargetRoute("/login");
          return;
        }

        updateLastAccess(firebaseUser.uid).catch((lastAccessError) => {
          console.warn("No se pudo actualizar ultimo_acceso:", lastAccessError);
        });

        setTargetRoute(profile.tiene_pensum_activo === false ? "/agregar-universidad" : "/(tabs)");
      } catch (bootError) {
        if (!mounted) return;

        setError(
          bootError instanceof Error
            ? bootError.message
            : "No pudimos cargar tu perfil. Revisa tu conexion e intenta nuevamente."
        );
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [retryKey]);

  if (targetRoute) {
    return <Redirect href={targetRoute as Href} />;
  }

  const handleRetry = () => {
    setError("");
    setMessage("Preparando tu sesion...");
    setRetryKey((current) => current + 1);
  };

  const handleGoToLogin = async () => {
    await signOut(auth);
    setTargetRoute("/login");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white px-8">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-[22px] bg-primaryLight">
        <ActivityIndicator color={COLORS.primary} />
      </View>
      <Text style={TYPOGRAPHY.labelSemibold} className="text-center text-text">
        {error ? "No pudimos cargar tu perfil" : message}
      </Text>
      {error ? (
        <>
          <Text style={TYPOGRAPHY.body} className="mt-3 text-center text-muted">
            {error}
          </Text>
          <Pressable onPress={handleRetry} className="mt-6 rounded-[16px] bg-primary px-6 py-3">
            <Text style={TYPOGRAPHY.button} className="text-white">
              Intentar de nuevo
            </Text>
          </Pressable>
          <Pressable onPress={handleGoToLogin} className="mt-3 px-4 py-2">
            <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">
              Volver al login
            </Text>
          </Pressable>
        </>
      ) : null}
    </SafeAreaView>
  );
}
