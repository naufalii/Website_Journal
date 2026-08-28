'use client';

import React from 'react';
import { ScheduleItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle, MapPin, ExternalLink } from 'lucide-react';

interface VerticalTimelineProps {
  schedules: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onEdit?: (item: ScheduleItem) => void;
}

export function VerticalTimeline({ schedules, onToggleComplete, onEdit }: VerticalTimelineProps) {
  // Sort schedules by start time
  const sorted = [...schedules].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const priorityBadges = {
    high: <Badge variant="danger" size="sm">High</Badge>,
    medium: <Badge variant="warning" size="sm">Med</Badge>,
    low: <Badge variant="cyan" size="sm">Low</Badge>,
  };

  const categoryLabels: Record<string, string> = {
    work: 'Kerja',
    meeting: 'Meeting',
    study: 'Belajar',
    health: 'Kesehatan',
    personal: 'Personal',
    other: 'Lainnya',
  };

  // Time conversion helpers
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}j ${m}m`;
    if (h > 0) return `${h} jam`;
    return `${m} mnt`;
  };

  // Build items with Free Slot calculation
  const timelineElements: React.ReactNode[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // Check free slot before first item (e.g. from 07:00 to first event if >= 45 mins)
    if (i === 0) {
      const startMin = timeToMinutes(current.startTime);
      const dayStartMin = 7 * 60; // 07:00
      if (startMin - dayStartMin >= 45) {
        const gapMins = startMin - dayStartMin;
        timelineElements.push(
          <div
            key="free-start"
            className="flex items-center gap-2 sm:gap-4 py-2 text-content-mutedLight dark:text-content-mutedDark w-full"
          >
            <div className="w-14 sm:w-16 flex-shrink-0 text-right font-mono text-xs font-semibold text-content-mutedLight dark:text-content-mutedDark">
              07:00
            </div>
            <div className="flex-1 min-w-0 border-t border-dashed border-slate-300 dark:border-white/10 flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl bg-app-light/50 dark:bg-app-dark/30 gap-2">
              <span className="text-xs font-semibold text-brand-cyan truncate">
                ✨ Waktu Luang ({formatDuration(gapMins)})
              </span>
              <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark hidden sm:inline flex-shrink-0">
                Fokus / Istirahat
              </span>
            </div>
          </div>
        );
      }
    }

    // Check gap between previous item and current item
    if (i > 0) {
      const prev = sorted[i - 1];
      const prevEndMin = timeToMinutes(prev.endTime);
      const currStartMin = timeToMinutes(current.startTime);

      if (currStartMin - prevEndMin >= 30) {
        const gapMins = currStartMin - prevEndMin;
        timelineElements.push(
          <div
            key={`gap-${prev.id}-${current.id}`}
            className="flex items-center gap-2 sm:gap-4 py-2 text-content-mutedLight dark:text-content-mutedDark w-full"
          >
            <div className="w-14 sm:w-16 flex-shrink-0 text-right font-mono text-xs font-semibold text-content-mutedLight dark:text-content-mutedDark">
              {prev.endTime}
            </div>
            <div className="flex-1 min-w-0 border-t border-dashed border-slate-300 dark:border-white/10 flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl bg-app-light/50 dark:bg-app-dark/30 gap-2">
              <span className="text-xs font-semibold text-brand-cyan truncate">
                ✨ Waktu Luang ({formatDuration(gapMins)})
              </span>
              <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark hidden sm:inline flex-shrink-0">
                Fokus / Istirahat
              </span>
            </div>
          </div>
        );
      }
    }

    // Render Event Block
    timelineElements.push(
      <div
        key={current.id}
        className={`flex items-start gap-2 sm:gap-4 w-full transition-all duration-200 ${
          current.completed ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {/* Left Time Column (Compact on mobile) */}
        <div className="w-14 sm:w-16 flex-shrink-0 text-right pt-2.5">
          <span className="font-mono text-xs font-semibold text-content-mutedLight dark:text-content-mutedDark block leading-none">
            {current.startTime}
          </span>
          <span className="font-mono text-[10px] text-content-mutedLight/70 dark:text-content-mutedDark/70 block mt-1 leading-none">
            {current.endTime}
          </span>
        </div>

        {/* Center Line with Circle Dot */}
        <div className="flex flex-col items-center self-stretch justify-center flex-shrink-0">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-brand-cyan shadow-glow flex-shrink-0 mt-2.5" />
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
        </div>

        {/* Event Card Block (Full width, responsive internal layout) */}
        <div
          onClick={() => (onEdit ? onEdit(current) : onToggleComplete(current.id))}
          className="flex-1 min-w-0 w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-all cursor-pointer shadow-soft border border-transparent hover:border-brand-primary/20 space-y-1.5 mb-2"
        >
          {/* Top Row: Checkbox + Title + Priority Badge */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(current.id);
                }}
                className="flex-shrink-0 focus:outline-none transition-transform active:scale-90"
              >
                {current.completed ? (
                  <CheckCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary" />
                )}
              </button>

              <h4
                className={`text-xs sm:text-sm font-semibold truncate ${
                  current.completed
                    ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                    : 'text-content-primaryLight dark:text-content-primaryDark'
                }`}
              >
                {current.title}
              </h4>
            </div>

            <div className="flex-shrink-0">
              {priorityBadges[current.priority]}
            </div>
          </div>

          {/* Description (if exists) */}
          {current.description && (
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed pl-6 sm:pl-7 line-clamp-2">
              {current.description}
            </p>
          )}

          {/* Bottom Row: Category Badge + Location */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 pl-6 sm:pl-7">
            <Badge variant="default" size="sm">
              {categoryLabels[current.category] || current.category}
            </Badge>

            {current.locationOrLink && (
              <div className="text-xs text-brand-primary dark:text-brand-vibrant flex items-center gap-1 font-medium truncate max-w-[180px] sm:max-w-xs">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                {current.locationOrLink.startsWith('http') ? (
                  <a
                    href={current.locationOrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:underline flex items-center gap-0.5 truncate"
                  >
                    <span className="truncate">Meeting Online</span>
                    <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                  </a>
                ) : (
                  <span className="truncate">{current.locationOrLink}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div className="space-y-1 pt-1 w-full overflow-hidden">{timelineElements}</div>;
}
