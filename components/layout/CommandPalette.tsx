'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  LayoutDashboard,
  Target,
  Calendar,
  GraduationCap,
  FileText,
  FolderLock,
  Settings,
  BarChart3,
  PlusCircle,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { goals, schedules, notes, openQuickAction } = useApp();
  const { theme, toggleTheme } = useTheme();

  // Toggle on Ctrl+K / Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95">
        <Command className="w-full">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-white/5">
            <Search className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark mr-3 flex-shrink-0" />
            <Command.Input
              placeholder="Ketik perintah atau cari target, agenda, catatan..."
              className="w-full bg-transparent text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:outline-none"
              autoFocus
            />
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark font-mono">
              ESC
            </span>
          </div>

          <Command.List className="max-h-80 sm:max-h-96 overflow-y-auto p-3 space-y-3">
            <Command.Empty className="py-8 text-center text-xs text-content-mutedLight dark:text-content-mutedDark">
              Tidak ada hasil yang ditemukan.
            </Command.Empty>

            {/* Quick Actions Group */}
            <Command.Group heading="Aksi Cepat (+ Tambah Data)">
              <div className="text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark px-2.5 py-1 mb-1">
                Aksi Cepat
              </div>
              <Command.Item
                onSelect={() => runCommand(() => openQuickAction('goal'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-vibrant cursor-pointer transition-colors"
              >
                <div className="p-1.5 rounded-xl bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant">
                  <Target className="h-4 w-4" />
                </div>
                <span>Tambah Target Harian Baru</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => openQuickAction('schedule'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-vibrant cursor-pointer transition-colors"
              >
                <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <Calendar className="h-4 w-4" />
                </div>
                <span>Tambah Agenda / Jadwal Baru</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => openQuickAction('note'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-vibrant cursor-pointer transition-colors"
              >
                <div className="p-1.5 rounded-xl bg-brand-cyan/10 text-brand-cyan">
                  <FileText className="h-4 w-4" />
                </div>
                <span>Tulis Catatan / Ide Cepat</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => openQuickAction('course'))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-brand-primary/10 hover:text-brand-primary dark:hover:text-brand-vibrant cursor-pointer transition-colors"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span>Tambah Kursus & Skill</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Group */}
            <Command.Group heading="Navigasi Halaman">
              <div className="text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark px-2.5 py-1 mb-1 mt-2">
                Navigasi Halaman
              </div>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Dashboard Overview</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/analytics'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-brand-primary dark:text-brand-vibrant" />
                <span>Analytics & Grafik Produktivitas</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/goals'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <Target className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Daily Goals & Habit</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/schedule'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <Calendar className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Jadwal & Agenda Planner</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/courses'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Course & Skill Tracker</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/notes'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <FileText className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Catatan Cepat</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/vault'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <FolderLock className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Resource Vault</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/settings'))}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <Settings className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                <span>Pengaturan & Akun</span>
              </Command.Item>
            </Command.Group>

            {/* Dynamic Results: Target & Notes */}
            {goals.length > 0 && (
              <Command.Group heading="Target Harian">
                <div className="text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark px-2.5 py-1 mb-1 mt-2">
                  Target Harian Tersimpan
                </div>
                {goals.slice(0, 4).map((g) => (
                  <Command.Item
                    key={g.id}
                    onSelect={() => runCommand(() => router.push('/goals'))}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary dark:text-brand-vibrant flex-shrink-0" />
                      <span className="truncate">{g.title}</span>
                    </div>
                    <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark font-semibold capitalize">
                      {g.category}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {notes.length > 0 && (
              <Command.Group heading="Catatan">
                <div className="text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark px-2.5 py-1 mb-1 mt-2">
                  Catatan Tersimpan
                </div>
                {notes.slice(0, 4).map((n) => (
                  <Command.Item
                    key={n.id}
                    onSelect={() => runCommand(() => router.push('/notes'))}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-3.5 w-3.5 text-brand-cyan flex-shrink-0" />
                      <span className="truncate">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark font-semibold capitalize">
                      {n.category}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* System Actions Group */}
            <Command.Group heading="Preferensi Sistem">
              <div className="text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark px-2.5 py-1 mb-1 mt-2">
                Sistem
              </div>
              <Command.Item
                onSelect={() => runCommand(() => toggleTheme())}
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-brand-primary" />
                  )}
                  <span>Ubah ke Mode {theme === 'dark' ? 'Terang (Light)' : 'Gelap (Dark)'}</span>
                </div>
                <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark">
                  Tema Aktif: {theme}
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer Guide */}
          <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-app-light/50 dark:bg-app-dark/30 flex items-center justify-between text-[11px] text-content-mutedLight dark:text-content-mutedDark">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-primary dark:text-brand-vibrant" />
              <span>Gunakan tanda panah ↑ ↓ dan Enter untuk navigasi cepat</span>
            </div>
            <span className="font-mono text-[10px] font-bold">Nexus Search</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
