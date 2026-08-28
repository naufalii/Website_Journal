'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  Plus,
  ExternalLink,
  Calendar as CalendarIcon,
  CheckCircle2,
  BookOpen,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { Course, CourseStatus } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { CourseModal } from '@/components/courses/CourseModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function CoursesPage() {
  const { courses, updateCourseProgress, deleteCourse } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all');
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

  const statusBadges: Record<CourseStatus, React.ReactNode> = {
    in_progress: <Badge variant="warning">⚡ Sedang Berjalan</Badge>,
    completed: <Badge variant="success">🎓 Selesai</Badge>,
    planned: <Badge variant="info">📌 Rencana</Badge>,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span>Course & Skill Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau kurikulum belajar, materi daring, dan progres penyelesaian modul keahlian.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCourse(null);
            setModalOpen(true);
          }}
          className="shadow-md shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Course</span>
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold">Total Kursus</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {courses.length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-amber-500 font-semibold">Sedang Berjalan</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {inProgressCount}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-emerald-500 font-semibold">Telah Selesai</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {completedCount}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-blue-500 font-semibold">Rencana Belajar</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {plannedCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Semua Status' },
          { id: 'in_progress', label: `Sedang Berjalan (${inProgressCount})` },
          { id: 'completed', label: `Selesai (${completedCount})` },
          { id: 'planned', label: `Rencana (${plannedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-8 w-8" />}
          title="Tidak Ada Kursus"
          description={
            statusFilter === 'all'
              ? 'Belum ada kursus atau skill yang dicatat. Daftarkan materi belajar Anda.'
              : 'Tidak ada kursus dengan status ini.'
          }
          actionLabel="Daftarkan Kursus"
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

            const isDone = course.completedModules >= course.totalModules && course.totalModules > 0;

            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                      {course.platform}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Kursus"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(course.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus Kursus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Link */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {course.title}
                    </h3>
                    {course.url && (
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <span>Akses Link Kursus</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {course.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                      {course.notes}
                    </p>
                  )}
                </div>

                {/* Progress Controls & Status */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Module Counter Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Modul: {course.completedModules} dari {course.totalModules}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateCourseProgress(course.id, course.completedModules - 1)
                        }
                        disabled={course.completedModules <= 0}
                        className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        title="Kurangi 1 Modul"
                      >
                        -1
                      </button>
                      <button
                        onClick={() =>
                          updateCourseProgress(course.id, course.completedModules + 1)
                        }
                        disabled={course.completedModules >= course.totalModules}
                        className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 disabled:opacity-30 transition-all"
                        title="Tambah 1 Modul Selesai"
                      >
                        +1 Bab
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ProgressBar
                    value={percentage}
                    size="sm"
                    color={isDone ? 'emerald' : 'purple'}
                    showPercentage={true}
                  />

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    {course.targetDate ? (
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Target: {formatShortDate(course.targetDate)}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                    <div>{statusBadges[course.status]}</div>
                  </div>
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
        message="Kursus ini beserta seluruh catatan modulnya akan dihapus dari daftar."
      />
    </div>
  );
}
