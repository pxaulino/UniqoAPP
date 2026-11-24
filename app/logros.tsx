import { AcademicForm } from '@/components/academic/AcademicForm';
import { COLORS } from '@/constants/mockData';
import { useAcademicSummary } from '@/store/useAcademicStore';
import { Award, Target, Trophy } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function AchievementsScreen() {
  const { approved, percent } = useAcademicSummary();
  const milestones = [
    { title: 'Primera materia aprobada', complete: approved > 0, Icon: Award },
    { title: 'Mitad del pensum por créditos', complete: percent >= 50, Icon: Target },
    { title: 'Meta de créditos alcanzada', complete: percent === 100, Icon: Trophy },
  ];
  return (
    <AcademicForm title="Logros" fallback="/(tabs)/progreso">
      {milestones.map(({ title, complete, Icon }) => (
        <View key={title} className="mb-4 flex-row items-center gap-3">
          <Icon size={24} color={complete ? COLORS.success : COLORS.muted} />
          <View className="flex-1">
            <Text className="font-bold text-text">{title}</Text>
            <Text className="text-muted">{complete ? 'Logrado' : 'Pendiente'}</Text>
          </View>
        </View>
      ))}
    </AcademicForm>
  );
}
