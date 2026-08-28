'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Goal, GoalCategory } from '@/lib/types';
import { getLocalDateString, formatDateIndo, calculateStreak } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { GoalModal } from '@/components/goals/GoalModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function GoalsPage() {
  const { goals, toggleGoalDate, deleteGoal } = useApp();

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const todayStr = getLocalDateString();
  const isToday = selectedDate === todayStr;

  // Date navigation handlers
  const changeDateBy = (offset: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offset);
    setSelectedDate(getLocalDateString(date));
  };

  // Filtered goals
  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  // Calculate stats for current selected date
  const totalCount = filteredGoals.length;
  const completedCount = filteredGoals.filter((g) => g.completedDates.includes(selectedDate)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'career', label: '💼 Karir' },
    { id: 'learning', label: '📚 Belajar' },
    { id: 'health', label: '🏃 Kesehatan' },
    { id: 'finance', label: '💰 Finansial' },
    { id: 'personal', label: '✨ Personal' },
    { id: 'general', label: '🎯 Umum' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Daily Goals & Habit Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bangun kebiasaan positif dan pantau konsistensi pencapaian setiap hari.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
          className="shadow-md shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Target</span>
        </Button>
      </div>

      {/* Date Navigation & Progress Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CalendarIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{formatDateIndo(selectedDate)}</span>
              {isToday && (
                <span className="ml-1 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-semibold">
                  Hari Ini
                </span>
              )}
            </div>

            <button
              onClick={() => changeDateBy(1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Hari Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline px-2"
              >
                Kembali ke Hari Ini
              </button>
            )}
          </div>

          {/* Quick Stat Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Pencapaian</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-mono">
                {completedCount}/{totalCount} ({progressPercent}%)
              </p>
            </div>
          </div>
        </div>

        {totalCount > 0 && (
          <ProgressBar value={progressPercent} size="md" color="emerald" showPercentage={false} />
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Goals Checklist List */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={<Target className="h-8 w-8" />}
          title="Belum Ada Target Harian"
          description={
            selectedCategory === 'all'
              ? 'Mulai perjalanan produktif Anda dengan membuat target dan kebiasaan harian pertama Anda.'
              : 'Tidak ada target pada kategori ini. Silakan tambahkan target baru.'
          }
          actionLabel="Tambah Target Harian"
          onAction={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const isCompleted = goal.completedDates.includes(selectedDate);
            const streak = calculateStreak(goal.completedDates);

            return (
              <div
                key={goal.id}
                className={`p-4 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left check and title */}
                <div
                  onClick={() => toggleGoalDate(goal.id, selectedDate)}
                  className="flex items-start gap-3.5 flex-1 min-w-0 cursor-pointer select-none"
                >
                  <button
                    type="button"
                    className="mt-0.5 flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-bold truncate transition-colors ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" size="sm">
                        {goal.category}
                      </Badge>
                      {streak > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40">
                          <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{streak} Hari Streak</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Goal"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(goal.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Hapus Goal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingGoal}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteGoal(deleteTargetId);
        }}
        title="Hapus Target Harian?"
        message="Target ini beserta riwayat checklist akan dihapus secara permanen dari browser Anda."
      />
    </div>
  );
}
