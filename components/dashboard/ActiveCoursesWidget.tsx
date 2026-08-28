'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { GraduationCap, ExternalLink, ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function ActiveCoursesWidget() {
  const { courses, updateCourseProgress, openQuickAction } = useApp();

  const activeCourses = courses.filter((c) => c.status === 'in_progress');

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Kursus & Skill
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">
              {activeCourses.length} materi sedang dipelajari
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {activeCourses.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="Tidak Ada Kursus Aktif"
          description="Tambahkan materi atau kursus online yang sedang Anda ikuti untuk memantau progres modulnya."
          actionLabel="Tambah Kursus"
          onAction={() => openQuickAction('course')}
          className="py-6 border-0 bg-transparent"
        />
      ) : (
        <div className="space-y-3.5 flex-1">
          {activeCourses.slice(0, 3).map((course) => {
            const percentage =
              course.totalModules > 0
                ? Math.round((course.completedModules / course.totalModules) * 100)
                : 0;

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill space-y-3 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark truncate">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary" size="sm">
                        {course.platform}
                      </Badge>
                      {course.url && (
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant inline-flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Module Stepper Buttons */}
                  <div className="flex items-center gap-1 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => updateCourseProgress(course.id, course.completedModules - 1)}
                      disabled={course.completedModules <= 0}
                      className="px-2 py-0.5 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill rounded-lg disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold px-1.5 text-content-primaryLight dark:text-content-primaryDark">
                      {course.completedModules}/{course.totalModules}
                    </span>
                    <button
                      onClick={() => updateCourseProgress(course.id, course.completedModules + 1)}
                      disabled={course.completedModules >= course.totalModules}
                      className="px-2 py-0.5 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill rounded-lg disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-content-mutedLight dark:text-content-mutedDark mb-1">
                    <span>Progres</span>
                    <span className="text-brand-primary dark:text-brand-vibrant font-mono">{percentage}%</span>
                  </div>
                  <ProgressBar value={percentage} size="sm" color="brand" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
