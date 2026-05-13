import type { LucideIcon } from 'lucide-react-native';
import {
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  Map,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';

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

export type SubjectStatus = 'approved' | 'available' | 'in_progress' | 'locked';
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
  pensums: number;
  students: string;
  satisfaction: number;
  activeProgress?: number;
  color: string;
  logoText: string;
  logo: UniversityLogoKey | null;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  status: SubjectStatus;
  semester: number;
  prerequisites: string[];
  description: string;
  x: number;
  y: number;
}

export type AcademicRecordStatus = 'approved' | 'pending' | 'in_progress';

export interface AcademicRecord {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  status: AcademicRecordStatus;
}

export const myUniversities = [
  { id: 'intec', name: 'INTEC', career: 'Ingenieria de Software', progress: 62, color: '#EF3340', logo: 'intec' as const },
  { id: 'uasd', name: 'UASD', career: 'Ingenieria de Sistemas', progress: 35, color: '#284AA8', logo: 'uasd' as const },
];

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
    pensums: 12,
    students: '1.2k',
    satisfaction: 95,
    activeProgress: 62,
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
    pensums: 24,
    students: '3.0k',
    satisfaction: 84,
    activeProgress: 35,
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
    pensums: 15,
    students: '2.1k',
    satisfaction: 91,
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
    pensums: 18,
    students: '1.7k',
    satisfaction: 88,
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
    pensums: 14,
    students: '1.1k',
    satisfaction: 90,
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
    pensums: 9,
    students: '890',
    satisfaction: 83,
    color: '#4A54B8',
    logoText: 'AP',
    logo: 'apec',
  },
];

export const pensums = [
  { id: 'software', name: 'Ingenieria de Software', plan: 'Plan: 2018 - 10 cuatrimestres', credits: 200, semesters: 10, year: '2018', progress: 62, color: COLORS.primary },
  { id: 'industrial', name: 'Ingenieria Industrial', plan: 'Plan: 2018 - 10 cuatrimestres', credits: 198, semesters: 10, year: '2018', progress: 40, color: COLORS.secondary },
  { id: 'civil', name: 'Ingenieria Civil', plan: 'Plan: 2018 - 10 cuatrimestres', credits: 210, semesters: 10, year: '2018', progress: 20, color: COLORS.warning },
  { id: 'admin', name: 'Administracion de Empresas', plan: 'Plan: 2018 - 10 cuatrimestres', credits: 190, semesters: 10, year: '2018', progress: 15, color: COLORS.danger },
];

export const subjects: Subject[] = [
  { id: 'mat101', code: 'MAT-101', name: 'Matematica Basica', credits: 4, status: 'approved', semester: 1, prerequisites: [], description: 'Fundamentos algebraicos, funciones, trigonometria y bases de calculo para carreras de ingenieria.', x: 1.6, y: 0 },
  { id: 'cal101', code: 'MAT-201', name: 'Calculo I', credits: 4, status: 'approved', semester: 2, prerequisites: ['mat101'], description: 'Limites, derivadas, integrales y aplicaciones a modelos reales.', x: 0.4, y: 1.35 },
  { id: 'log101', code: 'MAT-220', name: 'Logica Matematica', credits: 3, status: 'available', semester: 2, prerequisites: ['mat101'], description: 'Proposiciones, conjuntos, induccion y razonamiento formal.', x: 2.8, y: 1.35 },
  { id: 'cal201', code: 'MAT-301', name: 'Calculo II', credits: 4, status: 'available', semester: 3, prerequisites: ['cal101'], description: 'Series, metodos de integracion, ecuaciones diferenciales y calculo multivariable inicial.', x: 0.4, y: 2.75 },
  { id: 'pro101', code: 'INF-101', name: 'Programacion I', credits: 4, status: 'in_progress', semester: 2, prerequisites: ['mat101'], description: 'Algoritmos, estructuras basicas y programacion orientada a problemas.', x: 2.8, y: 2.75 },
  { id: 'eda201', code: 'INF-201', name: 'Estructura de Datos', credits: 4, status: 'available', semester: 4, prerequisites: ['pro101', 'log101'], description: 'Listas, pilas, colas, arboles y grafos con implementaciones eficientes.', x: 1.6, y: 4.15 },
  { id: 'fis101', code: 'FIS-101', name: 'Fisica I', credits: 4, status: 'locked', semester: 3, prerequisites: ['cal101'], description: 'Mecanica clasica, fuerzas, energia y sistemas fisicos.', x: 4.0, y: 4.15 },
  { id: 'alg301', code: 'INF-310', name: 'Algoritmos', credits: 4, status: 'locked', semester: 5, prerequisites: ['eda201'], description: 'Analisis de complejidad, estrategias de diseno y optimizacion.', x: 0.4, y: 5.55 },
  { id: 'bdd301', code: 'INF-320', name: 'Bases de Datos', credits: 4, status: 'locked', semester: 5, prerequisites: ['eda201'], description: 'Modelo relacional, SQL, normalizacion y diseno de bases de datos.', x: 2.8, y: 5.55 },
  { id: 'ia401', code: 'INF-410', name: 'Inteligencia Artificial', credits: 4, status: 'locked', semester: 7, prerequisites: ['alg301', 'bdd301'], description: 'Busqueda, agentes inteligentes y fundamentos de aprendizaje automatico.', x: 1.6, y: 6.95 },
];

export const academicRecords: AcademicRecord[] = [
  { id: 'apr-1', name: 'Matematica Basica', code: 'MAT-101', credits: 4, semester: 1, status: 'approved' },
  { id: 'apr-2', name: 'Introduccion a la Programacion', code: 'INF-100', credits: 4, semester: 1, status: 'approved' },
  { id: 'apr-3', name: 'Ingles I', code: 'ING-101', credits: 2, semester: 1, status: 'approved' },
  { id: 'apr-4', name: 'Orientacion Universitaria', code: 'ORI-100', credits: 1, semester: 1, status: 'approved' },
  { id: 'apr-5', name: 'Calculo I', code: 'MAT-201', credits: 4, semester: 2, status: 'approved' },
  { id: 'apr-6', name: 'Logica Matematica', code: 'MAT-220', credits: 3, semester: 2, status: 'approved' },
  { id: 'apr-7', name: 'Programacion I', code: 'INF-101', credits: 4, semester: 2, status: 'approved' },
  { id: 'apr-8', name: 'Ingles II', code: 'ING-102', credits: 2, semester: 2, status: 'approved' },
  { id: 'apr-9', name: 'Calculo II', code: 'MAT-301', credits: 4, semester: 3, status: 'approved' },
  { id: 'apr-10', name: 'Programacion II', code: 'INF-202', credits: 4, semester: 3, status: 'approved' },
  { id: 'apr-11', name: 'Fisica I', code: 'FIS-101', credits: 4, semester: 3, status: 'approved' },
  { id: 'apr-12', name: 'Redaccion Tecnica', code: 'ESP-201', credits: 3, semester: 3, status: 'approved' },
  { id: 'apr-13', name: 'Estructura de Datos', code: 'INF-201', credits: 4, semester: 4, status: 'approved' },
  { id: 'apr-14', name: 'Base de Datos I', code: 'INF-320', credits: 4, semester: 4, status: 'approved' },
  { id: 'apr-15', name: 'Estadistica I', code: 'MAT-330', credits: 3, semester: 4, status: 'approved' },
  { id: 'apr-16', name: 'Fisica II', code: 'FIS-201', credits: 4, semester: 4, status: 'approved' },
  { id: 'apr-17', name: 'Algoritmos', code: 'INF-310', credits: 4, semester: 5, status: 'approved' },
  { id: 'apr-18', name: 'Ingenieria de Software I', code: 'SOF-301', credits: 4, semester: 5, status: 'approved' },
  { id: 'apr-19', name: 'Sistemas Operativos', code: 'INF-330', credits: 4, semester: 5, status: 'approved' },
  { id: 'apr-20', name: 'Metodos Numericos', code: 'MAT-340', credits: 3, semester: 5, status: 'approved' },
  { id: 'apr-21', name: 'Arquitectura de Computadoras', code: 'INF-340', credits: 4, semester: 6, status: 'approved' },
  { id: 'apr-22', name: 'Base de Datos II', code: 'INF-421', credits: 4, semester: 6, status: 'approved' },
  { id: 'apr-23', name: 'Desarrollo Web I', code: 'SOF-330', credits: 4, semester: 6, status: 'approved' },
  { id: 'apr-24', name: 'Gestion de Proyectos', code: 'ADM-300', credits: 3, semester: 6, status: 'approved' },
  { id: 'apr-25', name: 'Desarrollo Movil', code: 'SOF-410', credits: 4, semester: 7, status: 'approved' },
  { id: 'apr-26', name: 'Inteligencia Artificial', code: 'INF-410', credits: 4, semester: 7, status: 'approved' },
  { id: 'apr-27', name: 'Calidad de Software', code: 'SOF-420', credits: 3, semester: 7, status: 'approved' },
  { id: 'apr-28', name: 'Etica Profesional', code: 'SOC-310', credits: 2, semester: 7, status: 'approved' },
  { id: 'cur-1', name: 'Estructura de Datos', code: 'INF-201', credits: 4, semester: 8, status: 'in_progress' },
  { id: 'cur-2', name: 'Ingles II', code: 'IDI-202', credits: 2, semester: 8, status: 'in_progress' },
  { id: 'cur-3', name: 'Proyecto Integrador I', code: 'SOF-490', credits: 4, semester: 8, status: 'in_progress' },
  { id: 'cur-4', name: 'Seguridad Informatica', code: 'INF-430', credits: 4, semester: 8, status: 'in_progress' },
  { id: 'cur-5', name: 'Emprendimiento', code: 'ADM-410', credits: 2, semester: 8, status: 'in_progress' },
  { id: 'pen-1', name: 'Compiladores', code: 'INF-440', credits: 4, semester: 8, status: 'pending' },
  { id: 'pen-2', name: 'Arquitectura Empresarial', code: 'SOF-430', credits: 3, semester: 8, status: 'pending' },
  { id: 'pen-3', name: 'Investigacion Aplicada', code: 'INV-400', credits: 3, semester: 8, status: 'pending' },
  { id: 'pen-4', name: 'Proyecto Integrador II', code: 'SOF-491', credits: 4, semester: 9, status: 'pending' },
  { id: 'pen-5', name: 'DevOps y Cloud', code: 'SOF-450', credits: 4, semester: 9, status: 'pending' },
  { id: 'pen-6', name: 'Analitica de Datos', code: 'INF-450', credits: 4, semester: 9, status: 'pending' },
  { id: 'pen-7', name: 'Electiva Profesional I', code: 'ELP-401', credits: 3, semester: 9, status: 'pending' },
  { id: 'pen-8', name: 'Practica Profesional', code: 'PRA-400', credits: 4, semester: 10, status: 'pending' },
  { id: 'pen-9', name: 'Trabajo de Grado', code: 'TG-500', credits: 6, semester: 10, status: 'pending' },
  { id: 'pen-10', name: 'Auditoria de Sistemas', code: 'INF-470', credits: 3, semester: 10, status: 'pending' },
  { id: 'pen-11', name: 'Electiva Profesional II', code: 'ELP-402', credits: 3, semester: 10, status: 'pending' },
  { id: 'pen-12', name: 'Seminario de Software', code: 'SOF-500', credits: 2, semester: 10, status: 'pending' },
];

export const quickActions: { id: string; label: string; icon: LucideIcon; color: string; bg: string; route: string }[] = [
  { id: 'mapa', label: 'Mapa', icon: Map, color: COLORS.primary, bg: COLORS.primaryLight, route: '/(tabs)/mapa' },
  { id: 'planner', label: 'Mis estudios', icon: CalendarDays, color: COLORS.danger, bg: COLORS.dangerLight, route: '/(tabs)/planner' },
  { id: 'simulador', label: 'Simulador', icon: FlaskConical, color: COLORS.secondary, bg: COLORS.blueLight, route: '/(tabs)/simulador' },
  { id: 'progress', label: 'Mi Progreso', icon: TrendingUp, color: COLORS.success, bg: COLORS.successLight, route: '/(tabs)/progreso' },
];

export const nextClass = {
  subject: 'Estructura de Datos',
  code: 'INF-201',
  time: '2:00 PM',
  day: 'Hoy',
  room: 'Aula B-204',
};

export const notifications = [
  {
    id: 'n1',
    title: 'Clase en 30 minutos',
    message: 'Estructura de Datos inicia a las 2:00 PM en el Aula B-204.',
    time: 'Ahora',
    unread: true,
    type: 'class',
    color: COLORS.primary,
    bg: COLORS.primaryLight,
  },
  {
    id: 'n2',
    title: 'Materia desbloqueada',
    message: 'Ya puedes agregar Bases de Datos a tu plan academico.',
    time: '12 min',
    unread: true,
    type: 'unlock',
    color: COLORS.success,
    bg: COLORS.successLight,
  },
  {
    id: 'n3',
    title: 'Simulacion lista',
    message: 'Tu escenario de retiro fue recalculado con 3 materias afectadas.',
    time: '1 h',
    unread: false,
    type: 'simulation',
    color: COLORS.warning,
    bg: COLORS.warningLight,
  },
  {
    id: 'n4',
    title: 'Progreso actualizado',
    message: 'Completaste 124 de 200 creditos. Vas a buen ritmo.',
    time: 'Ayer',
    unread: false,
    type: 'progress',
    color: COLORS.secondary,
    bg: COLORS.blueLight,
  },
];

export const plannerSemesters = [
  {
    id: 'q1',
    name: 'Cuatrimestre 1',
    credits: 16,
    maxCredits: 20,
    subjects: [
      { id: 'eda201', name: 'Estructura de Datos', credits: 4, status: 'available' as SubjectStatus, code: 'INF-201' },
      { id: 'cal201', name: 'Calculo II', credits: 4, status: 'approved' as SubjectStatus, code: 'MAT-301' },
      { id: 'ing201', name: 'Ingles II', credits: 2, status: 'in_progress' as SubjectStatus, code: 'IDI-202' },
      { id: 'fis101', name: 'Fisica I', credits: 4, status: 'available' as SubjectStatus, code: 'FIS-101' },
    ],
  },
  {
    id: 'q2',
    name: 'Cuatrimestre 2',
    credits: 12,
    maxCredits: 20,
    subjects: [
      { id: 'bdd301', name: 'Bases de Datos', credits: 4, status: 'locked' as SubjectStatus, code: 'INF-320' },
      { id: 'alg301', name: 'Algoritmos', credits: 4, status: 'locked' as SubjectStatus, code: 'INF-310' },
      { id: 'pro201', name: 'Programacion II', credits: 4, status: 'available' as SubjectStatus, code: 'INF-202' },
    ],
  },
  { id: 'q3', name: 'Cuatrimestre 3', credits: 0, maxCredits: 20, subjects: [] },
];

export const simulatorSubjects = [
  { id: 'cal201', name: 'Calculo II', code: 'MAT-301', credits: 4 },
  { id: 'eda201', name: 'Estructura de Datos', code: 'INF-201', credits: 4 },
  { id: 'fis101', name: 'Fisica I', code: 'FIS-101', credits: 4 },
];

export const simulationImpactBySubject = {
  cal201: {
    estimate: 'Dic 2027',
    delay: '+1 cuatrimestre',
    creditsDelayed: 12,
    risk: 'Medio',
    confidence: 86,
    affected: [
      { name: 'Fisica I', code: 'FIS-101', reason: 'requiere Calculo II para inscripcion', credits: 4, severity: 'Alta' },
      { name: 'Estructura de Datos', code: 'INF-201', reason: 'mueve tu bloque tecnico al proximo periodo', credits: 4, severity: 'Media' },
      { name: 'Bases de Datos', code: 'INF-320', reason: 'depende del orden recomendado del pensum', credits: 4, severity: 'Media' },
    ],
    recommendation: 'Si necesitas retirar Calculo II, agrega una materia electiva de baja dependencia para mantener 12 creditos activos.',
  },
  eda201: {
    estimate: 'Abr 2027',
    delay: '+1 periodo',
    creditsDelayed: 16,
    risk: 'Alto',
    confidence: 91,
    affected: [
      { name: 'Algoritmos', code: 'INF-310', reason: 'prerrequisito directo bloqueado', credits: 4, severity: 'Alta' },
      { name: 'Bases de Datos', code: 'INF-320', reason: 'ruta tecnica se desplaza un periodo', credits: 4, severity: 'Alta' },
      { name: 'Inteligencia Artificial', code: 'INF-410', reason: 'impacto acumulado en materias avanzadas', credits: 4, severity: 'Media' },
      { name: 'Proyecto Integrador', code: 'SOF-390', reason: 'reduce carga disponible del bloque profesional', credits: 4, severity: 'Media' },
    ],
    recommendation: 'Prioriza Estructura de Datos este periodo. Es una materia nodo para desbloquear tu ruta tecnica.',
  },
  fis101: {
    estimate: 'Dic 2026',
    delay: 'sin retraso mayor',
    creditsDelayed: 4,
    risk: 'Bajo',
    confidence: 78,
    affected: [
      { name: 'Fisica II', code: 'FIS-201', reason: 'se mueve al siguiente ciclo disponible', credits: 4, severity: 'Media' },
    ],
    recommendation: 'Puedes retirar Fisica I si mantienes una materia tecnica disponible en tu plan actual.',
  },
} as const;

export const validationSubjects = [
  { code: 'MAT-101', name: 'Calculo I', credits: 4, ok: true },
  { code: 'INF-101', name: 'Programacion I', credits: 3, ok: true },
  { code: 'FIS-101', name: 'Fisica I', credits: 4, ok: false },
];

export const progressData = {
  percent: 62,
  creditsApproved: 124,
  totalCredits: 200,
  gpa: 3.7,
  streak: 12,
  subjectsApproved: 28,
  graduationDate: 'Dic 2026',
};

export const addUniversitySteps = [
  { title: 'Informacion de la universidad', subtitle: 'Agrega los datos basicos', icon: Building2, color: COLORS.primary, bg: COLORS.primaryLight },
  { title: 'Subir pensum', subtitle: 'PDF, imagen o archivo', icon: BookOpen, color: COLORS.secondary, bg: COLORS.blueLight },
  { title: 'Validacion automatica', subtitle: 'Extraemos materias y requisitos', icon: Sparkles, color: COLORS.warning, bg: COLORS.warningLight },
  { title: 'Listo', subtitle: 'Comienza a planificar tu camino', icon: CheckCircle2, color: COLORS.success, bg: COLORS.successLight },
];

export const simulationTypes = [
  { id: 'retirar', label: 'Retirar materia', icon: FlaskConical },
  { id: 'reprobar', label: 'Reprobar materia', icon: BookOpen },
  { id: 'orden', label: 'Cambiar orden', icon: CalendarDays },
];
