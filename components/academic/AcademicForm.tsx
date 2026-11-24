import Card from '@/components/ui/Card';
import { COLORS } from '@/constants/mockData';
import { Result } from '@/src/academic/model';
import { Href, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { ReactNode, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TextInputProps, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function useBack(fallback: Href = '/(tabs)') {
  const router = useRouter();
  return () => router.canGoBack() ? router.back() : router.replace(fallback);
}

export function useSave() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function run<T>(operation: () => Promise<Result<T>>, onSuccess?: (value: T) => void) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await operation();
      if (result.ok) onSuccess?.(result.value);
      else setError(result.error);
    } finally {
      running.current = false;
      setBusy(false);
    }
  }
  return { busy, error, run };
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[13px] font-bold text-text">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        className="min-h-12 rounded-2xl bg-bg px-4 py-3 text-[15px] text-text"
        placeholderTextColor={COLORS.muted}
        {...props}
      />
    </View>
  );
}

export function FormButton({ label, onPress, disabled, kind = 'primary' }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  kind?: 'primary' | 'secondary' | 'danger';
}) {
  const background = { primary: 'bg-primary', secondary: 'bg-primaryLight', danger: 'bg-dangerLight' }[kind];
  const color = { primary: 'text-white', secondary: 'text-primary', danger: 'text-danger' }[kind];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`mt-3 items-center rounded-2xl px-3 py-4 ${background} ${disabled ? 'opacity-50' : ''}`}
    >
      <Text className={`text-center text-[14px] font-bold ${color}`}>{label}</Text>
    </Pressable>
  );
}

export function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
      className={`rounded-xl px-3 py-3 ${selected ? 'bg-primary' : 'bg-bg'}`}>
      <Text className={`text-[13px] font-bold ${selected ? 'text-white' : 'text-text'}`}>{label}</Text>
    </Pressable>
  );
}

export function FormError({ error }: { error: string }) {
  return error ? <Text accessibilityRole="alert" className="mt-2 text-[14px] font-semibold text-danger">{error}</Text> : null;
}

export function ConfirmAction({ label, prompt, busy, onConfirm }: {
  label: string;
  prompt: string;
  busy?: boolean;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) return <FormButton label={label} kind="danger" onPress={() => setConfirming(true)} disabled={busy} />;
  return (
    <View className="mt-4">
      <Text className="font-semibold text-text">{prompt}</Text>
      <FormButton label={`Confirmar: ${label.toLowerCase()}`} kind="danger" onPress={onConfirm} disabled={busy} />
      <FormButton label="Cancelar" kind="secondary" onPress={() => setConfirming(false)} disabled={busy} />
    </View>
  );
}

export function AcademicForm({ title, children, fallback }: { title: string; children: ReactNode; fallback?: Href }) {
  const back = useBack(fallback);
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="px-5 pb-10 pt-3">
          <View className="mb-5 flex-row items-center gap-3">
            <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={back}
              className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <ArrowLeft size={22} color={COLORS.text} />
            </Pressable>
            <Text accessibilityRole="header" className="flex-1 text-[20px] font-bold text-text">{title}</Text>
          </View>
          <Card padding={18} radius={22}>{children}</Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
