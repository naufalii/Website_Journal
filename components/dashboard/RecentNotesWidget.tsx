'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { FileText, Pin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatShortDate } from '@/lib/utils';
import Link from 'next/link';

export function RecentNotesWidget() {
  const { notes, openQuickAction } = useApp();

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-cyan">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Catatan & Ide Cepat
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">
              {notes.length} catatan tersimpan
            </p>
          </div>
        </div>

        <Link
          href="/notes"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
        >
          <span>Buka Notes</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="Belum Ada Catatan"
          description="Tulis ide cepat, catatan ringkasan, atau referensi penting Anda."
          actionLabel="Tulis Catatan"
          onAction={() => openQuickAction('note')}
          className="py-6 border-0 bg-transparent"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {sortedNotes.slice(0, 4).map((note) => (
            <Link
              key={note.id}
              href="/notes"
              className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark line-clamp-1">
                    {note.title}
                  </h4>
                  {note.isPinned && (
                    <Pin className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-content-mutedLight dark:text-content-mutedDark line-clamp-2 leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5 text-[10px] text-content-mutedLight dark:text-content-mutedDark">
                <Badge variant="cyan" size="sm">
                  {note.category}
                </Badge>
                <span>{formatShortDate(note.updatedAt.slice(0, 10))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
