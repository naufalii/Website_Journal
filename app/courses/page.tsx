'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Course } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { CourseModal } from '@/components/courses/CourseModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function CoursesPage() {
  const { courses, updateCourseProgress, deleteCourse } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'planned'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredCourses = courses.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const inProgressCount = courses.filter((c) => c.status === 'in_progress').length;
  const completedCount = courses.filter((c) => c.status === 'completed').length;
  const plannedCount = courses.filter((c) => c.status === 'planned').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
            <span>Course & Skill Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Pantau materi pembelajaran online, kurikulum, dan progres pencapaian skill Anda.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCourse(null);
            setModalOpen(true);
          }}
          className="shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kursus</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Semua Kursus', count: courses.length },
          { id: 'in_progress', label: 'Sedang Berjalan', count: inProgressCount },
          { id: 'completed', label: 'Selesai', count: completedCount },
          { id: 'planned', label: 'Direncanakan', count: plannedCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              statusFilter === tab.id
                ? 'bg-brand-primary text-white shadow-soft'
                : 'bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                statusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-lightPill dark:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-8 w-8" />}
          title="Tidak Ada Kursus Terdaftar"
          description={
            statusFilter === 'all'
              ? 'Tambahkan materi atau kelas online yang ingin Anda kuasai.'
              : 'Tidak ada kursus pada filter status ini.'
          }
          actionLabel="Tambah Kursus Baru"
          onAction={() => {
            setEditingCourse(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const percentage =
              course.totalModules > 0
                ? Math.round((course.completedModules / course.totalModules) * 100)
                : 0;

            const isDone = course.status === 'completed' || percentage === 100;

            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft hover:border-brand-primary/20 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Category & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={isDone ? 'success' : 'primary'} size="sm">
                      {course.platform}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                        title="Edit Kursus"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(course.id)}
                        className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Hapus Kursus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Course Title */}
                  <div>
                    <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark line-clamp-2">
                      {course.title}
                    </h3>
                    {course.notes && (
                      <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
                        {course.notes}
                      </p>
                    )}
                  </div>

                  {/* Course Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-content-mutedLight dark:text-content-mutedDark pt-1">
                    {course.targetDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-brand-primary dark:text-brand-vibrant" />
                        Target: {formatShortDate(course.targetDate)}
                      </span>
                    )}
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary dark:text-brand-vibrant hover:underline inline-flex items-center gap-1 font-bold"
                      >
                        <span>Akses Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Progress & Moduler Stepper */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-content-mutedLight dark:text-content-mutedDark">Modul Selesai</span>
                      <p className="text-sm font-black font-mono text-content-primaryLight dark:text-content-primaryDark">
                        {course.completedModules} / {course.totalModules}
                      </p>
                    </div>

                    {/* Stepper +/- */}
                    <div className="flex items-center gap-1 bg-surface-lightPill dark:bg-surface-darkPill p-1 rounded-2xl">
                      <button
                        onClick={() => updateCourseProgress(course.id, course.completedModules - 1)}
                        disabled={course.completedModules <= 0}
                        className="px-2.5 py-1 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-white dark:hover:bg-surface-dark rounded-xl disabled:opacity-30 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono px-2 text-brand-primary dark:text-brand-vibrant">
                        {percentage}%
                      </span>
                      <button
                        onClick={() => updateCourseProgress(course.id, course.completedModules + 1)}
                        disabled={course.completedModules >= course.totalModules}
                        className="px-2.5 py-1 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-white dark:hover:bg-surface-dark rounded-xl disabled:opacity-30 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <ProgressBar value={percentage} size="sm" color={isDone ? 'emerald' : 'brand'} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingCourse}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteCourse(deleteTargetId);
        }}
        title="Hapus Kursus?"
        message="Data kursus dan riwayat progres modulnya akan dihapus permanen."
      />
    </div>
  );
}
