'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Target,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Goal } from '@/lib/types';
import { getLocalDateString, calculateStreak } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { HorizontalDateStrip } from '@/components/dashboard/HorizontalDateStrip';
import { GoalModal } from '@/components/goals/GoalModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function GoalsPage() {
  const { goals, toggleGoalDate, deleteGoal } = useApp();

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
    { id: 'career', label: 'Karir' },
    { id: 'learning', label: 'Belajar' },
    { id: 'health', label: 'Kesehatan' },
    { id: 'finance', label: 'Finansial' },
    { id: 'personal', label: 'Personal' },
    { id: 'general', label: 'Umum' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <Target className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
            <span>Daily Goals & Habit Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Bangun kebiasaan positif dan pantau konsistensi pencapaian setiap hari.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingGoal(null);
            setModalOpen(true);
          }}
          className="shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Target</span>
        </Button>
      </div>

      {/* Horizontal 7-Day Calendar Strip */}
      <HorizontalDateStrip
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Progress & Stat Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark">
              Pencapaian Hari Ini
            </h3>
            <p className="text-lg sm:text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-0.5">
              {completedCount} / {totalCount} Target ({progressPercent}%)
            </p>
          </div>

          <span className="text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">
            {progressPercent === 100 && totalCount > 0 ? '🎉 Sempurna!' : 'Terus Semangat!'}
          </span>
        </div>

        {totalCount > 0 && (
          <ProgressBar value={progressPercent} size="md" color="brand" showPercentage={false} />
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-brand-primary text-white shadow-soft font-bold'
                : 'bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill'
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
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                  isCompleted
                    ? 'bg-brand-primary/5 dark:bg-brand-primary/10 border-brand-primary/20 shadow-soft'
                    : 'bg-surface-light dark:bg-surface-dark border-slate-100 dark:border-white/5 shadow-soft hover:border-brand-primary/20'
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
                      <CheckCircle2 className="h-5 w-5 text-brand-primary dark:text-brand-vibrant" />
                    ) : (
                      <Circle className="h-5 w-5 text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3
                      className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                        isCompleted
                          ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                          : 'text-content-primaryLight dark:text-content-primaryDark'
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" size="sm">
                        {goal.category}
                      </Badge>
                      {streak > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
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
                    className="p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                    title="Edit Goal"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(goal.id)}
                    className="p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Hapus Goal"
                  >
                    <Trash2 className="h-4 w-4" />
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
        message="Target ini beserta riwayat checklist akan dihapus secara permanen dari ruang kerja Anda."
      />
    </div>
  );
}
