'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

export function TodayScheduleWidget() {
  const { schedules, toggleScheduleComplete, openQuickAction } = useApp();
  const todayStr = getLocalDateString();

  const todaySchedules = schedules
    .filter((s) => s.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const priorityBadges = {
    high: <Badge variant="danger">High</Badge>,
    medium: <Badge variant="warning">Medium</Badge>,
    low: <Badge variant="success">Low</Badge>,
  };

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Agenda Hari Ini</h3>
            <p className="text-xs text-slate-400">Timeline jadwal & aktivitas terdekat</p>
          </div>
        </div>

        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>Semua Jadwal</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {todaySchedules.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="Tidak Ada Jadwal Hari Ini"
          description="Hari ini agenda Anda masih kosong. Tambahkan jadwal aktivitas penting Anda."
          actionLabel="Tambah Agenda"
          onAction={() => openQuickAction('schedule')}
          className="py-6"
        />
      ) : (
        <div className="space-y-3 flex-1">
          {todaySchedules.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => toggleScheduleComplete(item.id)}
              className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                item.completed
                  ? 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/50 opacity-60'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  className="mt-0.5 flex-shrink-0 focus:outline-none"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold truncate ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium font-mono">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.locationOrLink && (
                      <span className="truncate max-w-[120px]">• {item.locationOrLink}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 ml-2">
                {priorityBadges[item.priority]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
