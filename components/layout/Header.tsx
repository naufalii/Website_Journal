'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PlusCircle, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { openQuickAction } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');
  const [todayDate, setTodayDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setTodayDate(`${year}-${month}-${day}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Overview Dashboard', subtitle: 'Pusat kendali produktivitas dan progres harian' },
    '/goals': { title: 'Daily Goals & Habit Tracker', subtitle: 'Bangun konsistensi dan pantau pencapaian rutin' },
    '/schedule': { title: 'Jadwal & Agenda Planner', subtitle: 'Manajemen waktu, agenda penting, dan timeline terstruktur' },
    '/courses': { title: 'Course & Skill Tracker', subtitle: 'Pantau materi belajar, target modul, dan kurikulum skill' },
    '/notes': { title: 'Catatan Cepat & Knowledge Base', subtitle: 'Dokumentasikan ide, ringkasan, dan referensi penting' },
    '/vault': { title: 'Document & Resource Vault', subtitle: 'Penyimpanan berkas lokal IndexedDB dan tautan penting' },
    '/settings': { title: 'Pengaturan & Backup Data', subtitle: 'Ekspor, impor restore, dan manajemen penyimpanan data' },
  };

  const currentInfo = pageTitles[pathname] || {
    title: 'Personal Workspace',
    subtitle: 'All-in-One Dashboard',
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Title & Path */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Right controls: Live Clock & Quick Action */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Date & Clock Widget */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-200 font-medium">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <CalendarIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{todayDate ? formatDateIndo(todayDate) : 'Hari Ini'}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <div className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeStr || '--:--:--'}</span>
          </div>
        </div>

        {/* Global Quick Action button */}
        <button
          onClick={() => openQuickAction()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Cepat</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>
    </header>
  );
}
