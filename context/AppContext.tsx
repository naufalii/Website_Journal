'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Goal,
  ScheduleItem,
  Course,
  Note,
  VaultItem,
  ToastMessage,
  ToastType,
  BackupData,
} from '@/lib/types';
import {
  STORAGE_KEYS,
  getLocalItem,
  setLocalItem,
  deleteFileFromVault,
  saveFileToVault,
} from '@/lib/storage';
import { exportAllData, importDataFromFile } from '@/lib/backup';
import { generateId, getLocalDateString } from '@/lib/utils';

interface AppContextType {
  isMounted: boolean;
  
  // Data
  goals: Goal[];
  schedules: ScheduleItem[];
  courses: Course[];
  notes: Note[];
  vault: VaultItem[];
  
  // Goals Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completedDates'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalDate: (id: string, dateStr?: string) => void;
  
  // Schedule Actions
  addSchedule: (item: Omit<ScheduleItem, 'id' | 'createdAt' | 'completed'>) => void;
  updateSchedule: (id: string, item: Partial<ScheduleItem>) => void;
  deleteSchedule: (id: string) => void;
  toggleScheduleComplete: (id: string) => void;
  
  // Course Actions
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  updateCourseProgress: (id: string, completed: number) => void;
  
  // Notes Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  
  // Vault Actions
  addVaultLink: (item: Omit<VaultItem, 'id' | 'type' | 'createdAt'>) => void;
  addVaultFile: (item: Omit<VaultItem, 'id' | 'type' | 'createdAt'>, file: File) => Promise<void>;
  deleteVaultItem: (id: string) => Promise<void>;
  
  // Backup & Reset Actions
  reloadAllData: () => void;
  clearAllData: () => void;
  handleExport: () => Promise<void>;
  handleImport: (file: File) => Promise<boolean>;
  
  // Quick Action Modal
  isQuickActionOpen: boolean;
  quickActionTab: 'goal' | 'schedule' | 'course' | 'note' | 'vault';
  openQuickAction: (tab?: 'goal' | 'schedule' | 'course' | 'note' | 'vault') => void;
  closeQuickAction: () => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionTab, setQuickActionTab] = useState<'goal' | 'schedule' | 'course' | 'note' | 'vault'>('goal');

  // Load persistent state safely on client mount
  const loadState = useCallback(() => {
    setGoals(getLocalItem<Goal[]>(STORAGE_KEYS.GOALS, []));
    setSchedules(getLocalItem<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, []));
    setCourses(getLocalItem<Course[]>(STORAGE_KEYS.COURSES, []));
    setNotes(getLocalItem<Note[]>(STORAGE_KEYS.NOTES, []));
    setVault(getLocalItem<VaultItem[]>(STORAGE_KEYS.VAULT, []));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadState();
  }, [loadState]);

  // Toast helper
  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Quick Action Controls
  const openQuickAction = useCallback((tab: 'goal' | 'schedule' | 'course' | 'note' | 'vault' = 'goal') => {
    setQuickActionTab(tab);
    setIsQuickActionOpen(true);
  }, []);

  const closeQuickAction = useCallback(() => {
    setIsQuickActionOpen(false);
  }, []);

  // -------------------------------------------------------------
  // Goals Handlers
  // -------------------------------------------------------------
  const addGoal = useCallback((newGoalData: Omit<Goal, 'id' | 'createdAt' | 'completedDates'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: generateId(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => {
      const updated = [newGoal, ...prev];
      setLocalItem(STORAGE_KEYS.GOALS, updated);
      return updated;
    });
    showToast('Goal Berhasil Ditambahkan', `"${newGoal.title}" siap dicapai.`);
  }, [showToast]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...updates } : g));
      setLocalItem(STORAGE_KEYS.GOALS, updated);
      return updated;
    });
    showToast('Goal Diperbarui', 'Perubahan target berhasil disimpan.');
  }, [showToast]);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      setLocalItem(STORAGE_KEYS.GOALS, updated);
      return updated;
    });
    showToast('Goal Dihapus', 'Target telah dihapus.', 'info');
  }, [showToast]);

  const toggleGoalDate = useCallback((id: string, dateStr?: string) => {
    const targetDate = dateStr || getLocalDateString(new Date());
    setGoals((prev) => {
      const updated = prev.map((g) => {
        if (g.id !== id) return g;
        const exists = g.completedDates.includes(targetDate);
        const nextDates = exists
          ? g.completedDates.filter((d) => d !== targetDate)
          : [...g.completedDates, targetDate];
        return { ...g, completedDates: nextDates };
      });
      setLocalItem(STORAGE_KEYS.GOALS, updated);
      return updated;
    });
  }, []);

  // -------------------------------------------------------------
  // Schedule Handlers
  // -------------------------------------------------------------
  const addSchedule = useCallback((itemData: Omit<ScheduleItem, 'id' | 'createdAt' | 'completed'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setSchedules((prev) => {
      const updated = [...prev, newItem].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
      setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
      return updated;
    });
    showToast('Agenda Ditambahkan', `"${newItem.title}" telah dijadwalkan.`);
  }, [showToast]);

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setSchedules((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
      return updated;
    });
    showToast('Agenda Diperbarui', 'Jadwal berhasil diperbarui.');
  }, [showToast]);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
      return updated;
    });
    showToast('Agenda Dihapus', 'Jadwal telah dihapus dari daftar.', 'info');
  }, [showToast]);

  const toggleScheduleComplete = useCallback((id: string) => {
    setSchedules((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
      return updated;
    });
  }, []);

  // -------------------------------------------------------------
  // Course Handlers
  // -------------------------------------------------------------
  const addCourse = useCallback((courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newCourse: Course = {
      ...courseData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setCourses((prev) => {
      const updated = [newCourse, ...prev];
      setLocalItem(STORAGE_KEYS.COURSES, updated);
      return updated;
    });
    showToast('Kursus Ditambahkan', `"${newCourse.title}" berhasil dicatat.`);
  }, [showToast]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== id) return c;
        const nextCourse = { ...c, ...updates, updatedAt: new Date().toISOString() };
        // Auto-update status if modules completed
        if (nextCourse.completedModules >= nextCourse.totalModules && nextCourse.totalModules > 0) {
          nextCourse.status = 'completed';
        }
        return nextCourse;
      });
      setLocalItem(STORAGE_KEYS.COURSES, updated);
      return updated;
    });
    showToast('Kursus Diperbarui', 'Informasi kursus berhasil disimpan.');
  }, [showToast]);

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setLocalItem(STORAGE_KEYS.COURSES, updated);
      return updated;
    });
    showToast('Kursus Dihapus', 'Kursus telah dihapus.', 'info');
  }, [showToast]);

  const updateCourseProgress = useCallback((id: string, completed: number) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== id) return c;
        const validCompleted = Math.max(0, Math.min(completed, c.totalModules));
        const status = validCompleted >= c.totalModules && c.totalModules > 0 ? 'completed' : c.status === 'completed' && validCompleted < c.totalModules ? 'in_progress' : c.status;
        return {
          ...c,
          completedModules: validCompleted,
          status,
          updatedAt: new Date().toISOString(),
        };
      });
      setLocalItem(STORAGE_KEYS.COURSES, updated);
      return updated;
    });
  }, []);

  // -------------------------------------------------------------
  // Note Handlers
  // -------------------------------------------------------------
  const addNote = useCallback((noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      setLocalItem(STORAGE_KEYS.NOTES, updated);
      return updated;
    });
    showToast('Catatan Dibuat', `"${newNote.title}" berhasil disimpan.`);
  }, [showToast]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      );
      setLocalItem(STORAGE_KEYS.NOTES, updated);
      return updated;
    });
    showToast('Catatan Diperbarui', 'Perubahan catatan tersimpan.');
  }, [showToast]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      setLocalItem(STORAGE_KEYS.NOTES, updated);
      return updated;
    });
    showToast('Catatan Dihapus', 'Catatan telah dihapus.', 'info');
  }, [showToast]);

  const togglePinNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
      setLocalItem(STORAGE_KEYS.NOTES, updated);
      return updated;
    });
  }, []);

  // -------------------------------------------------------------
  // Vault Handlers
  // -------------------------------------------------------------
  const addVaultLink = useCallback((itemData: Omit<VaultItem, 'id' | 'type' | 'createdAt'>) => {
    const newItem: VaultItem = {
      ...itemData,
      id: generateId(),
      type: 'link',
      createdAt: new Date().toISOString(),
    };
    setVault((prev) => {
      const updated = [newItem, ...prev];
      setLocalItem(STORAGE_KEYS.VAULT, updated);
      return updated;
    });
    showToast('Link Tersimpan', `Link "${newItem.title}" masuk ke Vault.`);
  }, [showToast]);

  const addVaultFile = useCallback(async (itemData: Omit<VaultItem, 'id' | 'type' | 'createdAt'>, file: File) => {
    const fileId = generateId();
    try {
      await saveFileToVault(fileId, file);
      const newItem: VaultItem = {
        ...itemData,
        id: generateId(),
        type: 'file',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        fileId: fileId,
        createdAt: new Date().toISOString(),
      };
      setVault((prev) => {
        const updated = [newItem, ...prev];
        setLocalItem(STORAGE_KEYS.VAULT, updated);
        return updated;
      });
      showToast('File Tersimpan', `File "${file.name}" aman tersimpan di IndexedDB.`);
    } catch (err) {
      console.error(err);
      showToast('Gagal Menyimpan File', 'Terjadi kendala saat menyimpan ke IndexedDB.', 'error');
    }
  }, [showToast]);

  const deleteVaultItem = useCallback(async (id: string) => {
    const item = vault.find((v) => v.id === id);
    if (item?.fileId) {
      await deleteFileFromVault(item.fileId);
    }
    setVault((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      setLocalItem(STORAGE_KEYS.VAULT, updated);
      return updated;
    });
    showToast('Item Dihapus', 'Resource telah dihapus dari Vault.', 'info');
  }, [vault, showToast]);

  // -------------------------------------------------------------
  // Data Management: Reset, Export, Import
  // -------------------------------------------------------------
  const reloadAllData = useCallback(() => {
    loadState();
  }, [loadState]);

  const clearAllData = useCallback(() => {
    setGoals([]);
    setSchedules([]);
    setCourses([]);
    setNotes([]);
    setVault([]);
    setLocalItem(STORAGE_KEYS.GOALS, []);
    setLocalItem(STORAGE_KEYS.SCHEDULES, []);
    setLocalItem(STORAGE_KEYS.COURSES, []);
    setLocalItem(STORAGE_KEYS.NOTES, []);
    setLocalItem(STORAGE_KEYS.VAULT, []);
    showToast('Semua Data Direset', 'Workspace sekarang dalam kondisi kosong bersih.', 'warning');
  }, [showToast]);

  const handleExport = useCallback(async () => {
    try {
      await exportAllData();
      showToast('Backup Berhasil', 'File .json telah diunduh.');
    } catch (err) {
      console.error(err);
      showToast('Gagal Export', 'Terjadi kesalahan saat mengekspor data.', 'error');
    }
  }, [showToast]);

  const handleImport = useCallback(async (file: File): Promise<boolean> => {
    try {
      const res = await importDataFromFile(file);
      if (res.success) {
        loadState();
        showToast('Restore Berhasil', res.message, 'success');
        return true;
      } else {
        showToast('Gagal Restore', res.message, 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal Restore', 'Terjadi error tak terduga.', 'error');
      return false;
    }
  }, [loadState, showToast]);

  return (
    <AppContext.Provider
      value={{
        isMounted,
        goals,
        schedules,
        courses,
        notes,
        vault,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalDate,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        toggleScheduleComplete,
        addCourse,
        updateCourse,
        deleteCourse,
        updateCourseProgress,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addVaultLink,
        addVaultFile,
        deleteVaultItem,
        reloadAllData,
        clearAllData,
        handleExport,
        handleImport,
        isQuickActionOpen,
        quickActionTab,
        openQuickAction,
        closeQuickAction,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
