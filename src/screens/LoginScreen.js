import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/constants/mockData";
import { TYPOGRAPHY } from "@/constants/typography";
import { loginUser, resetPassword } from "@/src/services/authService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    const nextErrors = {};
    const cleanCorreo = correo.trim();

    if (!cleanCorreo) {
      nextErrors.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(cleanCorreo)) {
      nextErrors.correo = "El correo no tiene un formato valido.";
    }

    if (!password) {
      nextErrors.password = "La contrasena es obligatoria.";
    }

    setErrors(nextErrors);
    setSuccessMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const session = await loginUser({ correo, password });

      if (session.isAdmin) {
        // Admin Panel access can be enabled later without forcing admin redirect here.
      }

      if (session.profile.tiene_pensum_activo === false) {
        router.replace("/agregar-universidad");
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "No pudimos iniciar sesion. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const cleanCorreo = correo.trim();

    setSuccessMessage("");
    if (!cleanCorreo) {
      setErrors({ correo: "Ingresa tu correo para enviarte la recuperacion." });
      return;
    }

    if (!emailRegex.test(cleanCorreo)) {
      setErrors({ correo: "El correo no tiene un formato valido." });
      return;
    }

    setResetLoading(true);
    setErrors({});
    try {
      await resetPassword(cleanCorreo);
      setSuccessMessage("Te enviamos un correo para restablecer tu contrasena.");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "No pudimos enviar el correo de recuperacion.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(240)} className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="flex-grow px-5 pb-10 pt-8"
          >
            <View className="mb-7 flex-row items-center justify-center">
              <Text style={TYPOGRAPHY.labelSemibold} className="text-muted">
                Uniqo
              </Text>
            </View>

            <Animated.View entering={FadeInDown.duration(380).springify().damping(18)} className="flex-1 justify-center">
              <View className="mb-7">
                <LinearGradient colors={["#F4F0FF", "#FFFFFF"]} className="mb-5 h-16 w-16 items-center justify-center rounded-[22px]">
                  <View className="h-10 w-10 items-center justify-center rounded-[15px] bg-primary">
                    <Mail size={21} color={COLORS.white} strokeWidth={2.2} />
                  </View>
                </LinearGradient>
                <Text style={TYPOGRAPHY.screenTitle} className="text-text">
                  Bienvenido de vuelta
                </Text>
                <Text style={TYPOGRAPHY.body} className="mt-2 max-w-[310px] text-muted">
                  Entra a tu cuenta para continuar gestionando tu progreso academico.
                </Text>
              </View>

              <View className="rounded-[24px] border border-[#EEEAFB] bg-[#FBFAFF] p-4">
                <View className="mb-4">
                  <Text style={TYPOGRAPHY.labelSemibold} className="mb-2 text-text">
                    Correo
                  </Text>
                  <View className={`min-h-[54px] flex-row items-center rounded-[16px] border bg-white px-4 ${errors.correo ? "border-danger" : "border-[#ECE8FF]"}`}>
                    <Mail size={18} color={COLORS.primary} />
                    <TextInput
                      value={correo}
                      onChangeText={(value) => {
                        setCorreo(value);
                        setSuccessMessage("");
                        setErrors((current) => ({ ...current, correo: undefined, general: undefined }));
                      }}
                      placeholder="tu@correo.com"
                      placeholderTextColor={COLORS.muted}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoCorrect={false}
                      className="ml-3 min-h-[52px] flex-1 text-[15px] font-medium text-text"
                    />
                  </View>
                  {errors.correo ? (
                    <Text style={TYPOGRAPHY.label} className="mt-2 text-danger">
                      {errors.correo}
                    </Text>
                  ) : null}
                </View>

                <View className="mb-4">
                  <Text style={TYPOGRAPHY.labelSemibold} className="mb-2 text-text">
                    Contrasena
                  </Text>
                  <View className={`min-h-[54px] flex-row items-center rounded-[16px] border bg-white px-4 ${errors.password ? "border-danger" : "border-[#ECE8FF]"}`}>
                    <LockKeyhole size={18} color={COLORS.primary} />
                    <TextInput
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        setSuccessMessage("");
                        setErrors((current) => ({ ...current, password: undefined, general: undefined }));
                      }}
                      placeholder="Tu contrasena"
                      placeholderTextColor={COLORS.muted}
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="ml-3 min-h-[52px] flex-1 text-[15px] font-medium text-text"
                    />
                    <Pressable onPress={() => setShowPassword((current) => !current)} className="ml-2 h-10 w-10 items-center justify-center rounded-[13px]">
                      {showPassword ? <EyeOff size={19} color={COLORS.muted} /> : <Eye size={19} color={COLORS.muted} />}
                    </Pressable>
                  </View>
                  {errors.password ? (
                    <Text style={TYPOGRAPHY.label} className="mt-2 text-danger">
                      {errors.password}
                    </Text>
                  ) : null}
                </View>

                <View className="-mt-1 mb-4 items-end">
                  <Pressable onPress={handleResetPassword} disabled={loading || resetLoading} className="py-1">
                    <Text style={TYPOGRAPHY.labelSemibold} className="text-primary">
                      {resetLoading ? "Enviando recuperacion..." : "Olvide mi contrasena"}
                    </Text>
                  </Pressable>
                </View>

                {errors.general ? (
                  <View className="mb-4 rounded-[15px] border border-danger/20 bg-dangerLight px-4 py-3">
                    <Text style={TYPOGRAPHY.labelSemibold} className="text-danger">
                      {errors.general}
                    </Text>
                  </View>
                ) : null}

                {successMessage ? (
                  <View className="mb-4 rounded-[15px] border border-success/20 bg-successLight px-4 py-3">
                    <Text style={TYPOGRAPHY.labelSemibold} className="text-success">
                      {successMessage}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleLogin}
                  disabled={loading || resetLoading}
                  className="h-[54px] flex-row items-center justify-center rounded-[16px] bg-primary"
                  style={{ opacity: loading || resetLoading ? 0.72 : 1 }}
                >
                  {loading ? <ActivityIndicator color={COLORS.white} /> : null}
                  <Text style={TYPOGRAPHY.button} className={`${loading ? "ml-3" : ""} text-white`}>
                    {loading ? "Entrando..." : "Iniciar sesion"}
                  </Text>
                </Pressable>
              </View>

              <View className="mt-6 flex-row items-center justify-center">
                <Text style={TYPOGRAPHY.body} className="text-muted">
                  No tienes cuenta?
                </Text>
                <Pressable onPress={() => router.push("/register")} className="ml-2 py-2">
                  <Text style={TYPOGRAPHY.bodyMedium} className="text-primary">
                    Crear cuenta
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}
