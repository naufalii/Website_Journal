'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Pusat produktivitas & progres harian' },
    '/analytics': { title: 'Analytics & Insight', subtitle: 'Grafik performa, streak, dan distribusi waktu' },
    '/goals': { title: 'Daily Goals', subtitle: 'Bangun konsistensi dan pantau pencapaian rutin' },
    '/schedule': { title: 'Jadwal & Agenda', subtitle: 'Manajemen waktu dan timeline aktivitas' },
    '/courses': { title: 'Course & Skill', subtitle: 'Pelacak materi belajar dan kurikulum skill' },
    '/notes': { title: 'Catatan Cepat', subtitle: 'Dokumentasikan ide dan referensi penting' },
    '/vault': { title: 'Resource Vault', subtitle: 'Brankas dokumen, berkas, dan tautan penting' },
    '/settings': { title: 'Pengaturan', subtitle: 'Preferensi tema, akun, dan manajemen data' },
  };

  const currentInfo = pageTitles[pathname] || {
    title: 'Nexus Workspace',
    subtitle: 'Personal Productivity OS',
  };

  const userName = user?.email ? user.email.split('@')[0] : 'Tamu';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/60 dark:border-white/5 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-content-mutedLight dark:text-content-mutedDark hidden sm:block">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Right controls: Live Clock, Theme Switcher, and User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Live Clock Widget */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-xs text-content-mutedLight dark:text-content-mutedDark font-medium">
          <Clock className="h-3.5 w-3.5 text-brand-primary dark:text-brand-vibrant" />
          <span className="font-mono font-bold text-content-primaryLight dark:text-content-primaryDark">
            {timeStr || '--:--'}
          </span>
        </div>

        {/* Theme Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Mode"
          className="p-2.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant transition-all duration-200 active:scale-90"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-brand-primary" />
          )}
        </button>

        {/* User Auth Avatar / Status */}
        {user ? (
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-vibrant text-white font-bold text-xs flex items-center justify-center shadow-soft">
              {userName[0].toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark capitalize">
                {userName}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-2xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary dark:text-brand-vibrant text-xs font-bold transition-colors"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}
