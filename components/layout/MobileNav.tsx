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
        className="md:hidden fixed right-5 bottom-24 z-40 h-13 w-13 rounded-full bg-brand-primary hover:bg-brand-deep text-white shadow-glow flex items-center justify-center active:scale-90 transition-transform duration-200"
        aria-label="Tambah Cepat"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30 flex justify-center">
        <nav className="w-full max-w-md bg-surface-light/85 dark:bg-surface-dark/85 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-full shadow-soft px-4 py-2 flex items-center justify-between transition-colors duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-2xl text-[10px] font-bold transition-all duration-150',
                  isActive
                    ? 'text-brand-primary dark:text-brand-vibrant scale-105'
                    : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark'
                )}
              >
                <Icon className={cn('h-5 w-5 mb-0.5', isActive && 'stroke-[2.5]')} />
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/settings"
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-2xl text-[10px] font-bold transition-all duration-150',
              pathname === '/settings'
                ? 'text-brand-primary dark:text-brand-vibrant scale-105'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark'
            )}
          >
            <Settings className="h-5 w-5 mb-0.5" />
            <span className="leading-none">Setelan</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
