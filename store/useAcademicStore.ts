import { create } from 'zustand';

interface Subject {
  id: string;
  name: string;
  credits: number;
  status: 'pending' | 'approved' | 'current';
  grade?: number;
}

interface AcademicState {
  creditsEarned: number;
  totalCredits: number;
  streakDays: number;
  level: number;
  xp: number;
  subjects: Subject[];
  notifications: number;
  addXP: (amount: number) => void;
  approveSubject: (id: string, grade: number) => void;
  resetProgress: () => void;
}

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Física I', credits: 4, status: 'pending' },
  { id: '2', name: 'Cálculo II', credits: 4, status: 'current' },
  { id: '3', name: 'Estructura de Datos', credits: 4, status: 'current' },
  { id: '4', name: 'Inglés II', credits: 2, status: 'current' },
];

export const useAcademicStore = create<AcademicState>((set) => ({
  creditsEarned: 45,
  totalCredits: 200,
  streakDays: 14,
  level: 5,
  xp: 2450,
  subjects: INITIAL_SUBJECTS,
  notifications: 3,
  
  addXP: (amount) => set((state) => ({ 
    xp: state.xp + amount,
    level: Math.floor((state.xp + amount) / 1000) + 1
  })),
  
  approveSubject: (id, grade) => set((state) => {
    const updatedSubjects = state.subjects.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' as const, grade } : sub
    );
    const subject = state.subjects.find(s => s.id === id);
    const creditsAdded = subject ? subject.credits : 0;
    
    return {
      subjects: updatedSubjects,
      creditsEarned: state.creditsEarned + creditsAdded,
      xp: state.xp + 500, // Bonus XP for approving a subject
    };
  }),
  
  resetProgress: () => set({
    creditsEarned: 45,
    xp: 2450,
    level: 5,
    subjects: INITIAL_SUBJECTS
  }),
}));
