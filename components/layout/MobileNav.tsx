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
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export function MobileNav() {
  const pathname = usePathname();
  const { openQuickAction } = useApp();

  const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Jadwal', href: '/schedule', icon: Calendar },
    { label: 'Course', href: '/courses', icon: GraduationCap },
    { label: 'Notes', href: '/notes', icon: FileText },
    { label: 'Vault', href: '/vault', icon: FolderLock },
  ];

  return (
    <>
      {/* Floating Add Button on Mobile */}
      <button
        onClick={() => openQuickAction()}
        className="md:hidden fixed right-4 bottom-20 z-40 h-13 w-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Tambah Cepat"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-0.5', isActive && 'stroke-[2.5]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={cn(
            'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition-colors',
            pathname === '/settings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          )}
        >
          <Settings className="h-5 w-5 mb-0.5" />
          <span>Setting</span>
        </Link>
      </nav>
    </>
  );
}
