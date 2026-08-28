'use client';

import React from 'react';
import { ScheduleItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';

interface VerticalTimelineProps {
  schedules: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onEdit?: (item: ScheduleItem) => void;
}

export function VerticalTimeline({ schedules, onToggleComplete, onEdit }: VerticalTimelineProps) {
  // Sort schedules by start time
  const sorted = [...schedules].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const priorityBadges = {
    high: <Badge variant="danger">High</Badge>,
    medium: <Badge variant="warning">Medium</Badge>,
    low: <Badge variant="cyan">Low</Badge>,
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
    if (h > 0 && m > 0) return `${h} jam ${m} mnt`;
    if (h > 0) return `${h} jam`;
    return `${m} menit`;
  };

  // Build items with Free Slot calculation
  const timelineElements: React.ReactNode[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // Check free slot before first item (e.g. from 07:00 to first event if > 30 mins)
    if (i === 0) {
      const startMin = timeToMinutes(current.startTime);
      const dayStartMin = 7 * 60; // 07:00
      if (startMin - dayStartMin >= 45) {
        const gapMins = startMin - dayStartMin;
        timelineElements.push(
          <div
            key="free-start"
            className="flex items-center gap-4 py-2 text-content-mutedLight dark:text-content-mutedDark"
          >
            <div className="w-16 sm:w-20 text-right font-mono text-[11px] font-bold">07:00</div>
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-white/10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-app-light/50 dark:bg-app-dark/30">
              <span className="text-[10px] font-bold text-brand-cyan">
                ✨ Waktu Luang ({formatDuration(gapMins)})
              </span>
              <span className="text-[10px]">Fokus / Istirahat</span>
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
            className="flex items-center gap-4 py-2 text-content-mutedLight dark:text-content-mutedDark"
          >
            <div className="w-16 sm:w-20 text-right font-mono text-[11px] font-bold">
              {prev.endTime}
            </div>
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-white/10 flex items-center justify-between px-3 py-1.5 rounded-xl bg-app-light/50 dark:bg-app-dark/30">
              <span className="text-[10px] font-bold text-brand-cyan">
                ✨ Waktu Luang ({formatDuration(gapMins)})
              </span>
              <span className="text-[10px]">Fokus / Istirahat</span>
            </div>
          </div>
        );
      }
    }

    // Render Event Block
    timelineElements.push(
      <div
        key={current.id}
        className={`flex items-start gap-4 transition-all duration-200 ${
          current.completed ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {/* Left Time Column */}
        <div className="w-16 sm:w-20 flex-shrink-0 text-right pt-2">
          <span className="font-mono text-xs sm:text-sm font-black text-content-primaryLight dark:text-content-primaryDark">
            {current.startTime}
          </span>
          <p className="font-mono text-[10px] text-content-mutedLight dark:text-content-mutedDark">
            {current.endTime}
          </p>
        </div>

        {/* Center Line with Circle Dot */}
        <div className="flex flex-col items-center self-stretch justify-center">
          <div className="h-3 w-3 rounded-full bg-brand-cyan shadow-glow flex-shrink-0 mt-2" />
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
        </div>

        {/* Event Card Block */}
        <div
          onClick={() => (onEdit ? onEdit(current) : onToggleComplete(current.id))}
          className="flex-1 p-4 rounded-3xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-all cursor-pointer shadow-soft border border-transparent hover:border-brand-primary/20 space-y-2 mb-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(current.id);
                }}
                className="flex-shrink-0 focus:outline-none transition-transform active:scale-90"
              >
                {current.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary" />
                )}
              </button>

              <h4
                className={`text-xs sm:text-sm font-bold truncate ${
                  current.completed
                    ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                    : 'text-content-primaryLight dark:text-content-primaryDark'
                }`}
              >
                {current.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge variant="default" size="sm">
                {categoryLabels[current.category] || current.category}
              </Badge>
              {priorityBadges[current.priority]}
            </div>
          </div>

          {current.description && (
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed pl-7">
              {current.description}
            </p>
          )}

          {current.locationOrLink && (
            <div className="text-[11px] text-brand-primary dark:text-brand-vibrant flex items-center gap-1 pl-7 font-bold">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              {current.locationOrLink.startsWith('http') ? (
                <a
                  href={current.locationOrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Link Meeting Online</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="truncate">{current.locationOrLink}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="space-y-1 pt-2">{timelineElements}</div>;
}
