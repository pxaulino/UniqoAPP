import { AcademicData, DEFAULT_RULES, emptyAcademicData, failure, Result, success } from './model';
import { isRecord, validateAcademicData } from './validation';

export interface AcademicStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export const DATA_KEY = 'uniqo.academic';
export const BACKUP_KEY = 'uniqo.academic.backup';
export const RECOVERY_KEY = 'uniqo.academic.recovery';
const VERSION = 1;

export function serialize(data: AcademicData) {
  return JSON.stringify({ version: VERSION, data });
}

type Decoded =
  | { kind: 'valid'; data: AcademicData; migrated: boolean }
  | { kind: 'corrupt' | 'future' | 'missing' };

function decode(raw: string | null): Decoded {
  if (raw === null) return { kind: 'missing' };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { kind: 'corrupt' };
    if (typeof parsed.version === 'number' && parsed.version > VERSION) return { kind: 'future' };

    const migrated = parsed.version === 0;
    if (parsed.version !== VERSION && !migrated) return { kind: 'corrupt' };
    const data = migrated && isRecord(parsed.data)
      ? {
        ...emptyAcademicData(),
        ...parsed.data,
        ...('rules' in parsed.data && {
          rules: isRecord(parsed.data.rules) ? { ...DEFAULT_RULES, ...parsed.data.rules } : parsed.data.rules,
        }),
        ...(Array.isArray(parsed.data.subjects) && {
          subjects: parsed.data.subjects.map((subject: unknown) => isRecord(subject) ? { prerequisites: [], ...subject } : subject),
        }),
      }
      : parsed.data;
    const result = validateAcademicData(data);
    return result.ok ? { kind: 'valid', data: result.value, migrated } : { kind: 'corrupt' };
  } catch {
    return { kind: 'corrupt' };
  }
}

export async function loadAcademicData(
  storage: AcademicStorage,
): Promise<Result<{ data: AcademicData; recovered: boolean }>> {
  const raw = await storage.getItem(DATA_KEY);
  const primary = decode(raw);
  if (primary.kind === 'future') return failure('Los datos pertenecen a una versión más reciente de UniqoAPP.');
  if (primary.kind === 'valid') {
    if (primary.migrated && raw !== null) {
      await storage.setItem(BACKUP_KEY, raw);
      await storage.setItem(DATA_KEY, serialize(primary.data));
    }
    return success({ data: primary.data, recovered: false });
  }

  const backupRaw = await storage.getItem(BACKUP_KEY);
  const backup = decode(backupRaw);
  if (backup.kind === 'future') return failure('La copia local pertenece a una versión más reciente de UniqoAPP.');
  if (backup.kind === 'valid') {
    if (raw !== null) await storage.setItem(RECOVERY_KEY, raw);
    await storage.setItem(DATA_KEY, serialize(backup.data));
    return success({ data: backup.data, recovered: true });
  }
  if (primary.kind === 'missing' && backup.kind === 'missing') {
    return success({ data: emptyAcademicData(), recovered: false });
  }
  return failure('No se pudo recuperar la copia local. Puedes reintentar o reiniciar la demo.');
}

export async function saveAcademicData(storage: AcademicStorage, data: AcademicData, previous: AcademicData) {
  await storage.setItem(BACKUP_KEY, serialize(previous));
  await storage.setItem(DATA_KEY, serialize(data));
}

export async function resetAcademicData(storage: AcademicStorage, preserveUnreadableData: boolean) {
  const data = emptyAcademicData();
  if (preserveUnreadableData) {
    const primary = await storage.getItem(DATA_KEY);
    const backup = await storage.getItem(BACKUP_KEY);
    if (primary !== null || backup !== null) {
      await storage.setItem(RECOVERY_KEY, JSON.stringify({ primary, backup }));
    }
  }
  await saveAcademicData(storage, data, data);
  return data;
}
