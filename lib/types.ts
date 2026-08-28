export type Priority = 'low' | 'medium' | 'high';

export type GoalCategory = 'career' | 'health' | 'learning' | 'finance' | 'personal' | 'general';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  targetPerWeek?: number;
  completedDates: string[]; // ISO date strings 'YYYY-MM-DD'
  createdAt: string;
}

export type ScheduleCategory = 'work' | 'study' | 'meeting' | 'health' | 'personal' | 'other';

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  category: ScheduleCategory;
  priority: Priority;
  locationOrLink?: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

export type CourseStatus = 'in_progress' | 'completed' | 'planned';

export interface Course {
  id: string;
  title: string;
  platform: string;
  url?: string;
  targetDate?: string;
  totalModules: number;
  completedModules: number;
  status: CourseStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 'idea' | 'learning' | 'project' | 'personal' | 'work' | 'general';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export type VaultType = 'link' | 'file';

export type VaultCategory = 'document' | 'finance' | 'certificate' | 'learning' | 'work' | 'personal' | 'other';

export interface VaultItem {
  id: string;
  title: string;
  type: VaultType;
  category: VaultCategory;
  url?: string; // For links or storage public URL
  filePath?: string; // Supabase Storage bucket object path
  fileName?: string; // For files
  fileSize?: number; // In bytes
  fileType?: string; // MIME type
  fileId?: string; // IndexedDB key reference
  tags: string[];
  createdAt: string;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  goals: Goal[];
  schedules: ScheduleItem[];
  courses: Course[];
  notes: Note[];
  vault: VaultItem[];
  vaultFiles?: Record<string, { name: string; type: string; base64: string }>;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}
