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
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  isMounted: boolean;
  isLoadingData: boolean;

  // Data
  goals: Goal[];
  schedules: ScheduleItem[];
  courses: Course[];
  notes: Note[];
  vault: VaultItem[];

  // Goals Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completedDates'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleGoalDate: (id: string, dateStr?: string) => Promise<void>;

  // Schedule Actions
  addSchedule: (item: Omit<ScheduleItem, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  updateSchedule: (id: string, item: Partial<ScheduleItem>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  toggleScheduleComplete: (id: string) => Promise<void>;

  // Course Actions
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  updateCourseProgress: (id: string, completed: number) => Promise<void>;

  // Notes Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Vault Actions
  addVaultLink: (item: Omit<VaultItem, 'id' | 'type' | 'createdAt'>) => Promise<void>;
  addVaultFile: (item: Omit<VaultItem, 'id' | 'type' | 'createdAt'>, file: File) => Promise<void>;
  deleteVaultItem: (id: string) => Promise<void>;

  // Backup & Reset Actions
  reloadAllData: () => Promise<void>;
  clearAllData: () => Promise<void>;
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
  const { user, isConfigured } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionTab, setQuickActionTab] = useState<'goal' | 'schedule' | 'course' | 'note' | 'vault'>('goal');

  // Toast notification helper
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
  // Data Fetching: Supabase or LocalStorage Fallback
  // -------------------------------------------------------------
  const loadState = useCallback(async () => {
    if (isConfigured && user) {
      setIsLoadingData(true);
      try {
        // Fetch Goals
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .order('created_at', { ascending: false });

        if (goalsData) {
          setGoals(
            goalsData.map((g) => ({
              id: g.id,
              title: g.title,
              category: g.category,
              targetPerWeek: g.target_per_week,
              completedDates: g.completed_dates || [],
              createdAt: g.created_at,
            }))
          );
        }

        // Fetch Schedules
        const { data: schedulesData } = await supabase
          .from('schedules')
          .select('*')
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (schedulesData) {
          setSchedules(
            schedulesData.map((s) => ({
              id: s.id,
              title: s.title,
              date: s.date,
              startTime: s.start_time,
              endTime: s.end_time,
              category: s.category,
              priority: s.priority,
              locationOrLink: s.location_or_link,
              description: s.description,
              completed: s.completed,
              createdAt: s.created_at,
            }))
          );
        }

        // Fetch Courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (coursesData) {
          setCourses(
            coursesData.map((c) => ({
              id: c.id,
              title: c.title,
              platform: c.platform,
              url: c.url,
              targetDate: c.target_date,
              totalModules: c.total_modules,
              completedModules: c.completed_modules,
              status: c.status,
              notes: c.notes,
              createdAt: c.created_at,
              updatedAt: c.updated_at,
            }))
          );
        }

        // Fetch Notes
        const { data: notesData } = await supabase
          .from('notes')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('updated_at', { ascending: false });

        if (notesData) {
          setNotes(
            notesData.map((n) => ({
              id: n.id,
              title: n.title,
              content: n.content,
              category: n.category,
              tags: n.tags || [],
              isPinned: n.is_pinned,
              createdAt: n.created_at,
              updatedAt: n.updated_at,
            }))
          );
        }

        // Fetch Documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (docsData) {
          setVault(
            docsData.map((d) => ({
              id: d.id,
              title: d.title,
              type: d.type,
              category: d.category,
              url: d.url,
              filePath: d.file_path,
              fileName: d.file_name,
              fileSize: d.file_size ? Number(d.file_size) : undefined,
              fileType: d.file_type,
              tags: d.tags || [],
              createdAt: d.created_at,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching Supabase data:', error);
      } finally {
        setIsLoadingData(false);
      }
    } else {
      // LocalStorage Fallback (Offline / Pre-auth)
      setGoals(getLocalItem<Goal[]>(STORAGE_KEYS.GOALS, []));
      setSchedules(getLocalItem<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, []));
      setCourses(getLocalItem<Course[]>(STORAGE_KEYS.COURSES, []));
      setNotes(getLocalItem<Note[]>(STORAGE_KEYS.NOTES, []));
      setVault(getLocalItem<VaultItem[]>(STORAGE_KEYS.VAULT, []));
    }
  }, [isConfigured, user]);

  useEffect(() => {
    setIsMounted(true);
    loadState();
  }, [loadState]);

  // -------------------------------------------------------------
  // Goals Handlers
  // -------------------------------------------------------------
  const addGoal = useCallback(
    async (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'completedDates'>) => {
      if (isConfigured && user) {
        const { data, error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            title: newGoalData.title,
            category: newGoalData.category,
            target_per_week: newGoalData.targetPerWeek || 7,
            completed_dates: [],
          })
          .select()
          .single();

        if (!error && data) {
          const newGoal: Goal = {
            id: data.id,
            title: data.title,
            category: data.category,
            targetPerWeek: data.target_per_week,
            completedDates: data.completed_dates || [],
            createdAt: data.created_at,
          };
          setGoals((prev) => [newGoal, ...prev]);
          showToast('Goal Tersinkronisasi', `"${newGoal.title}" tersimpan di Cloud.`);
        } else {
          showToast('Gagal Menambah Goal', error?.message, 'error');
        }
      } else {
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
        showToast('Goal Ditambahkan', `"${newGoal.title}" siap dicapai.`);
      }
    },
    [isConfigured, user, showToast]
  );

  const updateGoal = useCallback(
    async (id: string, updates: Partial<Goal>) => {
      if (isConfigured && user) {
        const updatePayload: any = {};
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.completedDates !== undefined) updatePayload.completed_dates = updates.completedDates;
        if (updates.targetPerWeek !== undefined) updatePayload.target_per_week = updates.targetPerWeek;

        const { error } = await supabase.from('goals').update(updatePayload).eq('id', id);

        if (!error) {
          setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
          showToast('Goal Diperbarui', 'Perubahan tersimpan di Cloud.');
        } else {
          showToast('Gagal Update Goal', error.message, 'error');
        }
      } else {
        setGoals((prev) => {
          const updated = prev.map((g) => (g.id === id ? { ...g, ...updates } : g));
          setLocalItem(STORAGE_KEYS.GOALS, updated);
          return updated;
        });
        showToast('Goal Diperbarui', 'Perubahan target berhasil disimpan.');
      }
    },
    [isConfigured, user, showToast]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      if (isConfigured && user) {
        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (!error) {
          setGoals((prev) => prev.filter((g) => g.id !== id));
          showToast('Goal Dihapus', 'Target telah dihapus dari Cloud.', 'info');
        } else {
          showToast('Gagal Hapus Goal', error.message, 'error');
        }
      } else {
        setGoals((prev) => {
          const updated = prev.filter((g) => g.id !== id);
          setLocalItem(STORAGE_KEYS.GOALS, updated);
          return updated;
        });
        showToast('Goal Dihapus', 'Target telah dihapus.', 'info');
      }
    },
    [isConfigured, user, showToast]
  );

  const toggleGoalDate = useCallback(
    async (id: string, dateStr?: string) => {
      const targetDate = dateStr || getLocalDateString(new Date());
      const currentGoal = goals.find((g) => g.id === id);
      if (!currentGoal) return;

      const previousDates = currentGoal.completedDates;
      const exists = previousDates.includes(targetDate);
      const nextDates = exists
        ? previousDates.filter((d) => d !== targetDate)
        : [...previousDates, targetDate];

      // Optimistic Instant Update (0ms)
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, completedDates: nextDates } : g))
      );

      if (isConfigured && user) {
        try {
          const { error } = await supabase
            .from('goals')
            .update({ completed_dates: nextDates })
            .eq('id', id);

          if (error) {
            // Auto rollback on failure
            setGoals((prev) =>
              prev.map((g) => (g.id === id ? { ...g, completedDates: previousDates } : g))
            );
            showToast('Koneksi Terganggu', 'Perubahan target dikembalikan karena kendala jaringan.', 'error');
          }
        } catch (err: any) {
          setGoals((prev) =>
            prev.map((g) => (g.id === id ? { ...g, completedDates: previousDates } : g))
          );
          showToast('Koneksi Terganggu', err?.message || 'Gagal menyinkronkan data.', 'error');
        }
      } else {
        setLocalItem(
          STORAGE_KEYS.GOALS,
          goals.map((g) => (g.id === id ? { ...g, completedDates: nextDates } : g))
        );
      }
    },
    [goals, isConfigured, user, showToast]
  );

  // -------------------------------------------------------------
  // Schedule Handlers
  // -------------------------------------------------------------
  const addSchedule = useCallback(
    async (itemData: Omit<ScheduleItem, 'id' | 'createdAt' | 'completed'>) => {
      if (isConfigured && user) {
        const { data, error } = await supabase
          .from('schedules')
          .insert({
            user_id: user.id,
            title: itemData.title,
            date: itemData.date,
            start_time: itemData.startTime,
            end_time: itemData.endTime,
            category: itemData.category,
            priority: itemData.priority,
            location_or_link: itemData.locationOrLink,
            description: itemData.description,
            completed: false,
          })
          .select()
          .single();

        if (!error && data) {
          const newItem: ScheduleItem = {
            id: data.id,
            title: data.title,
            date: data.date,
            startTime: data.start_time,
            endTime: data.end_time,
            category: data.category,
            priority: data.priority,
            locationOrLink: data.location_or_link,
            description: data.description,
            completed: data.completed,
            createdAt: data.created_at,
          };
          setSchedules((prev) => [...prev, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime)));
          showToast('Agenda Tersinkronisasi', `"${newItem.title}" tersimpan.`);
        } else {
          showToast('Gagal Menambah Agenda', error?.message, 'error');
        }
      } else {
        const newItem: ScheduleItem = {
          ...itemData,
          id: generateId(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setSchedules((prev) => {
          const updated = [...prev, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime));
          setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
          return updated;
        });
        showToast('Agenda Ditambahkan', `"${newItem.title}" telah dijadwalkan.`);
      }
    },
    [isConfigured, user, showToast]
  );

  const updateSchedule = useCallback(
    async (id: string, updates: Partial<ScheduleItem>) => {
      if (isConfigured && user) {
        const updatePayload: any = {};
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.date !== undefined) updatePayload.date = updates.date;
        if (updates.startTime !== undefined) updatePayload.start_time = updates.startTime;
        if (updates.endTime !== undefined) updatePayload.end_time = updates.endTime;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.priority !== undefined) updatePayload.priority = updates.priority;
        if (updates.locationOrLink !== undefined) updatePayload.location_or_link = updates.locationOrLink;
        if (updates.description !== undefined) updatePayload.description = updates.description;
        if (updates.completed !== undefined) updatePayload.completed = updates.completed;

        const { error } = await supabase.from('schedules').update(updatePayload).eq('id', id);

        if (!error) {
          setSchedules((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
          showToast('Agenda Diperbarui', 'Jadwal tersinkronisasi di Cloud.');
        } else {
          showToast('Gagal Update Agenda', error.message, 'error');
        }
      } else {
        setSchedules((prev) => {
          const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
          setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
          return updated;
        });
        showToast('Agenda Diperbarui', 'Jadwal berhasil diperbarui.');
      }
    },
    [isConfigured, user, showToast]
  );

  const deleteSchedule = useCallback(
    async (id: string) => {
      if (isConfigured && user) {
        const { error } = await supabase.from('schedules').delete().eq('id', id);
        if (!error) {
          setSchedules((prev) => prev.filter((item) => item.id !== id));
          showToast('Agenda Dihapus', 'Jadwal telah dihapus dari Cloud.', 'info');
        } else {
          showToast('Gagal Hapus Agenda', error.message, 'error');
        }
      } else {
        setSchedules((prev) => {
          const updated = prev.filter((item) => item.id !== id);
          setLocalItem(STORAGE_KEYS.SCHEDULES, updated);
          return updated;
        });
        showToast('Agenda Dihapus', 'Jadwal telah dihapus.', 'info');
      }
    },
    [isConfigured, user, showToast]
  );

  const toggleScheduleComplete = useCallback(
    async (id: string) => {
      const current = schedules.find((s) => s.id === id);
      if (!current) return;
      const previousCompleted = current.completed;
      const nextCompleted = !previousCompleted;

      // Optimistic Instant Update (0ms)
      setSchedules((prev) =>
        prev.map((item) => (item.id === id ? { ...item, completed: nextCompleted } : item))
      );

      if (isConfigured && user) {
        try {
          const { error } = await supabase
            .from('schedules')
            .update({ completed: nextCompleted })
            .eq('id', id);

          if (error) {
            // Auto rollback on failure
            setSchedules((prev) =>
              prev.map((item) => (item.id === id ? { ...item, completed: previousCompleted } : item))
            );
            showToast('Koneksi Terganggu', 'Perubahan agenda dikembalikan karena kendala jaringan.', 'error');
          }
        } catch (err: any) {
          setSchedules((prev) =>
            prev.map((item) => (item.id === id ? { ...item, completed: previousCompleted } : item))
          );
          showToast('Koneksi Terganggu', err?.message || 'Gagal menyinkronkan data.', 'error');
        }
      } else {
        setLocalItem(
          STORAGE_KEYS.SCHEDULES,
          schedules.map((s) => (s.id === id ? { ...s, completed: nextCompleted } : s))
        );
      }
    },
    [schedules, isConfigured, user, showToast]
  );

  // -------------------------------------------------------------
  // Course Handlers
  // -------------------------------------------------------------
  const addCourse = useCallback(
    async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (isConfigured && user) {
        const { data, error } = await supabase
          .from('courses')
          .insert({
            user_id: user.id,
            title: courseData.title,
            platform: courseData.platform,
            url: courseData.url,
            target_date: courseData.targetDate,
            total_modules: courseData.totalModules,
            completed_modules: courseData.completedModules,
            status: courseData.status,
            notes: courseData.notes,
          })
          .select()
          .single();

        if (!error && data) {
          const newCourse: Course = {
            id: data.id,
            title: data.title,
            platform: data.platform,
            url: data.url,
            targetDate: data.target_date,
            totalModules: data.total_modules,
            completedModules: data.completed_modules,
            status: data.status,
            notes: data.notes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          setCourses((prev) => [newCourse, ...prev]);
          showToast('Kursus Tersinkronisasi', `"${newCourse.title}" tersimpan di Cloud.`);
        } else {
          showToast('Gagal Menambah Kursus', error?.message, 'error');
        }
      } else {
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
      }
    },
    [isConfigured, user, showToast]
  );

  const updateCourse = useCallback(
    async (id: string, updates: Partial<Course>) => {
      const now = new Date().toISOString();
      if (isConfigured && user) {
        const updatePayload: any = { updated_at: now };
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.platform !== undefined) updatePayload.platform = updates.platform;
        if (updates.url !== undefined) updatePayload.url = updates.url;
        if (updates.targetDate !== undefined) updatePayload.target_date = updates.targetDate;
        if (updates.totalModules !== undefined) updatePayload.total_modules = updates.totalModules;
        if (updates.completedModules !== undefined) updatePayload.completed_modules = updates.completedModules;
        if (updates.status !== undefined) updatePayload.status = updates.status;
        if (updates.notes !== undefined) updatePayload.notes = updates.notes;

        const { error } = await supabase.from('courses').update(updatePayload).eq('id', id);

        if (!error) {
          setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now } : c)));
          showToast('Kursus Diperbarui', 'Data kursus tersinkronisasi.');
        } else {
          showToast('Gagal Update Kursus', error.message, 'error');
        }
      } else {
        setCourses((prev) => {
          const updated = prev.map((c) => {
            if (c.id !== id) return c;
            const nextCourse = { ...c, ...updates, updatedAt: now };
            if (nextCourse.completedModules >= nextCourse.totalModules && nextCourse.totalModules > 0) {
              nextCourse.status = 'completed';
            }
            return nextCourse;
          });
          setLocalItem(STORAGE_KEYS.COURSES, updated);
          return updated;
        });
        showToast('Kursus Diperbarui', 'Informasi kursus berhasil disimpan.');
      }
    },
    [isConfigured, user, showToast]
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      if (isConfigured && user) {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (!error) {
          setCourses((prev) => prev.filter((c) => c.id !== id));
          showToast('Kursus Dihapus', 'Kursus dihapus dari Cloud.', 'info');
        } else {
          showToast('Gagal Hapus Kursus', error.message, 'error');
        }
      } else {
        setCourses((prev) => {
          const updated = prev.filter((c) => c.id !== id);
          setLocalItem(STORAGE_KEYS.COURSES, updated);
          return updated;
        });
        showToast('Kursus Dihapus', 'Kursus telah dihapus.', 'info');
      }
    },
    [isConfigured, user, showToast]
  );

  const updateCourseProgress = useCallback(
    async (id: string, completed: number) => {
      const current = courses.find((c) => c.id === id);
      if (!current) return;

      const validCompleted = Math.max(0, Math.min(completed, current.totalModules));
      const status =
        validCompleted >= current.totalModules && current.totalModules > 0
          ? 'completed'
          : current.status === 'completed' && validCompleted < current.totalModules
          ? 'in_progress'
          : current.status;

      const now = new Date().toISOString();

      // Optimistic update
      setCourses((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, completedModules: validCompleted, status, updatedAt: now }
            : c
        )
      );

      if (isConfigured && user) {
        await supabase
          .from('courses')
          .update({
            completed_modules: validCompleted,
            status,
            updated_at: now,
          })
          .eq('id', id);
      } else {
        setLocalItem(
          STORAGE_KEYS.COURSES,
          courses.map((c) =>
            c.id === id
              ? { ...c, completedModules: validCompleted, status, updatedAt: now }
              : c
          )
        );
      }
    },
    [courses, isConfigured, user]
  );

  // -------------------------------------------------------------
  // Notes Handlers
  // -------------------------------------------------------------
  const addNote = useCallback(
    async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (isConfigured && user) {
        const { data, error } = await supabase
          .from('notes')
          .insert({
            user_id: user.id,
            title: noteData.title,
            content: noteData.content,
            category: noteData.category,
            tags: noteData.tags,
            is_pinned: noteData.isPinned,
          })
          .select()
          .single();

        if (!error && data) {
          const newNote: Note = {
            id: data.id,
            title: data.title,
            content: data.content,
            category: data.category,
            tags: data.tags || [],
            isPinned: data.is_pinned,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
          setNotes((prev) => [newNote, ...prev]);
          showToast('Catatan Tersinkronisasi', `"${newNote.title}" tersimpan di Cloud.`);
        } else {
          showToast('Gagal Menambah Catatan', error?.message, 'error');
        }
      } else {
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
      }
    },
    [isConfigured, user, showToast]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      const now = new Date().toISOString();
      if (isConfigured && user) {
        const updatePayload: any = { updated_at: now };
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.content !== undefined) updatePayload.content = updates.content;
        if (updates.category !== undefined) updatePayload.category = updates.category;
        if (updates.tags !== undefined) updatePayload.tags = updates.tags;
        if (updates.isPinned !== undefined) updatePayload.is_pinned = updates.isPinned;

        const { error } = await supabase.from('notes').update(updatePayload).eq('id', id);

        if (!error) {
          setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: now } : n)));
          showToast('Catatan Diperbarui', 'Perubahan catatan tersinkronisasi.');
        } else {
          showToast('Gagal Update Catatan', error.message, 'error');
        }
      } else {
        setNotes((prev) => {
          const updated = prev.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: now } : n
          );
          setLocalItem(STORAGE_KEYS.NOTES, updated);
          return updated;
        });
        showToast('Catatan Diperbarui', 'Perubahan catatan tersimpan.');
      }
    },
    [isConfigured, user, showToast]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      if (isConfigured && user) {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (!error) {
          setNotes((prev) => prev.filter((n) => n.id !== id));
          showToast('Catatan Dihapus', 'Catatan telah dihapus dari Cloud.', 'info');
        } else {
          showToast('Gagal Hapus Catatan', error.message, 'error');
        }
      } else {
        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== id);
          setLocalItem(STORAGE_KEYS.NOTES, updated);
          return updated;
        });
        showToast('Catatan Dihapus', 'Catatan telah dihapus.', 'info');
      }
    },
    [isConfigured, user, showToast]
  );

  const togglePinNote = useCallback(
    async (id: string) => {
      const current = notes.find((n) => n.id === id);
      if (!current) return;
      const nextPin = !current.isPinned;

      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: nextPin } : n)));

      if (isConfigured && user) {
        await supabase.from('notes').update({ is_pinned: nextPin }).eq('id', id);
      } else {
        setLocalItem(
          STORAGE_KEYS.NOTES,
          notes.map((n) => (n.id === id ? { ...n, isPinned: nextPin } : n))
        );
      }
    },
    [notes, isConfigured, user]
  );

  // -------------------------------------------------------------
  // Vault Handlers: Supabase Storage & IndexedDB Fallback
  // -------------------------------------------------------------
  const addVaultLink = useCallback(
    async (itemData: Omit<VaultItem, 'id' | 'type' | 'createdAt'>) => {
      if (isConfigured && user) {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            title: itemData.title,
            type: 'link',
            category: itemData.category,
            url: itemData.url,
            tags: itemData.tags,
          })
          .select()
          .single();

        if (!error && data) {
          const newItem: VaultItem = {
            id: data.id,
            title: data.title,
            type: 'link',
            category: data.category,
            url: data.url,
            tags: data.tags || [],
            createdAt: data.created_at,
          };
          setVault((prev) => [newItem, ...prev]);
          showToast('Link Tersimpan di Cloud', `"${newItem.title}" dapat diakses dari Laptop & HP.`);
        } else {
          showToast('Gagal Menyimpan Link', error?.message, 'error');
        }
      } else {
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
      }
    },
    [isConfigured, user, showToast]
  );

  const addVaultFile = useCallback(
    async (itemData: Omit<VaultItem, 'id' | 'type' | 'createdAt'>, file: File) => {
      if (isConfigured && user) {
        try {
          const fileExt = file.name.split('.').pop();
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filePath = `${user.id}/${Date.now()}_${cleanFileName}`;

          // Upload to Supabase Storage Bucket 'vault-documents'
          const { error: uploadError } = await supabase.storage
            .from('vault-documents')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            throw uploadError;
          }

          // Get Public URL
          const { data: urlData } = supabase.storage
            .from('vault-documents')
            .getPublicUrl(filePath);

          // Save row to documents table
          const { data, error: dbError } = await supabase
            .from('documents')
            .insert({
              user_id: user.id,
              title: itemData.title,
              type: 'file',
              category: itemData.category,
              url: urlData.publicUrl,
              file_path: filePath,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type || 'application/octet-stream',
              tags: itemData.tags,
            })
            .select()
            .single();

          if (dbError) throw dbError;

          if (data) {
            const newItem: VaultItem = {
              id: data.id,
              title: data.title,
              type: 'file',
              category: data.category,
              url: data.url,
              filePath: data.file_path,
              fileName: data.file_name,
              fileSize: data.file_size ? Number(data.file_size) : undefined,
              fileType: data.file_type,
              tags: data.tags || [],
              createdAt: data.created_at,
            };
            setVault((prev) => [newItem, ...prev]);
            showToast(
              'File Terunggah ke Cloud Storage',
              `"${file.name}" siap dibuka dari Laptop maupun HP!`
            );
          }
        } catch (err: any) {
          console.error('Upload error:', err);
          showToast('Gagal Upload ke Supabase Storage', err.message || 'Terjadi kesalahan.', 'error');
        }
      } else {
        // Fallback to local IndexedDB
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
      }
    },
    [isConfigured, user, showToast]
  );

  const deleteVaultItem = useCallback(
    async (id: string) => {
      const item = vault.find((v) => v.id === id);
      if (isConfigured && user) {
        if (item?.filePath) {
          await supabase.storage.from('vault-documents').remove([item.filePath]);
        }
        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (!error) {
          setVault((prev) => prev.filter((v) => v.id !== id));
          showToast('Item Dihapus', 'Dokumen dihapus dari Cloud.', 'info');
        } else {
          showToast('Gagal Menghapus Dokumen', error.message, 'error');
        }
      } else {
        if (item?.fileId) {
          await deleteFileFromVault(item.fileId);
        }
        setVault((prev) => {
          const updated = prev.filter((v) => v.id !== id);
          setLocalItem(STORAGE_KEYS.VAULT, updated);
          return updated;
        });
        showToast('Item Dihapus', 'Resource telah dihapus dari Vault.', 'info');
      }
    },
    [vault, isConfigured, user, showToast]
  );

  // -------------------------------------------------------------
  // Data Management: Reset, Export, Import
  // -------------------------------------------------------------
  const reloadAllData = useCallback(async () => {
    await loadState();
  }, [loadState]);

  const clearAllData = useCallback(async () => {
    if (isConfigured && user) {
      await supabase.from('goals').delete().eq('user_id', user.id);
      await supabase.from('schedules').delete().eq('user_id', user.id);
      await supabase.from('courses').delete().eq('user_id', user.id);
      await supabase.from('notes').delete().eq('user_id', user.id);
      await supabase.from('documents').delete().eq('user_id', user.id);
      setGoals([]);
      setSchedules([]);
      setCourses([]);
      setNotes([]);
      setVault([]);
      showToast('Semua Data di Cloud Dihapus', 'Akun Anda sekarang bersih.', 'warning');
    } else {
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
      showToast('Semua Data Direset', 'Workspace sekarang kosong.', 'warning');
    }
  }, [isConfigured, user, showToast]);

  const handleExport = useCallback(async () => {
    try {
      await exportAllData();
      showToast('Backup Berhasil', 'File .json telah diunduh.');
    } catch (err) {
      console.error(err);
      showToast('Gagal Export', 'Terjadi kesalahan saat mengekspor data.', 'error');
    }
  }, [showToast]);

  const handleImport = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        const res = await importDataFromFile(file);
        if (res.success) {
          await loadState();
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
    },
    [loadState, showToast]
  );

  return (
    <AppContext.Provider
      value={{
        isMounted,
        isLoadingData,
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
