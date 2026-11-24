import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { subjectStatus } from '@/src/academic/calculations';
import { Subject } from '@/src/academic/model';
import { useAcademicStore } from '@/store/useAcademicStore';
import SubjectNode, { type GraphSubjectStatus } from './SubjectNode';

const NODE_W = 106;
const NODE_H = 58;
export default function CurriculumGraph() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const graphWidth = Math.min(width - 24, 380);
  const laneGap = Math.min(44, Math.max(28, graphWidth - NODE_W * 2 - 34));
  const left = (graphWidth - (NODE_W * 2 + laneGap)) / 2;
  const laneX = [left, left + NODE_W + laneGap];

  const { subjects, rules } = useAcademicStore((state) => state.data);
  const byId = new Map(subjects.map((subject) => [subject.id, subject]));
  const depths = new Map<string, number>();
  function depth(subject: Subject): number {
    const known = depths.get(subject.id);
    if (known !== undefined) return known;
    const level = subject.prerequisites.reduce((highest, id) => {
      const parent = byId.get(id);
      return parent ? Math.max(highest, depth(parent) + 1) : highest;
    }, 0);
    depths.set(subject.id, level);
    return level;
  }

  const levels: Subject[][] = [];
  for (const subject of subjects) {
    const level = depth(subject);
    (levels[level] ??= []).push(subject);
  }
  let row = 0;
  const positioned = levels.flatMap((group) => group.map((subject, index) => {
    const single = group.length % 2 === 1 && index === group.length - 1;
    const px = single ? (graphWidth - NODE_W) / 2 : laneX[index % 2];
    const py = row * 86 + 8;
    if (index % 2 === 1 || single) row++;
    const academicStatus = subjectStatus(subject, rules);
    const blocked = subject.prerequisites.some((id) => {
      const requirement = byId.get(id);
      return requirement && subjectStatus(requirement, rules) !== 'approved';
    });
    const status: GraphSubjectStatus = academicStatus === 'pending' ? (blocked ? 'locked' : 'available') : academicStatus;
    return { ...subject, status, px, py };
  }));
  const graphHeight = row * 86;
  const positionedById = new Map(positioned.map((item) => [item.id, item]));

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

  if (!subjects.length) return <Text className="p-5 text-muted">Agrega materias para construir tu mapa.</Text>;

  return (
    <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
    <View style={[styles.wrap, { width: graphWidth, height: graphHeight }]}>
      <Svg width={graphWidth} height={graphHeight} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <SvgGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C7892" stopOpacity="0.36" />
            <Stop offset="1" stopColor="#6C4DFF" stopOpacity="0.22" />
          </SvgGradient>
        </Defs>
        {positioned.flatMap((subject) =>
          subject.prerequisites.map((prereqId) => {
            const prereq = positionedById.get(prereqId);
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
            onPress={() => router.push({ pathname: '/materia/[id]', params: { id: subject.id } })}
          />
        </View>
      ))}
    </View>
    </ScrollView>
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
