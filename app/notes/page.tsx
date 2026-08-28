'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Edit2,
  Trash2,
  Tag,
  Eye,
} from 'lucide-react';
import { Note } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoteModal } from '@/components/notes/NoteModal';
import { NotePreviewModal } from '@/components/notes/NotePreviewModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function NotesPage() {
  const { notes, togglePinNote, deleteNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(notes.map((n) => n.category)))];

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || note.category === selectedCategory;

    return matchSearch && matchCategory;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
            <span>Catatan & Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Simpan ide kilat, ringkasan materi, checklist, dan dokumentasi Markdown.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
          className="shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span>Tulis Catatan</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
          <input
            type="text"
            placeholder="Cari judul, konten, atau tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-soft"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="Tidak Ada Catatan yang Ditemukan"
          description={
            searchQuery
              ? `Tidak ditemukan catatan yang sesuai dengan kata kunci "${searchQuery}".`
              : 'Belum ada catatan yang ditulis. Tuangkan ide, ringkasan, dan draf kode Anda.'
          }
          actionLabel="Tulis Catatan Pertama"
          onAction={() => {
            setEditingNote(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setPreviewNote(note)}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 cursor-pointer group ${
                note.isPinned
                  ? 'bg-surface-light dark:bg-surface-dark border-amber-400/40 shadow-soft'
                  : 'bg-surface-light dark:bg-surface-dark border-slate-100 dark:border-white/5 shadow-soft hover:border-brand-primary/30'
              }`}
            >
              <div className="space-y-2.5">
                {/* Header: Title & Pin */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark line-clamp-1 group-hover:text-brand-primary dark:group-hover:text-brand-vibrant transition-colors">
                    {note.title}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinNote(note.id);
                    }}
                    className={`p-1.5 rounded-xl transition-colors ${
                      note.isPinned
                        ? 'text-amber-400 fill-amber-400 bg-amber-400/10'
                        : 'text-content-mutedLight dark:text-content-mutedDark hover:text-amber-400 hover:bg-amber-400/10'
                    }`}
                    title={note.isPinned ? 'Lepas Semat' : 'Sematkan di Atas'}
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                </div>

                {/* Content preview */}
                <p className="text-xs text-content-mutedLight dark:text-content-mutedDark whitespace-pre-line line-clamp-4 leading-relaxed font-mono">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark font-medium"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer info & actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-content-mutedLight dark:text-content-mutedDark">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">
                    {note.category}
                  </Badge>
                  <span className="text-[10px]">{formatShortDate(note.updatedAt.slice(0, 10))}</span>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setPreviewNote(note)}
                    className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-cyan hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                    title="Pratinjau Markdown"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-surface-lightPill dark:hover:bg-surface-darkPill transition-colors"
                    title="Edit Catatan"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(note.id)}
                    className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal (Markdown Editor) */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingNote}
      />

      {/* Note Preview Modal (Markdown Viewer) */}
      <NotePreviewModal
        note={previewNote}
        isOpen={!!previewNote}
        onClose={() => setPreviewNote(null)}
        onEdit={(note) => {
          setEditingNote(note);
          setModalOpen(true);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteNote(deleteTargetId);
        }}
        title="Hapus Catatan?"
        message="Catatan ini akan dihapus secara permanen dari ruang kerja Anda."
      />
    </div>
  );
}
