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
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { COLORS } from "@/constants/mockData";
import { TYPOGRAPHY } from "@/constants/typography";
import { platformShadow } from "@/utils/platformStyles";
import { registerUser } from "@/src/services/authService";

const initialForm = {
  nombre: "",
  apellido: "",
  correo: "",
  password: "",
  confirmPassword: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form) {
  const errors = {};
  const correo = form.correo.trim();

  if (!form.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!correo) {
    errors.correo = "El correo es obligatorio.";
  } else if (!emailRegex.test(correo)) {
    errors.correo = "El correo no tiene un formato valido.";
  }

  if (form.password.length < 6) {
    errors.password = "La contrasena debe tener al menos 6 caracteres.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Las contrasenas no coinciden.";
  }

  return errors;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  icon,
  autoCapitalize = "none",
  keyboardType = "default",
  secureTextEntry,
  rightAction,
  textContentType,
}) {
  return (
    <View className="mb-4">
      <Text style={TYPOGRAPHY.labelSemibold} className="mb-2 text-text">
        {label}
      </Text>
      <View
        className={`min-h-[54px] flex-row items-center rounded-[16px] border bg-white px-4 ${
          error ? "border-danger" : "border-[#ECE8FF]"
        }`}
        style={{
          ...platformShadow({
            color: COLORS.primary,
            offset: { width: 0, height: 8 },
            opacity: 0.045,
            radius: 18,
            elevation: 2,
          }),
        }}
      >
        <View className="mr-3 h-9 w-9 items-center justify-center rounded-[12px] bg-primaryLight">
          {icon}
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
          autoCorrect={false}
          className="min-h-[52px] flex-1 text-[15px] font-medium text-text"
        />
        {rightAction}
      </View>
      {error ? (
        <Text style={TYPOGRAPHY.label} className="mt-2 text-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = React.useState(initialForm);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const setValue = (key) => (value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, general: undefined }));
  };

  const handleRegister = async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await registerUser({
        nombre: form.nombre,
        apellido: form.apellido,
        correo: form.correo,
        password: form.password,
      });

      router.replace("/agregar-universidad");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "No pudimos crear tu cuenta. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(240)} className="flex-1 bg-white">
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="px-5 pb-10 pt-8"
          >
            <View className="mb-7 flex-row items-center justify-center">
              <Text style={TYPOGRAPHY.labelSemibold} className="text-muted">
                Uniqo
              </Text>
            </View>

            <Animated.View entering={FadeInDown.duration(380).springify().damping(18)}>
              <View className="mb-7">
                <LinearGradient colors={["#F4F0FF", "#FFFFFF"]} className="mb-5 h-16 w-16 items-center justify-center rounded-[22px]">
                  <View className="h-10 w-10 items-center justify-center rounded-[15px] bg-primary">
                    <UserRound size={21} color={COLORS.white} strokeWidth={2.2} />
                  </View>
                </LinearGradient>
                <Text style={TYPOGRAPHY.screenTitle} className="text-text">
                  Crea tu cuenta
                </Text>
                <Text style={TYPOGRAPHY.body} className="mt-2 max-w-[310px] text-muted">
                  Empieza a organizar tu pensum, progreso y ruta academica desde un solo lugar.
                </Text>
              </View>

              <View
                className="rounded-[24px] border border-[#EEEAFB] bg-[#FBFAFF] p-4"
                style={{
                  ...platformShadow({
                    color: COLORS.primary,
                    offset: { width: 0, height: 14 },
                    opacity: 0.06,
                    radius: 28,
                    elevation: 4,
                  }),
                }}
              >
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Field
                      label="Nombre"
                      value={form.nombre}
                      onChangeText={setValue("nombre")}
                      placeholder="Daniel"
                      error={errors.nombre}
                      autoCapitalize="words"
                      textContentType="givenName"
                      icon={<UserRound size={18} color={COLORS.primary} />}
                    />
                  </View>
                  <View className="flex-1">
                    <Field
                      label="Apellido"
                      value={form.apellido}
                      onChangeText={setValue("apellido")}
                      placeholder="Perez"
                      autoCapitalize="words"
                      textContentType="familyName"
                      icon={<UserRound size={18} color={COLORS.primary} />}
                    />
                  </View>
                </View>

                <Field
                  label="Correo"
                  value={form.correo}
                  onChangeText={setValue("correo")}
                  placeholder="tu@correo.com"
                  error={errors.correo}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  icon={<Mail size={18} color={COLORS.primary} />}
                />

                <Field
                  label="Contrasena"
                  value={form.password}
                  onChangeText={setValue("password")}
                  placeholder="Minimo 6 caracteres"
                  error={errors.password}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  icon={<LockKeyhole size={18} color={COLORS.primary} />}
                  rightAction={
                    <Pressable onPress={() => setShowPassword((current) => !current)} className="ml-2 h-10 w-10 items-center justify-center rounded-[13px]">
                      {showPassword ? <EyeOff size={19} color={COLORS.muted} /> : <Eye size={19} color={COLORS.muted} />}
                    </Pressable>
                  }
                />

                <Field
                  label="Confirmar contrasena"
                  value={form.confirmPassword}
                  onChangeText={setValue("confirmPassword")}
                  placeholder="Repite tu contrasena"
                  error={errors.confirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  textContentType="newPassword"
                  icon={<LockKeyhole size={18} color={COLORS.primary} />}
                  rightAction={
                    <Pressable onPress={() => setShowConfirmPassword((current) => !current)} className="ml-2 h-10 w-10 items-center justify-center rounded-[13px]">
                      {showConfirmPassword ? <EyeOff size={19} color={COLORS.muted} /> : <Eye size={19} color={COLORS.muted} />}
                    </Pressable>
                  }
                />

                {errors.general ? (
                  <View className="mb-4 rounded-[15px] border border-danger/20 bg-dangerLight px-4 py-3">
                    <Text style={TYPOGRAPHY.labelSemibold} className="text-danger">
                      {errors.general}
                    </Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleRegister}
                  disabled={loading}
                  className="mt-1 h-[54px] flex-row items-center justify-center rounded-[16px] bg-primary"
                  style={{
                    opacity: loading ? 0.72 : 1,
                    ...platformShadow({
                      color: COLORS.primary,
                      offset: { width: 0, height: 12 },
                      opacity: 0.2,
                      radius: 20,
                      elevation: 8,
                    }),
                  }}
                >
                  {loading ? <ActivityIndicator color={COLORS.white} /> : null}
                  <Text style={TYPOGRAPHY.button} className={`${loading ? "ml-3" : ""} text-white`}>
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </Text>
                </Pressable>
              </View>

              <View className="mt-6 flex-row items-center justify-center">
                <Text style={TYPOGRAPHY.body} className="text-muted">
                  Ya tienes cuenta?
                </Text>
                <Pressable onPress={() => router.replace("/login")} className="ml-2 py-2">
                  <Text style={TYPOGRAPHY.bodyMedium} className="text-primary">
                    Iniciar sesion
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
