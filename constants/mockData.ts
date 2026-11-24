export const COLORS = {
  bg: '#F8F7FF',
  primary: '#6C4DFF',
  secondary: '#3B82F6',
  blue: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF476F',
  text: '#151326',
  muted: '#7C7892',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#EBE8FF',
  line: '#DDD8F6',
  lavender: '#F0EDFF',
  primaryLight: '#EDE9FF',
  blueLight: '#EAF2FF',
  successLight: '#E8FAF0',
  warningLight: '#FFF6DB',
  dangerLight: '#FFE8EF',
  lockedLight: '#F2F1F8',
  shadow: '#6C4DFF',
} as const;

export const gradients = {
  primary: ['#7A5CFF', '#5B47F6', '#3B82F6'] as const,
  soft: ['#FFFFFF', '#F3F0FF'] as const,
  success: ['#35D48A', '#22C55E'] as const,
  warning: ['#FFBF45', '#F59E0B'] as const,
  danger: ['#FF6B91', '#EF476F'] as const,
  glass: ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.7)'] as const,
};

export type UniversityLogoKey = 'intec' | 'uasd' | 'apec';

export interface University {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  location: string;
  website: string;
  type: 'Privada' | 'Publica';
  founded: string;
  color: string;
  logoText: string;
  logo: UniversityLogoKey | null;
}

export const universities: University[] = [
  {
    id: 'intec',
    slug: 'INTEC',
    name: 'Instituto Tecnologico de Santo Domingo',
    fullName: 'Instituto Tecnologico de Santo Domingo (INTEC)',
    location: 'Santo Domingo, DN',
    website: 'intec.edu.do',
    type: 'Privada',
    founded: 'Fundada en 1972',
    color: '#EF3340',
    logoText: 'intec',
    logo: 'intec',
  },
  {
    id: 'uasd',
    slug: 'UASD',
    name: 'Universidad Autonoma de Santo Domingo',
    fullName: 'Universidad Autonoma de Santo Domingo (UASD)',
    location: 'Santo Domingo, DN',
    website: 'uasd.edu.do',
    type: 'Publica',
    founded: 'Fundada en 1538',
    color: '#284AA8',
    logoText: 'UASD',
    logo: 'uasd',
  },
  {
    id: 'pucmm',
    slug: 'PUCMM',
    name: 'Pontificia Universidad Catolica Madre y Maestra',
    fullName: 'Pontificia Universidad Catolica Madre y Maestra (PUCMM)',
    location: 'Santiago, RD',
    website: 'pucmm.edu.do',
    type: 'Privada',
    founded: 'Fundada en 1962',
    color: '#E33C55',
    logoText: 'PU',
    logo: null,
  },
  {
    id: 'unphu',
    slug: 'UNPHU',
    name: 'Universidad Nacional Pedro Henriquez Urena',
    fullName: 'Universidad Nacional Pedro Henriquez Urena (UNPHU)',
    location: 'Santo Domingo, DN',
    website: 'unphu.edu.do',
    type: 'Privada',
    founded: 'Fundada en 1966',
    color: '#2FA86A',
    logoText: 'UP',
    logo: null,
  },
  {
    id: 'unibe',
    slug: 'UNIBE',
    name: 'Universidad Iberoamericana',
    fullName: 'Universidad Iberoamericana (UNIBE)',
    location: 'Santo Domingo, DN',
    website: 'unibe.edu.do',
    type: 'Privada',
    founded: 'Fundada en 1982',
    color: '#2478D4',
    logoText: 'UN',
    logo: null,
  },
  {
    id: 'unapec',
    slug: 'UNAPEC',
    name: 'Universidad APEC',
    fullName: 'Universidad APEC (UNAPEC)',
    location: 'Santo Domingo, DN',
    website: 'unapec.edu.do',
    type: 'Privada',
    founded: 'Fundada en 1965',
    color: '#4A54B8',
    logoText: 'AP',
    logo: 'apec',
  },
];
