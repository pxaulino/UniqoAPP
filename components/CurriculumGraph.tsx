import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { subjects } from '@/constants/mockData';
import SubjectNode from './SubjectNode';

const NODE_W = 106;
const NODE_H = 58;
const GRAPH_H = 610;

const layout: Record<string, { x: number; y: number }> = {
  mat101: { x: 0.5, y: 0 },
  cal101: { x: 0, y: 86 },
  log101: { x: 1, y: 86 },
  cal201: { x: 0, y: 172 },
  pro101: { x: 1, y: 172 },
  eda201: { x: 0, y: 268 },
  fis101: { x: 1, y: 268 },
  alg301: { x: 0, y: 364 },
  bdd301: { x: 1, y: 364 },
  ia401: { x: 0.5, y: 468 },
};

function getDisplayName(name: string) {
  if (name === 'Matematica Basica') return 'Matematica Basica';
  if (name === 'Logica Matematica') return 'Logica Matematica';
  if (name === 'Estructura de Datos') return 'Estructura de Datos';
  if (name === 'Inteligencia Artificial') return 'Inteligencia Artificial';
  return name;
}

export default function CurriculumGraph() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const graphWidth = Math.min(width - 24, 380);
  const laneGap = Math.min(44, Math.max(28, graphWidth - NODE_W * 2 - 34));
  const left = (graphWidth - (NODE_W * 2 + laneGap)) / 2;
  const laneX = [left, left + NODE_W + laneGap];

  const positioned = subjects.map((subject) => {
    const point = layout[subject.id] ?? { x: 0, y: 0 };
    const centeredX = point.x === 0.5 ? (graphWidth - NODE_W) / 2 : laneX[point.x];
    return {
      ...subject,
      name: getDisplayName(subject.name),
      px: centeredX,
      py: point.y + 8,
    };
  });

  function center(subject: (typeof positioned)[number]) {
    return { x: subject.px + NODE_W / 2, y: subject.py + NODE_H / 2 };
  }

  function curvePath(from: (typeof positioned)[number], to: (typeof positioned)[number]) {
    const a = center(from);
    const b = center(to);
    const startY = a.y + NODE_H / 2 - 4;
    const endY = b.y - NODE_H / 2 + 4;
    const midY = startY + (endY - startY) * 0.58;
    return `M ${a.x} ${startY} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${endY}`;
  }

  return (
    <View style={[styles.wrap, { width: graphWidth, height: GRAPH_H }]}>
      <Svg width={graphWidth} height={GRAPH_H} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <SvgGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C7892" stopOpacity="0.36" />
            <Stop offset="1" stopColor="#6C4DFF" stopOpacity="0.22" />
          </SvgGradient>
        </Defs>
        {positioned.flatMap((subject) =>
          subject.prerequisites.map((prereqId) => {
            const prereq = positioned.find((item) => item.id === prereqId);
            if (!prereq) return null;
            return (
              <Path
                key={`${prereqId}-${subject.id}`}
                d={curvePath(prereq, subject)}
                stroke="url(#edge)"
                strokeWidth={1.4}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={subject.status === 'locked' ? '5 6' : undefined}
              />
            );
          })
        )}
      </Svg>

      {positioned.map((subject) => (
        <View key={subject.id} style={[styles.node, { left: subject.px, top: subject.py }]}>
          <SubjectNode
            id={subject.id}
            code={subject.code}
            name={subject.name}
            credits={subject.credits}
            status={subject.status}
            width={NODE_W}
            height={NODE_H}
            onPress={() => router.push(`/materia/${subject.id}` as never)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  node: {
    position: 'absolute',
  },
});
