import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Sparkles, Bot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS } from '@/constants/mockData';
import { TYPOGRAPHY } from '@/constants/typography';
import AppFrame from '@/components/ui/AppFrame';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const SUGGESTIONS = [
  "¿Qué pasa si retiro Física I?",
  "¿Cuál es mi ruta más rápida para graduarme?",
  "Recomiéndame materias fáciles"
];

export default function AsistenteAcademicoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente académico. He analizado tu progreso y veo que estás a 14 créditos de subir de nivel. ¿En qué te puedo ayudar hoy?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newUserMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    
    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Esa es una excelente pregunta. Basado en tu pensum, retirar Física I te retrasará un cuatrimestre porque es prerrequisito de 3 materias. Te sugiero tomar tutorías en su lugar.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <AppFrame>
      <View 
        style={{ 
          paddingTop: insets.top + 10,
          shadowColor: COLORS.primary, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3
        }} 
        className="flex-row items-center px-6 pb-4 bg-white rounded-b-[32px] z-10"
      >
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
        >
          <ArrowLeft size={20} color={COLORS.text} />
        </Pressable>
        <View className="ml-4 flex-row items-center">
          <LinearGradient
            colors={['#8B5CF6', '#6C4DFF']}
            className="h-10 w-10 items-center justify-center rounded-full mr-3"
          >
            <Bot size={20} color="#FFF" />
          </LinearGradient>
          <View>
            <Text style={TYPOGRAPHY.cardTitle} className="text-text">Asistente Uniqo</Text>
            <Text style={TYPOGRAPHY.label} className="text-[#10B981]">En línea</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <Animated.View 
                key={msg.id}
                entering={FadeInUp.delay(isUser ? 0 : 300).springify().damping(18)}
                className={`mb-4 max-w-[80%] rounded-[24px] p-4 ${isUser ? 'self-end bg-white border border-gray-100' : 'self-start'}`}
                style={!isUser ? { shadowColor: COLORS.primary, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, backgroundColor: '#FFF' } : {}}
              >
                {!isUser && (
                  <LinearGradient
                    colors={['rgba(139,92,246,0.05)', 'rgba(108,77,255,0.05)']}
                    style={{ position: 'absolute', inset: 0, borderRadius: 24 }}
                  />
                )}
                <Text style={TYPOGRAPHY.body} className={isUser ? 'text-text' : 'text-[#4F46E5] leading-6'}>
                  {msg.text}
                </Text>
              </Animated.View>
            );
          })}
          
          {messages.length === 1 && (
            <Animated.View entering={FadeInDown.delay(600).springify()} className="mt-8">
              <Text style={TYPOGRAPHY.labelSemibold} className="text-muted mb-4 ml-2">Sugerencias para ti</Text>
              {SUGGESTIONS.map((suggestion, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => sendMessage(suggestion)}
                  className="mb-3 flex-row items-center rounded-2xl bg-white p-4 border border-gray-100"
                >
                  <Sparkles size={16} color="#EC4899" className="mr-3" />
                  <Text style={TYPOGRAPHY.bodyMedium} className="text-text flex-1">{suggestion}</Text>
                </Pressable>
              ))}
            </Animated.View>
          )}
        </ScrollView>

        <View 
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
          className="bg-white/80 px-6 pt-4 backdrop-blur-xl border-t border-gray-100"
        >
          <View className="flex-row items-center rounded-[28px] bg-[#F8F7FF] px-2 py-2 border border-gray-200">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Pregúntame lo que sea..."
              placeholderTextColor={COLORS.muted}
              style={[TYPOGRAPHY.body, { flex: 1, paddingHorizontal: 16, height: 44 }]}
              multiline
            />
            <Pressable 
              onPress={() => sendMessage(inputText)}
              className="h-11 w-11 items-center justify-center rounded-full bg-[#6C4DFF]"
              style={{ opacity: inputText.trim() ? 1 : 0.5 }}
            >
              <Send size={18} color="#FFF" style={{ marginLeft: 2 }} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppFrame>
  );
}
