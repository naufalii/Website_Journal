import { Goal, ScheduleItem, Course, Note, VaultItem, BackupData } from './types';
import {
  STORAGE_KEYS,
  getLocalItem,
  setLocalItem,
  getAllVaultFiles,
  saveFileToVault,
  blobToBase64,
  base64ToBlob,
  isBrowser,
} from './storage';

export async function exportAllData(): Promise<void> {
  if (!isBrowser) return;

  const goals = getLocalItem<Goal[]>(STORAGE_KEYS.GOALS, []);
  const schedules = getLocalItem<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, []);
  const courses = getLocalItem<Course[]>(STORAGE_KEYS.COURSES, []);
  const notes = getLocalItem<Note[]>(STORAGE_KEYS.NOTES, []);
  const vault = getLocalItem<VaultItem[]>(STORAGE_KEYS.VAULT, []);

  // Fetch all stored files in IndexedDB and convert to base64
  const storedFiles = await getAllVaultFiles();
  const vaultFiles: Record<string, { name: string; type: string; base64: string }> = {};

  for (const [fileId, fileRecord] of Object.entries(storedFiles)) {
    try {
      if (fileRecord.data instanceof Blob) {
        const base64 = await blobToBase64(fileRecord.data);
        vaultFiles[fileId] = {
          name: fileRecord.name,
          type: fileRecord.type,
          base64,
        };
      }
    } catch (e) {
      console.warn(`Failed to export file ${fileId}:`, e);
    }
  }

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    goals,
    schedules,
    courses,
    notes,
    vault,
    vaultFiles,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `workspace_backup_${timestamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function importDataFromFile(file: File): Promise<{
  success: boolean;
  message: string;
  data?: BackupData;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as BackupData;

        // Basic schema verification
        if (!parsed || typeof parsed !== 'object') {
          return resolve({ success: false, message: 'Format file JSON tidak valid.' });
        }

        const goals = Array.isArray(parsed.goals) ? parsed.goals : [];
        const schedules = Array.isArray(parsed.schedules) ? parsed.schedules : [];
        const courses = Array.isArray(parsed.courses) ? parsed.courses : [];
        const notes = Array.isArray(parsed.notes) ? parsed.notes : [];
        const vault = Array.isArray(parsed.vault) ? parsed.vault : [];

        // Save text data to LocalStorage
        setLocalItem(STORAGE_KEYS.GOALS, goals);
        setLocalItem(STORAGE_KEYS.SCHEDULES, schedules);
        setLocalItem(STORAGE_KEYS.COURSES, courses);
        setLocalItem(STORAGE_KEYS.NOTES, notes);
        setLocalItem(STORAGE_KEYS.VAULT, vault);

        // Restore IndexedDB files if present
        if (parsed.vaultFiles && typeof parsed.vaultFiles === 'object') {
          for (const [fileId, fileInfo] of Object.entries(parsed.vaultFiles)) {
            try {
              if (fileInfo.base64) {
                const blob = base64ToBlob(fileInfo.base64, fileInfo.type);
                const fileObj = new File([blob], fileInfo.name, { type: fileInfo.type });
                await saveFileToVault(fileId, fileObj);
              }
            } catch (fileErr) {
              console.warn(`Error restoring file ${fileId}:`, fileErr);
            }
          }
        }

        resolve({
          success: true,
          message: 'Data berhasil dipulihkan (restore) sepenuhnya.',
          data: parsed,
        });
      } catch (err) {
        console.error('Import parse error:', err);
        resolve({
          success: false,
          message: 'Gagal memproses file backup. Pastikan file JSON valid.',
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: 'Gagal membaca file dari disk.' });
    };

    reader.readAsText(file);
  });
}
