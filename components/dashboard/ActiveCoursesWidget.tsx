'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GraduationCap, ExternalLink, Plus, ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function ActiveCoursesWidget() {
  const { courses, updateCourseProgress, openQuickAction } = useApp();

  const activeCourses = courses.filter((c) => c.status === 'in_progress');

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Courses & Skills</h3>
            <p className="text-xs text-slate-400">Materi belajar yang sedang dipelajari</p>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {activeCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="Tidak Ada Course Aktif"
          description="Tambahkan materi atau kursus online yang sedang Anda ikuti untuk melacak progres modulnya."
          actionLabel="Tambah Course"
          onAction={() => openQuickAction('course')}
          className="py-6"
        />
      ) : (
        <div className="space-y-4 flex-1">
          {activeCourses.slice(0, 3).map((course) => {
            const percentage =
              course.totalModules > 0
                ? Math.round((course.completedModules / course.totalModules) * 100)
                : 0;

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="purple" size="sm">
                        {course.platform}
                      </Badge>
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-emerald-500 inline-flex items-center gap-1"
                        >
                          <span>Buka Course</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => updateCourseProgress(course.id, course.completedModules - 1)}
                      disabled={course.completedModules <= 0}
                      className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold px-1 text-slate-800 dark:text-slate-200">
                      {course.completedModules}/{course.totalModules}
                    </span>
                    <button
                      onClick={() => updateCourseProgress(course.id, course.completedModules + 1)}
                      disabled={course.completedModules >= course.totalModules}
                      className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                    <span>Progres Belajar</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{percentage}%</span>
                  </div>
                  <ProgressBar value={percentage} size="sm" color="purple" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
