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
import { ScheduleItem, Priority, ScheduleCategory } from '@/lib/types';
import { getLocalDateString, formatDateIndo, formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScheduleModal } from '@/components/schedule/ScheduleModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SchedulePage() {
  const { schedules, toggleScheduleComplete, deleteSchedule } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'week' | 'all'>('today');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const todayStr = getLocalDateString();
  
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrowDate);

  const nextWeekDate = new Date();
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  const nextWeekStr = getLocalDateString(nextWeekDate);

  // Filter schedules
  const filteredSchedules = schedules.filter((item) => {
    // Date filter
    if (dateFilter === 'today' && item.date !== todayStr) return false;
    if (dateFilter === 'tomorrow' && item.date !== tomorrowStr) return false;
    if (dateFilter === 'week' && (item.date < todayStr || item.date > nextWeekStr)) return false;

    // Priority filter
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

    return true;
  }).sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.startTime.localeCompare(b.startTime);
  });

  const priorityBadges = {
    high: <Badge variant="danger">🔴 High</Badge>,
    medium: <Badge variant="warning">🟡 Medium</Badge>,
    low: <Badge variant="success">🟢 Low</Badge>,
  };

  const categoryLabels: Record<string, string> = {
    work: '💼 Kerja',
    meeting: '👥 Meeting',
    study: '📚 Belajar',
    health: '🏃 Kesehatan',
    personal: '✨ Personal',
    other: '📦 Lainnya',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Jadwal & Agenda Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rencanakan timeline aktivitas, pertemuan, dan alokasi waktu produktif.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="shadow-md shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Agenda</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Date Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'tomorrow', label: 'Besok' },
            { id: 'week', label: '7 Hari ke Depan' },
            { id: 'all', label: 'Semua Jadwal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id as typeof dateFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                dateFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
          title="Tidak Ada Agenda yang Sesuai"
          description={
            dateFilter === 'today'
              ? 'Agenda untuk hari ini belum ada. Tambahkan aktivitas baru Anda.'
              : 'Tidak ditemukan jadwal untuk filter ini. Silakan buat agenda baru.'
          }
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
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.completed
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleScheduleComplete(item.id)}
                  className="mt-0.5 flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                  )}
                </button>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-sm font-bold truncate ${
                        item.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="default" size="sm">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                      {priorityBadges[item.priority]}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CalendarIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {formatShortDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.locationOrLink && (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.locationOrLink.startsWith('http') ? (
                          <a
                            href={item.locationOrLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            Link Pertemuan <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          item.locationOrLink
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit Agenda"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
