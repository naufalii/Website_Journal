import { get, set, del, keys } from 'idb-keyval';
import { Goal, ScheduleItem, Course, Note, VaultItem } from './types';

export const STORAGE_KEYS = {
  GOALS: 'pw_goals_v1',
  SCHEDULES: 'pw_schedules_v1',
  COURSES: 'pw_courses_v1',
  NOTES: 'pw_notes_v1',
  VAULT: 'pw_vault_v1',
  THEME: 'pw_theme_v1',
} as const;

// Safe LocalStorage helpers (SSR Hydration Guard)
export const isBrowser = typeof window !== 'undefined';

export function getLocalItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function setLocalItem<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function removeLocalItem(key: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// -------------------------------------------------------------
// IndexedDB File Storage (For Vault Local Files)
// -------------------------------------------------------------

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: Blob | ArrayBuffer | string;
  updatedAt: string;
}

export async function saveFileToVault(fileId: string, file: File): Promise<void> {
  if (!isBrowser) return;
  try {
    const fileRecord: StoredFile = {
      id: fileId,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      data: file,
      updatedAt: new Date().toISOString(),
    };
    await set(`vault_file_${fileId}`, fileRecord);
  } catch (err) {
    console.error('Failed to save file to IndexedDB:', err);
    throw err;
  }
}

export async function getFileFromVault(fileId: string): Promise<StoredFile | null> {
  if (!isBrowser) return null;
  try {
    const fileRecord = await get<StoredFile>(`vault_file_${fileId}`);
    return fileRecord || null;
  } catch (err) {
    console.error('Failed to read file from IndexedDB:', err);
    return null;
  }
}

export async function deleteFileFromVault(fileId: string): Promise<void> {
  if (!isBrowser) return;
  try {
    await del(`vault_file_${fileId}`);
  } catch (err) {
    console.error('Failed to delete file from IndexedDB:', err);
  }
}

export async function getAllVaultFiles(): Promise<Record<string, StoredFile>> {
  if (!isBrowser) return {};
  try {
    const allKeys = await keys();
    const vaultKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('vault_file_'));
    const result: Record<string, StoredFile> = {};
    for (const key of vaultKeys) {
      const record = await get<StoredFile>(key);
      if (record) {
        result[record.id] = record;
      }
    }
    return result;
  } catch (err) {
    console.error('Failed to get all files from IndexedDB:', err);
    return {};
  }
}

// Convert Blob/File to Base64 (for full JSON backup)
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      resolve(res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert Base64 data URL to Blob (for restore)
export function base64ToBlob(base64: string, contentType: string = ''): Blob {
  const parts = base64.split(';base64,');
  const actualContentType = parts.length > 1 ? parts[0].split(':')[1] : contentType;
  const raw = window.atob(parts[1] || parts[0]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: actualContentType });
}
