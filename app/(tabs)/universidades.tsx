import { useAcademicStore, useAcademicSummary } from '@/store/useAcademicStore';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Search, SlidersHorizontal } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, universities } from '@/constants/mockData';
import UniversityCard, { UniversityLogo } from '@/components/UniversityCard';

const filters = ['Todas', 'Santo Domingo', 'Privadas', 'Públicas'];

function MiniProgress({ value }: { value: number }) {
  const size = 46;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <View className="h-[46px] w-[46px] items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E8E3FF" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.primary}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text className="absolute text-[11px] font-bold text-text">{value}%</Text>
    </View>
  );
}

export default function UniversidadesScreen() {
  const [active, setActive] = useState('Todas');
  const [query, setQuery] = useState('');
  const router = useRouter();
  const plan = useAcademicStore((state) => state.data.plan);
  const { percent } = useAcademicSummary();
  const catalogItem = universities.find((item) => [item.name, item.fullName, item.slug].includes(plan?.university ?? ''));

  const filtered = useMemo(
    () =>
      universities.filter((university) => {
        const matchesQuery = `${university.name} ${university.slug}`.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          active === 'Todas' ||
          (active === 'Privadas' && university.type === 'Privada') ||
          (active === 'Públicas' && university.type === 'Publica') ||
          (active === 'Santo Domingo' && university.location.includes('Santo Domingo'));
        return matchesQuery && matchesFilter;
      }),
    [active, query]
  );

  return (
    <Animated.View entering={FadeIn.duration(260)} className="flex-1">
      <SafeAreaView className="flex-1 bg-bg">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-32 pt-2">
        <View className="mb-4 rounded-[18px] bg-[#5B38F5] p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-white">Mis Universidades</Text>
            <View className="rounded-xl bg-white/16 px-3 py-1.5">
              <Text className="text-[13px] font-semibold text-white">{plan ? 1 : 0} activas</Text>
            </View>
          </View>

          {plan ? (
            <Pressable accessibilityRole="button" onPress={() => router.push('/agregar-universidad')} className="mb-2 flex-row items-center gap-3 rounded-[16px] bg-white px-3 py-2.5">
              <UniversityLogo color={catalogItem?.color ?? COLORS.primary} text={plan.university.slice(0, 2)} logo={catalogItem?.logo} size={44} />
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-text">{plan.university}</Text>
                <Text className="mt-0.5 text-[13px] font-medium text-muted">{plan.career}</Text>
              </View>
              <MiniProgress value={percent} />
            </Pressable>
          ) : <Text className="mb-3 text-white">Agrega la universidad donde estudias.</Text>}

          <Pressable
            onPress={() => router.push('/agregar-universidad')}
            className="mt-1 flex-row items-center justify-center gap-2 rounded-[15px] border border-dashed border-white/55 bg-white py-3"
          >
            <Plus size={18} color={COLORS.primary} />
            <Text className="text-[14px] font-semibold text-primary">Agregar universidad</Text>
          </Pressable>
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[17px] font-bold text-text">Explorar Universidades</Text>
          <Text className="text-[13px] font-semibold text-primary">Ver todas</Text>
        </View>

        <View
          className="mb-3 flex-row items-center rounded-[13px] bg-white px-3"
          style={{
            height: 46,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 3,
          }}
        >
          <Search size={17} color={COLORS.text} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar universidad..."
            placeholderTextColor={COLORS.muted}
            className="ml-3 flex-1 text-[14px] font-medium text-text"
          />
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-bg">
            <SlidersHorizontal size={15} color={COLORS.text} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          <View className="flex-row gap-2">
            {filters.map((filter) => {
              const selected = active === filter;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActive(filter)}
                  className={`rounded-[10px] px-4 py-2.5 ${selected ? 'bg-[#5B38F5]' : 'bg-white'}`}
                >
                  <Text className={`text-[13px] font-semibold ${selected ? 'text-white' : 'text-muted'}`}>{filter}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Text className="mb-3 text-[13px] font-medium text-muted">{filtered.length * 4 + 4} universidades encontradas</Text>
        {filtered.map((university, index) => (
          <UniversityCard key={university.id} {...university} delay={index * 35} compact />
        ))}
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}
