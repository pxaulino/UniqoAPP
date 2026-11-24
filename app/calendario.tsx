import { FormError, useBack } from '@/components/academic/AcademicForm';
import { ClassMeeting, meetingMinutes } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  DownloadCloud,
  MoreVertical,
  Plus,
  Trash2,
  UploadCloud,
  AlertTriangle,
  Users,
  Video,
  X,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Dimensions, Modal, PanResponder, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const COLORS_BY_INDEX = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF476F', '#14B8A6'];
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_CLOSE_DURATION = 220;
const TIME_OPTIONS = [
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
];

type ScheduleMode = 'Presencial' | 'Virtual';

type SelectedSubject = {
  id: string;
  name: string;
  code: string;
  credits: number;
};

type ScheduleItem = SelectedSubject & {
  day: number;
  startTime: string;
  endTime: string;
  mode: ScheduleMode;
  color: string;
};

export default function CalendarioScreen() {
  const back = useBack('/(tabs)/planner');
  const { subjects, meetings } = useAcademicStore((state) => state.data);
  const saveMeeting = useAcademicStore((state) => state.saveMeeting);
  const removeMeeting = useAcademicStore((state) => state.removeMeeting);
  const insets = useSafeAreaInsets();
  const [activeDay, setActiveDay] = useState(1);
  const schedule = useMemo(() => meetings.flatMap((meeting, index) => {
    const subject = subjects.find(({ id }) => id === meeting.subjectId);
    return subject ? [{ ...subject, ...meeting, color: COLORS_BY_INDEX[index % COLORS_BY_INDEX.length] }] : [];
  }), [meetings, subjects]);
  const selectedSubjects = subjects.filter(({ enrollment }) => enrollment !== 'withdrawn');
  const feedbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editing, setEditing] = useState<ScheduleItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ScheduleItem | null>(null);
  const [timePickerField, setTimePickerField] = useState<'startTime' | 'endTime' | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [feedback, setFeedback] = useState('');
  const editTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const addTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditClosing = React.useRef(false);
  const isAddClosing = React.useRef(false);
  const addScrolledToTop = React.useRef(true);
  const editOverlayOpacity = useSharedValue(0);
  const editTranslateY = useSharedValue(SCREEN_HEIGHT);
  const addOverlayOpacity = useSharedValue(0);
  const addTranslateY = useSharedValue(SCREEN_HEIGHT);

  const dayEvents = schedule.filter((event) => event.day === activeDay).sort((a, b) => meetingMinutes(a.startTime) - meetingMinutes(b.startTime));
  const scheduledIds = useMemo(() => new Set(schedule.map((item) => item.id)), [schedule]);
  const availableSubjects = selectedSubjects.filter((subject) => !scheduledIds.has(subject.id));
  const isEditOpen = editing !== null;

  React.useEffect(() => {
    if (isEditOpen) {
      isEditClosing.current = false;
      if (editTimer.current) clearTimeout(editTimer.current);
      editOverlayOpacity.set(withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) }));
      editTranslateY.set(withSpring(0, { damping: 30, stiffness: 260, mass: 0.9 }));
    }
  }, [isEditOpen, editOverlayOpacity, editTranslateY]);

  React.useEffect(() => {
    if (isAddOpen) {
      isAddClosing.current = false;
      if (addTimer.current) clearTimeout(addTimer.current);
      addOverlayOpacity.set(withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) }));
      addTranslateY.set(withSpring(0, { damping: 30, stiffness: 260, mass: 0.9 }));
    }
  }, [addOverlayOpacity, addTranslateY, isAddOpen]);

  React.useEffect(() => {
    return () => {
      if (editTimer.current) clearTimeout(editTimer.current);
      if (addTimer.current) clearTimeout(addTimer.current);
    };
  }, []);

  React.useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  const editBackdropStyle = useAnimatedStyle(() => ({ opacity: editOverlayOpacity.value }));
  const editSheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: editTranslateY.value }] }));
  const addBackdropStyle = useAnimatedStyle(() => ({ opacity: addOverlayOpacity.value }));
  const addSheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: addTranslateY.value }] }));

  const showFeedback = (message: string) => {
    setFeedback(message);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), 3500);
  };

  const closeEditSheet = React.useCallback(
    (afterClose?: () => void) => {
      if (isEditClosing.current) return;
      isEditClosing.current = true;
      editOverlayOpacity.set(withTiming(0, { duration: SHEET_CLOSE_DURATION, easing: Easing.out(Easing.cubic) }));
      editTranslateY.set(withTiming(SCREEN_HEIGHT, { duration: SHEET_CLOSE_DURATION, easing: Easing.out(Easing.cubic) }));
      editTimer.current = setTimeout(() => {
        editTimer.current = null;
        setConfirmDelete(null);
        setTimePickerField(null);
        setEditing(null);
        editTranslateY.set(SCREEN_HEIGHT);
        afterClose?.();
      }, SHEET_CLOSE_DURATION);
    },
    [editOverlayOpacity, editTranslateY]
  );

  const closeAddSheet = React.useCallback(
    (afterClose?: () => void) => {
      if (isAddClosing.current) return;
      isAddClosing.current = true;
      addOverlayOpacity.set(withTiming(0, { duration: SHEET_CLOSE_DURATION, easing: Easing.out(Easing.cubic) }));
      addTranslateY.set(withTiming(SCREEN_HEIGHT, { duration: SHEET_CLOSE_DURATION, easing: Easing.out(Easing.cubic) }));
      addTimer.current = setTimeout(() => {
        addTimer.current = null;
        setIsAddOpen(false);
        addTranslateY.set(SCREEN_HEIGHT);
        afterClose?.();
      }, SHEET_CLOSE_DURATION);
    },
    [addOverlayOpacity, addTranslateY]
  );

  const editPanResponder = React.useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- PanResponder registers handlers that read refs only during gestures.
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const isMostlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.35;
          return isMostlyVertical && gestureState.dy > 10 && !timePickerField;
        },
        onStartShouldSetPanResponder: (e) => e.nativeEvent.locationY < 132,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) editTranslateY.set(Math.min(gestureState.dy, SCREEN_HEIGHT * 0.55));
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldClose = gestureState.dy > 135 || (gestureState.dy > 64 && gestureState.vy > 1.05);
          if (shouldClose) {
            closeEditSheet();
            return;
          }
          editTranslateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
        onPanResponderTerminate: () => {
          editTranslateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
      }),
    [closeEditSheet, editTranslateY, timePickerField]
  );

  const addPanResponder = React.useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs -- PanResponder registers handlers that read refs only during gestures.
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const isMostlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.35;
          return isMostlyVertical && gestureState.dy > 10 && addScrolledToTop.current;
        },
        onStartShouldSetPanResponder: (e) => e.nativeEvent.locationY < 132,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) addTranslateY.set(Math.min(gestureState.dy, SCREEN_HEIGHT * 0.55));
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldClose = gestureState.dy > 135 || (gestureState.dy > 64 && gestureState.vy > 1.05);
          if (shouldClose) {
            closeAddSheet();
            return;
          }
          addTranslateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
        onPanResponderTerminate: () => {
          addTranslateY.set(withSpring(0, { damping: 28, stiffness: 260 }));
        },
      }),
    [addTranslateY, closeAddSheet]
  );

  const updateEditing = (patch: Partial<ScheduleItem>) => {
    if (!editing) return;
    setScheduleError('');
    setEditing({ ...editing, ...patch });
  };

  const applyMeeting = async ({ id, day, startTime, endTime, mode }: Omit<ClassMeeting, 'subjectId'> & { id: string }) => {
    const result = await saveMeeting({ subjectId: id, day, startTime, endTime, mode });
    return result.ok ? '' : result.error;
  };

  const saveEditing = async () => {
    if (!editing) return;
    const error = await applyMeeting(editing);
    if (error) { setScheduleError(error); return; }
    closeEditSheet(() => showFeedback('Materia actualizada en el horario'));
  };

  const requestDelete = () => {
    if (!editing) return;
    setConfirmDelete(editing);
  };

  const confirmRemove = async () => {
    if (!confirmDelete) return;
    const result = await removeMeeting(confirmDelete.id);
    if (!result.ok) { showFeedback(result.error); return; }
    closeEditSheet(() => showFeedback('Materia eliminada del horario'));
  };

  const closeEditModal = () => {
    if (confirmDelete) {
      setConfirmDelete(null);
      return;
    }

    if (timePickerField) {
      setTimePickerField(null);
      return;
    }

    closeEditSheet();
  };

  const addSubject = (subject: SelectedSubject) => {
    if (scheduledIds.has(subject.id)) return;
    setScheduleError('');
    closeAddSheet(() => setEditing({
      ...subject, day: activeDay, startTime: '08:00 AM', endTime: '10:00 AM',
      mode: 'Presencial', color: COLORS_BY_INDEX[schedule.length % COLORS_BY_INDEX.length],
    }));
  };

  const exportSchedule = async () => {
    if (!schedule.length) { showFeedback('Agrega una materia al horario antes de exportar.'); return; }
    const message = schedule.map((item) =>
      DAYS[item.day - 1] + ' · ' + item.startTime + ' a ' + item.endTime + ' · ' + item.name + ' (' + item.mode + ')',
    ).join('\n');
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) await navigator.share({ text: message });
        else {
          await navigator.clipboard.writeText(message);
          showFeedback('Horario copiado');
        }
      } else {
        await Share.share({ message });
      }
    } catch {
      showFeedback('No se pudo compartir el horario.');
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <View style={{ paddingTop: insets.top + 10 }} className="rounded-b-[34px] bg-white px-6 pb-5">
        <View className="mb-5 flex-row items-center justify-between">
          <Pressable
            onPress={back} accessibilityRole="button" accessibilityLabel="Volver"
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-50"
          >
            <ArrowLeft size={20} color={COLORS.text} />
          </Pressable>
          <View className="items-center">
            <Text style={TYPOGRAPHY.sectionTitle} className="text-text">Horario</Text>
            <Text style={TYPOGRAPHY.label} className="mt-1 text-muted">Conectado a Mis estudios</Text>
          </View>
          <Pressable
            onPress={() => setIsAddOpen(true)}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <Plus size={20} color={COLORS.white} />
          </Pressable>
        </View>

        <View className="mb-5 flex-row gap-3">
          <Pressable onPress={() => setIsAddOpen(true)} className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-bg py-3">
            <UploadCloud size={17} color={COLORS.primary} />
            <Text className="text-[13px] font-bold text-primary">Agregar materia</Text>
          </Pressable>
          <Pressable onPress={exportSchedule} className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-bg py-3">
            <DownloadCloud size={17} color={COLORS.primary} />
            <Text className="text-[13px] font-bold text-primary">Compartir</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-between">
          {DAYS.map((day, idx) => {
            const dayNumber = idx + 1;
            const isActive = dayNumber === activeDay;
            const count = schedule.filter((event) => event.day === dayNumber).length;

            return (
              <Pressable
                key={day}
                onPress={() => setActiveDay(dayNumber)}
                className={`h-16 w-12 items-center justify-center rounded-2xl ${isActive ? 'bg-primary' : 'bg-transparent'}`}
              >
                <Text style={[TYPOGRAPHY.labelSemibold, { color: isActive ? COLORS.white : COLORS.muted, marginBottom: 4 }]}>
                  {day}
                </Text>
                <Text style={[TYPOGRAPHY.cardTitle, { color: isActive ? COLORS.white : COLORS.text }]}>{count}</Text>
                {count > 0 ? (
                  <View className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {feedback ? (
        <View className="mx-6 mt-4 rounded-2xl bg-[#151326] px-4 py-3">
          <Text className="text-center text-[13px] font-bold text-white">{feedback}</Text>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} className="mt-6 px-6">
        <Text style={TYPOGRAPHY.cardTitle} className="mb-4 text-[11px] uppercase tracking-widest text-muted">Agenda del dia</Text>

        {dayEvents.length === 0 ? (
          <View className="items-center justify-center rounded-[24px] bg-white px-5 py-10">
            <CalendarDays size={40} color={COLORS.muted} />
            <Text style={TYPOGRAPHY.body} className="mt-4 text-muted">No tienes materias este dia</Text>
          </View>
        ) : (
          dayEvents.map((event) => {
            const ModeIcon = event.mode === 'Virtual' ? Video : Users;

            return (
              <View
                key={event.id}
                className="mb-4 rounded-[22px] bg-white p-5"
                style={{
                  shadowColor: COLORS.primary,
                  shadowOpacity: 0.055,
                  shadowRadius: 18,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(108,77,255,0.06)',
                }}
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center gap-2">
                      <View style={{ backgroundColor: event.color }} className="h-2.5 w-2.5 rounded-full" />
                      <Text className="text-[12px] font-bold text-muted">{event.code}</Text>
                    </View>
                    <Text style={TYPOGRAPHY.cardTitle} className="mb-2 text-[18px] text-text">{event.name}</Text>
                    <View className="flex-row items-center">
                      <Clock size={14} color={COLORS.muted} />
                      <Text style={TYPOGRAPHY.label} className="ml-1.5 text-muted">
                        {event.startTime} - {event.endTime}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => { setScheduleError(''); setEditing(event); }} className="h-9 w-9 items-center justify-center rounded-full bg-bg">
                    <MoreVertical size={18} color={COLORS.muted} />
                  </Pressable>
                </View>

                <View style={{ backgroundColor: `${event.color}14` }} className="mt-4 flex-row items-center self-start rounded-full px-3 py-1.5">
                  <ModeIcon size={13} color={event.color} />
                  <Text style={{ color: event.color }} className="ml-1.5 text-[12px] font-bold">{event.mode}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal transparent visible={isEditOpen} animationType="none" statusBarTranslucent onRequestClose={closeEditModal}>
        <View className="flex-1 justify-end">
          <Pressable className="absolute inset-0" onPress={closeEditModal}>
            <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(17,16,24,0.34)' }, editBackdropStyle]} />
          </Pressable>
          <Animated.View
            {...editPanResponder.panHandlers}
            className="rounded-t-[30px] bg-white px-6 pb-7 pt-4"
            style={[
              editSheetStyle,
              {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: -12 },
                shadowOpacity: 0.12,
                shadowRadius: 28,
                elevation: 18,
              },
            ]}
          >
            <View className="mb-5 items-center">
              <View className="h-1.5 w-16 rounded-full bg-line" />
            </View>
            {timePickerField && editing ? (
              <>
                <View className="mb-5 flex-row items-start justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-[22px] font-bold text-text">
                      {timePickerField === 'startTime' ? 'Hora de inicio' : 'Hora de fin'}
                    </Text>
                    <Text className="mt-1 text-[14px] font-semibold text-muted">
                      Selecciona una hora para {editing.name}
                    </Text>
                  </View>
                  <Pressable onPress={() => setTimePickerField(null)} className="h-10 w-10 items-center justify-center rounded-full bg-bg">
                    <X size={20} color={COLORS.text} />
                  </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 390 }}>
                  <View className="flex-row flex-wrap justify-between">
                    {TIME_OPTIONS.map((time) => {
                      const selected = editing[timePickerField] === time;
                      return (
                        <Pressable
                          key={time}
                          onPress={() => {
                            updateEditing({ [timePickerField]: time });
                            setTimePickerField(null);
                          }}
                          className={`mb-3 h-12 w-[48%] items-center justify-center rounded-2xl ${selected ? 'bg-primary' : 'bg-bg'}`}
                        >
                          <Text className={`text-[14px] font-bold ${selected ? 'text-white' : 'text-text'}`}>{time}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            ) : confirmDelete ? (
              <>
                <View className="mb-5 flex-row items-start gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-dangerLight">
                    <AlertTriangle size={23} color={COLORS.danger} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[22px] font-bold text-text">Eliminar del horario</Text>
                    <Text className="mt-1 text-[14px] font-semibold leading-5 text-muted">
                      Esta materia saldra de tu horario local. Puedes agregarla otra vez desde tus materias seleccionadas.
                    </Text>
                  </View>
                </View>

                <View
                  className="mb-6 rounded-[20px] bg-bg px-4 py-4"
                  style={{ borderWidth: 1, borderColor: 'rgba(108,77,255,0.06)' }}
                >
                  <View className="mb-2 flex-row items-center gap-2">
                    <View style={{ backgroundColor: confirmDelete.color }} className="h-2.5 w-2.5 rounded-full" />
                    <Text className="text-[12px] font-bold text-muted">{confirmDelete.code}</Text>
                  </View>
                  <Text className="text-[16px] font-bold text-text">{confirmDelete.name}</Text>
                  <Text className="mt-1 text-[13px] font-semibold text-muted">
                    {confirmDelete.startTime} - {confirmDelete.endTime} - {confirmDelete.mode}
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <Pressable onPress={() => setConfirmDelete(null)} className="flex-1 items-center rounded-2xl bg-bg py-4">
                    <Text className="text-[14px] font-bold text-muted">Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={confirmRemove} className="flex-1 items-center rounded-2xl bg-danger py-4">
                    <Text className="text-[14px] font-bold text-white">Eliminar</Text>
                  </Pressable>
                </View>
              </>
            ) : editing ? (
              <>
                <View className="mb-5 flex-row items-start justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-[22px] font-bold text-text">Horario de materia</Text>
                    <Text className="mt-1 text-[14px] font-semibold text-muted">{editing.name}</Text>
                  </View>
                  <Pressable onPress={() => closeEditSheet()} className="h-10 w-10 items-center justify-center rounded-full bg-bg">
                    <X size={20} color={COLORS.text} />
                  </Pressable>
                </View>

                <View className="mb-4 flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-[12px] font-bold text-muted">Inicio</Text>
                    <Pressable
                      onPress={() => setTimePickerField('startTime')}
                      className="flex-row items-center justify-between rounded-2xl bg-bg px-4 py-3"
                    >
                      <Text className="text-[14px] font-bold text-text">{editing.startTime}</Text>
                      <Clock size={16} color={COLORS.muted} />
                    </Pressable>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-[12px] font-bold text-muted">Fin</Text>
                    <Pressable
                      onPress={() => setTimePickerField('endTime')}
                      className="flex-row items-center justify-between rounded-2xl bg-bg px-4 py-3"
                    >
                      <Text className="text-[14px] font-bold text-text">{editing.endTime}</Text>
                      <Clock size={16} color={COLORS.muted} />
                    </Pressable>
                  </View>
                </View>

                <Text className="mb-2 text-[12px] font-bold text-muted">Modalidad</Text>
                <View className="mb-5 flex-row gap-3">
                  {(['Presencial', 'Virtual'] as ScheduleMode[]).map((mode) => {
                    const selected = editing.mode === mode;
                    const Icon = mode === 'Virtual' ? Video : Users;
                    return (
                      <Pressable
                        key={mode}
                        onPress={() => updateEditing({ mode })}
                        className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3 ${selected ? 'bg-primary' : 'bg-bg'}`}
                      >
                        <Icon size={17} color={selected ? COLORS.white : COLORS.muted} />
                        <Text className={`text-[13px] font-bold ${selected ? 'text-white' : 'text-muted'}`}>{mode}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text className="mb-2 text-[12px] font-bold text-muted">Día</Text>
                <View className="mb-6 flex-row gap-1">
                  {DAYS.map((day, idx) => {
                    const dayNumber = idx + 1;
                    const selected = editing.day === dayNumber;
                    return (
                      <Pressable
                        key={day}
                        onPress={() => updateEditing({ day: dayNumber })}
                        className={`h-11 flex-1 items-center justify-center rounded-2xl ${selected ? 'bg-primary' : 'bg-bg'}`}
                      >
                        <Text className={`text-[12px] font-bold ${selected ? 'text-white' : 'text-muted'}`}>{day}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                <FormError error={scheduleError} />
                <View className="mt-3 flex-row gap-3">
                  <Pressable accessibilityLabel="Eliminar del horario" accessibilityRole="button" disabled={!scheduledIds.has(editing.id)} onPress={requestDelete} className="h-14 w-14 items-center justify-center rounded-2xl bg-dangerLight">
                    <Trash2 size={20} color={COLORS.danger} />
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={saveEditing} className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-primary">
                    <Check size={20} color={COLORS.white} />
                    <Text className="text-[15px] font-bold text-white">Guardar cambios</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </Animated.View>
        </View>
      </Modal>

      <Modal transparent visible={isAddOpen} animationType="none" statusBarTranslucent onRequestClose={() => closeAddSheet()}>
        <View className="flex-1 justify-end">
          <Pressable className="absolute inset-0" onPress={() => closeAddSheet()}>
            <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(17,16,24,0.34)' }, addBackdropStyle]} />
          </Pressable>
          <Animated.View
            {...addPanResponder.panHandlers}
            className="max-h-[76%] rounded-t-[30px] bg-white px-6 pb-7 pt-4"
            style={[
              addSheetStyle,
              {
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: -12 },
                shadowOpacity: 0.12,
                shadowRadius: 28,
                elevation: 18,
              },
            ]}
          >
            <View className="mb-5 items-center">
              <View className="h-1.5 w-16 rounded-full bg-line" />
            </View>
            <View className="mb-5 flex-row items-start justify-between">
              <View>
                <Text className="text-[22px] font-bold text-text">Agregar materia</Text>
                <Text className="mt-1 text-[14px] font-semibold text-muted">Desde tus materias seleccionadas</Text>
              </View>
              <Pressable onPress={() => closeAddSheet()} className="h-10 w-10 items-center justify-center rounded-full bg-bg">
                <X size={20} color={COLORS.text} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={(e) => {
                addScrolledToTop.current = e.nativeEvent.contentOffset.y <= 0;
              }}
            >
              {availableSubjects.length === 0 ? (
                <View className="items-center rounded-[22px] bg-bg px-5 py-8">
                  <Check size={32} color={COLORS.success} />
                  <Text className="mt-3 text-center text-[14px] font-bold text-text">Todas las materias seleccionadas ya estan en tu horario</Text>
                </View>
              ) : (
                availableSubjects.map((subject) => (
                  <Pressable
                    key={subject.id}
                    onPress={() => addSubject(subject)}
                    className="mb-3 flex-row items-center gap-3 rounded-[18px] bg-bg px-4 py-4"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                      <Plus size={18} color={COLORS.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[14px] font-bold text-text">{subject.name}</Text>
                      <Text className="mt-0.5 text-[12px] font-semibold text-muted">
                        {subject.code} - {subject.credits} creditos
                      </Text>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
