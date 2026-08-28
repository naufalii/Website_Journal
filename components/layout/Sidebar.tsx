'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Calendar,
  GraduationCap,
  FileText,
  FolderLock,
  Settings,
  Sparkles,
  PlusCircle,
  Download,
  LogIn,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Daily Goals', href: '/goals', icon: Target },
  { label: 'Jadwal & Agenda', href: '/schedule', icon: Calendar },
  { label: 'Course & Skill', href: '/courses', icon: GraduationCap },
  { label: 'Catatan Cepat', href: '/notes', icon: FileText },
  { label: 'Resource Vault', href: '/vault', icon: FolderLock },
  { label: 'Pengaturan', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openQuickAction, handleExport, goals, courses } = useApp();
  const { user, signOut } = useAuth();

  const todayGoalsCount = goals.length;
  const activeCoursesCount = courses.filter((c) => c.status === 'in_progress').length;
  const userName = user?.email ? user.email.split('@')[0] : 'Pengguna';

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/60 dark:border-white/5 bg-surface-light dark:bg-surface-dark h-screen sticky top-0 z-30 select-none transition-colors duration-200">
      {/* Brand / Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-primary via-brand-vibrant to-brand-cyan flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-black text-sm text-content-primaryLight dark:text-content-primaryDark tracking-tight">
              NexusWorkspace
            </h1>
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-medium">
              Personal Productivity OS
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={() => openQuickAction()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-primary hover:bg-brand-deep active:scale-[0.98] text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Cepat</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark">
          Menu Utama
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group',
                isActive
                  ? 'bg-brand-primary text-white shadow-soft font-bold'
                  : 'text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill hover:text-content-primaryLight dark:hover:text-content-primaryDark'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-content-mutedLight dark:text-content-mutedDark group-hover:text-brand-primary dark:group-hover:text-brand-vibrant'
                  )}
                />
                <span>{item.label}</span>
              </div>

              {/* Badges */}
              {item.href === '/goals' && todayGoalsCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-surface-lightPill dark:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark'
                  )}
                >
                  {todayGoalsCount}
                </span>
              )}
              {item.href === '/courses' && activeCoursesCount > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant'
                  )}
                >
                  {activeCoursesCount} aktif
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Profile & Quick Backup Action */}
      <div className="p-3.5 border-t border-slate-100 dark:border-white/5 bg-app-light/50 dark:bg-app-dark/30 space-y-2">
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200/60 dark:border-white/5 shadow-soft">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-vibrant text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-soft">
                {userName[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark truncate capitalize">
                  {userName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark font-medium">
                    Akun Aktif
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Keluar"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-brand-primary hover:bg-brand-deep text-white text-xs font-bold transition-all shadow-soft"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Masuk / Login</span>
          </Link>
        )}

        <button
          onClick={() => handleExport()}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-surface-light dark:bg-surface-dark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark transition-colors text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <Download className="h-3.5 w-3.5 text-brand-primary dark:text-brand-vibrant" />
            <span>Cadangkan Data</span>
          </div>
          <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark">JSON</span>
        </button>
      </div>
    </aside>
  );
}
