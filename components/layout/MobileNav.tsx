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
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

export function MobileNav() {
  const pathname = usePathname();
  const { openQuickAction } = useApp();

  const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Insight', href: '/analytics', icon: BarChart3 },
    { label: 'Goals', href: '/goals', icon: Target },
    { label: 'Jadwal', href: '/schedule', icon: Calendar },
    { label: 'Course', href: '/courses', icon: GraduationCap },
    { label: 'Notes', href: '/notes', icon: FileText },
    { label: 'Vault', href: '/vault', icon: FolderLock },
  ];

  return (
    <>
      {/* Floating Add Button on Mobile (Placed right above bottom bar) */}
      <button
        onClick={() => openQuickAction()}
        className="md:hidden fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-30 h-12 w-12 rounded-full bg-brand-primary hover:bg-brand-deep text-white shadow-glow flex items-center justify-center active:scale-90 transition-transform duration-200"
        aria-label="Tambah Cepat"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30 flex justify-center">
        <nav className="w-full max-w-lg bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl shadow-soft px-2 py-1.5 flex items-center justify-around transition-colors duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl text-[10px] font-bold transition-all duration-150',
                  isActive
                    ? 'text-brand-primary dark:text-brand-vibrant scale-105'
                    : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark'
                )}
              >
                <Icon className={cn('h-4.5 w-4.5 mb-0.5', isActive && 'stroke-[2.5]')} />
                <span className="leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
