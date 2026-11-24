import { AcademicForm, ConfirmAction, Field, FormButton, FormError, useBack, useSave } from '@/components/academic/AcademicForm';
import { useAcademicStore } from '@/store/useAcademicStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const back = useBack('/(tabs)/cuenta');
  const profile = useAcademicStore((state) => state.data.profile);
  const saveProfile = useAcademicStore((state) => state.saveProfile);
  const reset = useAcademicStore((state) => state.reset);
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const { busy, error, run } = useSave();

  return (
    <AcademicForm title="Configuración" fallback="/(tabs)/cuenta">
      <Field label="Nombre" value={name} onChangeText={setName} autoComplete="name" maxLength={120} />
      <Field label="Correo académico (opcional)" value={email} onChangeText={setEmail}
        inputMode="email" autoCapitalize="none" autoComplete="email" maxLength={254} />
      <FormError error={error} />
      <FormButton label="Guardar perfil" onPress={() => run(() => saveProfile({ name, email }), back)} disabled={busy} />
      <FormButton label="Universidad, carrera y pensum" onPress={() => router.push('/agregar-universidad')} kind="secondary" />
      <Text className="mt-6 text-[13px] text-muted">Tus datos se guardan en este dispositivo. En web, se guardan en este perfil de navegador.</Text>
      <ConfirmAction label="Reiniciar datos demo"
        prompt="Se eliminarán de la demo tu perfil, pensum, períodos, materias y notas."
        busy={busy} onConfirm={() => run(reset, () => router.dismissTo('/(tabs)'))} />
    </AcademicForm>
  );
}
