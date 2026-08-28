'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Tag,
  Edit2,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';
import { Note, NoteCategory } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoteModal } from '@/components/notes/NoteModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function NotesPage() {
  const { notes, togglePinNote, deleteNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter notes
  const filteredNotes = notes
    .filter((note) => {
      // Category filter
      if (selectedCategory !== 'all' && note.category !== selectedCategory) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTags = note.tags?.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesTags;
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned first, then newest updated
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const categories = [
    { id: 'all', label: 'Semua Catatan' },
    { id: 'idea', label: '💡 Ide & Konsep' },
    { id: 'learning', label: '📚 Belajar' },
    { id: 'project', label: '🚀 Proyek' },
    { id: 'work', label: '💼 Pekerjaan' },
    { id: 'personal', label: '🔒 Personal' },
    { id: 'general', label: '📝 Umum' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-amber-500" />
            <span>Quick Notes & Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simpan ide, draft artikel, dokumentasi sintaks, dan ringkasan pengetahuan penting.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
          className="shadow-md shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tulis Catatan</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul, kata kunci konten, atau tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notes Masonry / Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="Tidak Ada Catatan yang Ditemukan"
          description={
            searchQuery
              ? `Tidak ditemukan catatan yang cocok dengan pencarian "${searchQuery}".`
              : 'Belum ada catatan di modul ini. Tulis ide atau dokumentasi pertama Anda.'
          }
          actionLabel="Tulis Catatan Baru"
          onAction={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 hover:shadow-sm ${
                note.isPinned
                  ? 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-300/80 dark:border-amber-800/50 ring-1 ring-amber-400/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                {/* Header: Title & Pin/Edit/Delete */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePinNote(note.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.isPinned
                          ? 'text-amber-500 bg-amber-100 dark:bg-amber-950/60'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100'
                      }`}
                      title={note.isPinned ? 'Lepas Pin' : 'Pin Catatan ke Atas'}
                    >
                      <Pin
                        className={`h-3.5 w-3.5 ${
                          note.isPinned ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Catatan"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(note.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-6 leading-relaxed">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <Badge variant="amber" size="sm">
                  {note.category}
                </Badge>
                <span>Update: {formatShortDate(note.updatedAt.slice(0, 10))}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingNote}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteNote(deleteTargetId);
        }}
        title="Hapus Catatan?"
        message="Catatan ini akan dihapus secara permanen dari Knowledge Base Anda."
      />
    </div>
  );
}
