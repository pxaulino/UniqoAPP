import React from 'react';
import { Platform, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function WebStatusBar() {
  if (Platform.OS !== 'web') return null;

  return (
    <View
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 47,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 34,
      }}
    >
      <Text style={{ color: '#111018', fontSize: 16, fontWeight: '700' }}>10:01</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
          {[8, 11, 14, 17].map((height, index) => (
            <View
              key={height}
              style={{
                width: 3,
                height,
                borderRadius: 2,
                backgroundColor: index < 3 ? '#111018' : 'rgba(17,16,24,0.35)',
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <View
            style={{
              width: 20,
              height: 14,
              borderWidth: 2,
              borderColor: '#111018',
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 11, height: 6, borderRadius: 2, backgroundColor: '#111018' }} />
          </View>
          <View style={{ width: 2, height: 6, borderRadius: 1, backgroundColor: '#111018' }} />
        </View>
        <View
          style={{
            minWidth: 28,
            height: 18,
            borderRadius: 8,
            backgroundColor: '#111018',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12, lineHeight: 14, fontWeight: '700' }}>72</Text>
        </View>
      </View>
    </View>
  );
}

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const contentStyle =
    Platform.OS === 'web'
      ? {
          flex: 1,
          width: '100%' as const,
          maxWidth: 393,
          minHeight: 852,
          paddingTop: 47,
          paddingBottom: 34,
          backgroundColor: 'transparent',
        }
      : {
          flex: 1,
          width: '100%' as const,
          backgroundColor: 'transparent',
        };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F7FF', '#F4F0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, alignItems: 'center' }}
    >
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          top: 58,
          right: -44,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: 'rgba(108,77,255,0.06)',
        }}
      />
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          bottom: 120,
          left: -36,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: 'rgba(59,130,246,0.045)',
        }}
      />
      <View style={contentStyle}>
        <WebStatusBar />
        {children}
      </View>
    </LinearGradient>
  );
}
