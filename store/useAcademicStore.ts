import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { useStore } from 'zustand';
import { createAcademicStore } from '@/src/academic/academicStore';
import { summarizeAcademicData } from '@/src/academic/calculations';

export const academicStore = createAcademicStore(AsyncStorage);
type AcademicState = ReturnType<typeof academicStore.getState>;

export function useAcademicStore<T>(selector: (state: AcademicState) => T) {
  return useStore(academicStore, selector);
}

export function useAcademicSummary() {
  const data = useAcademicStore((state) => state.data);
  return useMemo(() => summarizeAcademicData(data), [data]);
}
