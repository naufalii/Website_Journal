'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Calendar,
  GraduationCap,
  FileText,
  FolderLock,
  Settings,
  Sparkles,
  PlusCircle,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Daily Goals', href: '/goals', icon: Target },
  { label: 'Jadwal & Agenda', href: '/schedule', icon: Calendar },
  { label: 'Course & Skill', href: '/courses', icon: GraduationCap },
  { label: 'Catatan Cepat', href: '/notes', icon: FileText },
  { label: 'Resource Vault', href: '/vault', icon: FolderLock },
  { label: 'Pengaturan & Backup', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { openQuickAction, handleExport, goals, schedules, courses } = useApp();

  // Quick stats for sidebar badges
  const todayGoalsCount = goals.length;
  const activeCoursesCount = courses.filter((c) => c.status === 'in_progress').length;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 z-30 select-none">
      {/* Brand / Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
              NexusWorkspace
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Personal OS & Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={() => openQuickAction()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all duration-150"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Cepat</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </div>

              {/* Badges */}
              {item.href === '/goals' && todayGoalsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {todayGoalsCount}
                </span>
              )}
              {item.href === '/courses' && activeCoursesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium">
                  {activeCoursesCount} aktif
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Quick Backup Action */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={() => handleExport()}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors text-xs font-medium"
        >
          <div className="flex items-center gap-2">
            <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Backup Data (.json)</span>
          </div>
          <span className="text-[10px] text-slate-400">Save</span>
        </button>
      </div>
    </aside>
  );
}
