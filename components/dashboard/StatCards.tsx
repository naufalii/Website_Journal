'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Target, Calendar, GraduationCap, Flame } from 'lucide-react';
import { getLocalDateString, calculateStreak } from '@/lib/utils';
import Link from 'next/link';

export function StatCards() {
  const { goals, schedules, courses } = useApp();
  const todayStr = getLocalDateString();

  // Calculate Today's Goals Progress
  const totalGoals = goals.length;
  const completedGoalsCount = goals.filter((g) => g.completedDates.includes(todayStr)).length;
  const goalsPercentage = totalGoals > 0 ? Math.round((completedGoalsCount / totalGoals) * 100) : 0;

  // Calculate Max Active Streak across all goals
  const maxStreak = goals.reduce((max, g) => {
    const s = calculateStreak(g.completedDates);
    return s > max ? s : max;
  }, 0);

  // Today's pending schedules
  const todaySchedules = schedules.filter((s) => s.date === todayStr);
  const pendingSchedulesCount = todaySchedules.filter((s) => !s.completed).length;

  // Active courses
  const activeCourses = courses.filter((c) => c.status === 'in_progress').length;

  const stats = [
    {
      title: 'Target Hari Ini',
      value: totalGoals > 0 ? `${completedGoalsCount}/${totalGoals} (${goalsPercentage}%)` : '0 Target',
      description: totalGoals > 0 ? `${goalsPercentage}% selesai hari ini` : 'Belum ada target dibuat',
      icon: Target,
      color: 'emerald',
      href: '/goals',
    },
    {
      title: 'Streak Konsistensi',
      value: `${maxStreak} Hari`,
      description: maxStreak > 0 ? 'Konsistensi aktif 🔥' : 'Mulai checklist target',
      icon: Flame,
      color: 'amber',
      href: '/goals',
    },
    {
      title: 'Agenda Hari Ini',
      value: `${todaySchedules.length} Agenda`,
      description: `${pendingSchedulesCount} agenda tersisa`,
      icon: Calendar,
      color: 'blue',
      href: '/schedule',
    },
    {
      title: 'Course Berjalan',
      value: `${activeCourses} Skill`,
      description: `${courses.filter((c) => c.status === 'completed').length} telah diselesaikan`,
      icon: GraduationCap,
      color: 'purple',
      href: '/courses',
    },
  ];

  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      icon: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      icon: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/30',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      icon: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/30',
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const style = colorStyles[stat.color as keyof typeof colorStyles];

        return (
          <Link
            key={i}
            href={stat.href}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-xl ${style.bg} ${style.icon}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {stat.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
