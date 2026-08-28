'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, CheckCircle2, Circle, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

interface TodayScheduleWidgetProps {
  selectedDate?: string;
}

export function TodayScheduleWidget({ selectedDate }: TodayScheduleWidgetProps) {
  const { schedules, toggleScheduleComplete, openQuickAction } = useApp();
  const dateToView = selectedDate || getLocalDateString();

  const daySchedules = schedules
    .filter((s) => s.date === dateToView)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const priorityBadges = {
    high: <Badge variant="danger" size="sm">High</Badge>,
    medium: <Badge variant="warning" size="sm">Med</Badge>,
    low: <Badge variant="cyan" size="sm">Low</Badge>,
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Timeline Agenda
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">
              {daySchedules.length} aktivitas terencana
            </p>
          </div>
        </div>

        <Link
          href="/schedule"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
        >
          <span>Buka Agenda</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {daySchedules.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title="Tidak Ada Jadwal"
          description="Belum ada agenda pada tanggal ini. Tambahkan aktivitas untuk mengatur waktumu."
          actionLabel="Tambah Agenda"
          onAction={() => openQuickAction('schedule')}
          className="py-6 border-0 bg-transparent"
        />
      ) : (
        <div className="space-y-2.5 sm:space-y-3 flex-1 w-full">
          {daySchedules.map((item) => (
            <div
              key={item.id}
              className={`flex items-start sm:items-center gap-2 sm:gap-3.5 w-full transition-all duration-200 ${
                item.completed ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Left Time Column (Compact on mobile) */}
              <div className="w-14 sm:w-16 flex-shrink-0 text-right pt-1.5 sm:pt-0">
                <span className="font-mono text-xs font-semibold text-content-mutedLight dark:text-content-mutedDark block leading-none">
                  {item.startTime}
                </span>
                <span className="font-mono text-[10px] text-content-mutedLight/70 dark:text-content-mutedDark/70 block mt-1 leading-none">
                  {item.endTime}
                </span>
              </div>

              {/* Center Dot Indicator */}
              <div className="hidden sm:flex flex-col items-center self-stretch justify-center flex-shrink-0">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-cyan shadow-glow flex-shrink-0" />
                <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
              </div>

              {/* Task Pill Container */}
              <div
                onClick={() => toggleScheduleComplete(item.id)}
                className="flex-1 min-w-0 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-all cursor-pointer select-none space-y-1"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button type="button" className="flex-shrink-0 focus:outline-none">
                      {item.completed ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 text-content-mutedLight dark:text-content-mutedDark" />
                      )}
                    </button>

                    <h4
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        item.completed
                          ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                          : 'text-content-primaryLight dark:text-content-primaryDark'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex-shrink-0">{priorityBadges[item.priority]}</div>
                </div>

                {item.locationOrLink && (
                  <div className="text-[11px] text-brand-primary dark:text-brand-vibrant flex items-center gap-1 font-medium pl-6 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{item.locationOrLink}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
