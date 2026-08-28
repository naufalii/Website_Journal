import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate simple unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Format Date to YYYY-MM-DD (local)
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format Date for display (Indonesian localized)
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Format short date (e.g. 28 Aug 2026)
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Format Time (HH:mm)
export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  return timeStr;
}

// Format File Size
export function formatBytes(bytes?: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Calculate streak for habits/goals
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = Array.from(new Set(completedDates)).sort().reverse();
  const today = getLocalDateString(new Date());
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = getLocalDateString(yesterdayDate);

  // Check if streak is active (completed today or yesterday)
  const mostRecent = sortedDates[0];
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(mostRecent === today ? new Date() : yesterdayDate);

  for (let i = 0; i < sortedDates.length; i++) {
    const expected = getLocalDateString(checkDate);
    if (sortedDates.includes(expected)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Greeting generator based on current hour
export function getGreeting(): { text: string; subtext: string } {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) {
    return { text: 'Selamat Pagi ☀️', subtext: 'Siap menaklukkan target dan produktif hari ini?' };
  } else if (hour >= 11 && hour < 15) {
    return { text: 'Selamat Siang 🌤️', subtext: 'Tetap fokus dan selesaikan agenda prioritasmu.' };
  } else if (hour >= 15 && hour < 19) {
    return { text: 'Selamat Sore 🌇', subtext: 'Evaluasi pencapaian hari ini dan rehat sejenak.' };
  } else {
    return { text: 'Selamat Malam 🌙', subtext: 'Waktu yang tepat merencanakan hari esok yang sukses.' };
  }
}
