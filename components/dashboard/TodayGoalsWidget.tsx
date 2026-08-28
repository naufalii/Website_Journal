'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Target, CheckCircle2, Circle, Plus, Flame, ArrowRight } from 'lucide-react';
import { getLocalDateString, calculateStreak } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function TodayGoalsWidget() {
  const { goals, toggleGoalDate, openQuickAction } = useApp();
  const todayStr = getLocalDateString();

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completedDates.includes(todayStr));
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
    <div className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Focus & Habits</h3>
            <p className="text-xs text-slate-400">Target & kebiasaan hari ini</p>
          </div>
        </div>

        <Link
          href="/goals"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>Kelola</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Progress bar if there are goals */}
      {totalGoals > 0 && (
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-slate-600 dark:text-slate-300">
              Progres Hari Ini: {completedGoals.length}/{totalGoals} Selesai
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} size="sm" color="emerald" />
        </div>
      )}

      {/* Goals Checklist */}
      {totalGoals === 0 ? (
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Belum Ada Target Harian"
          description="Buat target rutin harian atau kebiasaan baru untuk memulai streak konsistensi."
          actionLabel="Tambah Goal"
          onAction={() => openQuickAction('goal')}
          className="py-6"
        />
      ) : (
        <div className="space-y-2 flex-1">
          {goals.slice(0, 5).map((goal) => {
            const isDone = goal.completedDates.includes(todayStr);
            const streak = calculateStreak(goal.completedDates);

            return (
              <div
                key={goal.id}
                onClick={() => toggleGoalDate(goal.id, todayStr)}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  isDone
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    className="flex-shrink-0 focus:outline-none transition-transform active:scale-90"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate transition-colors ${
                        isDone
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {goal.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default" size="sm">
                        {categoryLabels[goal.category] || goal.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {streak > 0 && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full flex-shrink-0">
                    <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{streak}d</span>
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
