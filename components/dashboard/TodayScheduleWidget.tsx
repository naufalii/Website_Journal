'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, Clock, CheckCircle2, Circle, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
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
    high: <Badge variant="danger">High</Badge>,
    medium: <Badge variant="warning">Medium</Badge>,
    low: <Badge variant="cyan">Low</Badge>,
  };

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
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
        <div className="space-y-3 flex-1">
          {daySchedules.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 transition-all duration-200 ${
                item.completed ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Left Time Column */}
              <div className="w-16 flex-shrink-0 text-right">
                <span className="font-mono text-xs font-bold text-content-primaryLight dark:text-content-primaryDark">
                  {item.startTime}
                </span>
                <p className="font-mono text-[10px] text-content-mutedLight dark:text-content-mutedDark">
                  {item.endTime}
                </p>
              </div>

              {/* Center Dot Indicator */}
              <div className="flex flex-col items-center self-stretch justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-cyan shadow-glow flex-shrink-0" />
                <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
              </div>

              {/* Task Pill Container */}
              <div
                onClick={() => toggleScheduleComplete(item.id)}
                className={`flex-1 p-3.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-all cursor-pointer select-none flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button type="button" className="flex-shrink-0 focus:outline-none">
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold truncate ${
                        item.completed
                          ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                          : 'text-content-primaryLight dark:text-content-primaryDark'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.locationOrLink && (
                      <p className="text-[10px] text-content-mutedLight dark:text-content-mutedDark truncate mt-0.5">
                        📍 {item.locationOrLink}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">{priorityBadges[item.priority]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
