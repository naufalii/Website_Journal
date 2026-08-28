'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Target, CheckCircle2, Circle, Flame, ArrowRight } from 'lucide-react';
import { getLocalDateString, calculateStreak } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

interface TodayGoalsWidgetProps {
  selectedDate?: string;
}

export function TodayGoalsWidget({ selectedDate }: TodayGoalsWidgetProps) {
  const { goals, toggleGoalDate, openQuickAction } = useApp();
  const dateToView = selectedDate || getLocalDateString();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completedDates.includes(dateToView));
  const progressPercent = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

  const categoryLabels: Record<string, string> = {
    career: 'Karir',
    learning: 'Belajar',
    health: 'Kesehatan',
    finance: 'Finansial',
    personal: 'Personal',
    general: 'Umum',
  };

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Target & Habit Harian
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">
              {completedGoals.length} dari {totalGoals} terselesaikan
            </p>
          </div>
        </div>

        <Link
          href="/goals"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
        >
          <span>Kelola</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Progress bar */}
      {totalGoals > 0 && (
        <div className="mb-4 p-3.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill">
          <div className="flex justify-between items-center text-xs font-bold mb-2 text-content-primaryLight dark:text-content-primaryDark">
            <span>Pencapaian Hari Ini</span>
            <span className="text-brand-primary dark:text-brand-vibrant">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} size="sm" color="brand" />
        </div>
      )}

      {/* Goals Checklist */}
      {totalGoals === 0 ? (
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Belum Ada Target"
          description="Buat target rutin harian atau kebiasaan baru untuk memulai konsistensimu."
          actionLabel="Tambah Target"
          onAction={() => openQuickAction('goal')}
          className="py-6 border-0 bg-transparent"
        />
      ) : (
        <div className="space-y-2.5 flex-1">
          {goals.slice(0, 5).map((goal) => {
            const isDone = goal.completedDates.includes(dateToView);
            const streak = calculateStreak(goal.completedDates);

            return (
              <div
                key={goal.id}
                onClick={() => toggleGoalDate(goal.id, dateToView)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 cursor-pointer select-none ${
                  isDone
                    ? 'bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20'
                    : 'bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    className="flex-shrink-0 focus:outline-none transition-transform active:scale-90"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-primary dark:text-brand-vibrant" />
                    ) : (
                      <Circle className="h-5 w-5 text-content-mutedLight dark:text-content-mutedDark group-hover:text-brand-primary" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate transition-colors ${
                        isDone
                          ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                          : 'text-content-primaryLight dark:text-content-primaryDark'
                      }`}
                    >
                      {goal.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" size="sm">
                        {categoryLabels[goal.category] || goal.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {streak > 0 && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{streak} Hari</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
