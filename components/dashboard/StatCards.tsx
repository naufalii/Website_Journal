'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Clock, GraduationCap, FolderLock } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils';
import Link from 'next/link';

export function StatCards() {
  const { goals, schedules, courses, notes, vault } = useApp();
  const todayStr = getLocalDateString();

  // 1. Target Selesai (Today's completed goals)
  const completedGoalsCount = goals.filter((g) => g.completedDates.includes(todayStr)).length;
  const totalGoalsCount = goals.length;
  const goalsPercentage = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

  // 2. Sedang Berjalan (Pending schedules today + in progress goals)
  const todayPendingSchedules = schedules.filter((s) => s.date === todayStr && !s.completed).length;
  const pendingGoals = totalGoalsCount - completedGoalsCount;
  const inProgressTotal = todayPendingSchedules + pendingGoals;

  // 3. Kursus Aktif
  const activeCoursesCount = courses.filter((c) => c.status === 'in_progress').length;

  // 4. Catatan & Vault Resources
  const totalResources = notes.length + vault.length;

  const cards = [
    {
      title: 'Target Selesai',
      value: `${completedGoalsCount}`,
      subtext: `${goalsPercentage}% dari ${totalGoalsCount} target tercapai`,
      icon: CheckCircle2,
      href: '/goals',
      accent: 'emerald',
    },
    {
      title: 'Sedang Berjalan',
      value: `${inProgressTotal}`,
      subtext: `${todayPendingSchedules} agenda & ${pendingGoals} target aktif`,
      icon: Clock,
      href: '/schedule',
      accent: 'amber',
    },
    {
      title: 'Kursus Aktif',
      value: `${activeCoursesCount}`,
      subtext: `${courses.filter((c) => c.status === 'completed').length} kursus telah selesai`,
      icon: GraduationCap,
      href: '/courses',
      accent: 'primary',
    },
    {
      title: 'Catatan & Vault',
      value: `${totalResources}`,
      subtext: `${notes.length} catatan & ${vault.length} berkas vault`,
      icon: FolderLock,
      href: '/vault',
      accent: 'cyan',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <Link
            key={i}
            href={card.href}
            className="group bg-surface-light dark:bg-surface-dark p-5 rounded-3xl shadow-soft border border-slate-100 dark:border-white/5 hover:border-brand-primary/30 dark:hover:border-brand-vibrant/30 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">
                {card.title}
              </span>
              <div className="p-2.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant group-hover:scale-110 transition-transform">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-2xl sm:text-3xl font-black text-brand-primary dark:text-brand-vibrant tracking-tight font-mono">
                {card.value}
              </h3>
              <p className="mt-1 text-[11px] text-content-mutedLight dark:text-content-mutedDark truncate font-medium">
                {card.subtext}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
