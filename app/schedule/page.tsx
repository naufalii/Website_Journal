'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Filter,
  List,
  AlignVerticalSpaceAround,
} from 'lucide-react';
import { ScheduleItem } from '@/lib/types';
import { getLocalDateString } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { HorizontalDateStrip } from '@/components/dashboard/HorizontalDateStrip';
import { VerticalTimeline } from '@/components/schedule/VerticalTimeline';
import { ScheduleModal } from '@/components/schedule/ScheduleModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SchedulePage() {
  const { schedules, toggleScheduleComplete, deleteSchedule } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('timeline');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter schedules by selectedDate and priority
  const filteredSchedules = schedules
    .filter((item) => {
      if (item.date !== selectedDate) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

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

  return (
    <div className="space-y-5 sm:space-y-6 pb-36 sm:pb-16 animate-in fade-in duration-300 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-brand-primary dark:text-brand-vibrant flex-shrink-0" />
            <span>Jadwal & Agenda Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Rencanakan timeline aktivitas, alokasi waktu, dan jeda waktu luang produktif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
              }`}
              title="Tampilan Timeline Vertikal"
            >
              <AlignVerticalSpaceAround className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
              }`}
              title="Tampilan Kartu"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>

          <Button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="shadow-glow"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Agenda</span>
          </Button>
        </div>
      </div>

      {/* Horizontal 7-Day Date Strip */}
      <HorizontalDateStrip
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Filter and Overview Bar */}
      <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark">
          <span>Agenda Terjadwal:</span>
          <span className="text-brand-primary dark:text-brand-vibrant font-mono">{filteredSchedules.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-content-mutedLight dark:text-content-mutedDark" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-app-light dark:bg-app-dark/70 px-2.5 sm:px-3 py-1.5 text-xs text-content-primaryLight dark:text-content-primaryDark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Agenda Content: Timeline or Card List */}
      {filteredSchedules.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-8 w-8" />}
          title="Tidak Ada Agenda di Tanggal Ini"
          description="Timeline jadwal Anda masih kosong untuk hari yang dipilih. Tambahkan agenda untuk memulai."
          actionLabel="Tambah Agenda Baru"
          onAction={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
        />
      ) : viewMode === 'timeline' ? (
        <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft w-full overflow-hidden">
          <VerticalTimeline
            schedules={filteredSchedules}
            onToggleComplete={toggleScheduleComplete}
            onEdit={(item) => {
              setEditingItem(item);
              setModalOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="space-y-3 w-full">
          {filteredSchedules.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft transition-all duration-150 flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 w-full ${
                item.completed ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Left Time Column (Compact on Mobile) */}
              <div className="w-14 sm:w-16 flex-shrink-0 text-left sm:text-right pt-1 sm:pt-0">
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

              {/* Task Container */}
              <div className="flex-1 min-w-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill space-y-1.5">
                {/* Top Row: Checkbox + Title + Priority Badge */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleScheduleComplete(item.id)}
                      className="flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary" />
                      )}
                    </button>

                    <h3
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        item.completed
                          ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                          : 'text-content-primaryLight dark:text-content-primaryDark'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex-shrink-0">
                    {priorityBadges[item.priority]}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed pl-6 sm:pl-7 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Bottom Row: Category + Location */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5 pl-6 sm:pl-7">
                  <Badge variant="default" size="sm">
                    {categoryLabels[item.category] || item.category}
                  </Badge>

                  {item.locationOrLink && (
                    <div className="text-xs text-brand-primary dark:text-brand-vibrant flex items-center gap-1 font-medium truncate max-w-[180px] sm:max-w-xs">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {item.locationOrLink.startsWith('http') ? (
                        <a
                          href={item.locationOrLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-0.5 truncate"
                        >
                          <span className="truncate">Meeting Online</span>
                          <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="truncate">{item.locationOrLink}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-1 flex-shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                  title="Edit Agenda"
                >
                  <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-1.5 sm:p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Agenda"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingItem}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteSchedule(deleteTargetId);
        }}
        title="Hapus Agenda?"
        message="Agenda ini akan dihapus secara permanen dari timeline jadwal Anda."
      />
    </div>
  );
}
