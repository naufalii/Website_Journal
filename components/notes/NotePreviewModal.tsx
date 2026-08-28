'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MarkdownViewer } from './MarkdownViewer';
import { Note } from '@/lib/types';
import { formatShortDate } from '@/lib/utils';
import { Edit2, Tag } from 'lucide-react';

interface NotePreviewModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (note: Note) => void;
}

export function NotePreviewModal({
  note,
  isOpen,
  onClose,
  onEdit,
}: NotePreviewModalProps) {
  if (!note) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note.title}
      description={`Kategori: ${note.category} | Diperbarui: ${formatShortDate(note.updatedAt.slice(0, 10))}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark font-medium"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Formatted Markdown Content */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill border border-slate-200/60 dark:border-white/5 max-h-[420px] overflow-y-auto">
          <MarkdownViewer content={note.content} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Badge variant="cyan" size="sm">
            {note.category}
          </Badge>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(note);
              }}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Catatan</span>
            </Button>
            <Button size="sm" onClick={onClose} className="shadow-glow">
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
