'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';
import { ScheduleItem } from '@/lib/types';
import { getLocalDateString, formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { HorizontalDateStrip } from '@/components/dashboard/HorizontalDateStrip';
import { ScheduleModal } from '@/components/schedule/ScheduleModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SchedulePage() {
  const { schedules, toggleScheduleComplete, deleteSchedule } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
            <span>Jadwal & Agenda Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Rencanakan timeline aktivitas, alokasi waktu, dan pertemuan penting.
          </p>
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

      {/* Horizontal 7-Day Date Strip */}
      <HorizontalDateStrip
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Filter and Overview Bar */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-content-primaryLight dark:text-content-primaryDark">
          <span>Agenda Terjadwal:</span>
          <span className="text-brand-primary dark:text-brand-vibrant font-mono">{filteredSchedules.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-content-mutedLight dark:text-content-mutedDark" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 dark:border-white/10 bg-app-light dark:bg-app-dark/70 px-3 py-1.5 text-xs text-content-primaryLight dark:text-content-primaryDark font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Agenda Timeline List */}
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
      ) : (
        <div className="space-y-3">
          {filteredSchedules.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft transition-all duration-150 flex items-center justify-between gap-4 ${
                item.completed ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Left Time Column */}
              <div className="w-16 sm:w-20 flex-shrink-0 text-left sm:text-right">
                <span className="font-mono text-xs sm:text-sm font-black text-content-primaryLight dark:text-content-primaryDark">
                  {item.startTime}
                </span>
                <p className="font-mono text-[10px] text-content-mutedLight dark:text-content-mutedDark">
                  {item.endTime}
                </p>
              </div>

              {/* Center Dot Indicator */}
              <div className="hidden sm:flex flex-col items-center self-stretch justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-cyan shadow-glow flex-shrink-0" />
                <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1" />
              </div>

              {/* Task Pill Container */}
              <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleScheduleComplete(item.id)}
                    className="mt-0.5 sm:mt-0 flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary" />
                    )}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          item.completed
                            ? 'line-through text-content-mutedLight dark:text-content-mutedDark'
                            : 'text-content-primaryLight dark:text-content-primaryDark'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <Badge variant="default" size="sm">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                      {priorityBadges[item.priority]}
                    </div>

                    {item.description && (
                      <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.locationOrLink && (
                      <div className="text-[11px] text-brand-primary dark:text-brand-vibrant flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.locationOrLink.startsWith('http') ? (
                          <a
                            href={item.locationOrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 font-bold"
                          >
                            <span>Link Meeting</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span>{item.locationOrLink}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                  title="Edit Agenda"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-2 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Agenda"
                >
                  <Trash2 className="h-4 w-4" />
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
