'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Note, NoteCategory } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Note | null;
}

export function NoteModal({ isOpen, onClose, initialData }: NoteModalProps) {
  const { addNote, updateNote } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('idea');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setCategory(initialData.category);
      setTags(initialData.tags.join(', '));
      setIsPinned(initialData.isPinned);
    } else {
      setTitle('');
      setContent('');
      setCategory('idea');
      setTags('');
      setIsPinned(false);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (initialData) {
      updateNote(initialData.id, {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagsArray,
        isPinned,
      });
    } else {
      addNote({
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagsArray,
        isPinned,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Catatan' : 'Tulis Catatan Baru'}
      description="Simpan ide, materi belajar, atau ringkasan penting."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Catatan"
          placeholder="Contoh: Arsitektur Next.js, Ringkasan Buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value as NoteCategory)}
          >
            <option value="idea">💡 Ide & Konsep</option>
            <option value="learning">📚 Belajar & Ringkasan</option>
            <option value="project">🚀 Proyek & Rencana</option>
            <option value="work">💼 Pekerjaan</option>
            <option value="personal">🔒 Personal</option>
            <option value="general">📝 Umum</option>
          </Select>

          <Input
            label="Tags (Pisahkan koma)"
            placeholder="react, tailwind, ui"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <Textarea
          label="Isi Catatan"
          placeholder="Tuliskan isi catatan, poin penting, atau draf ide..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
          />
          <label htmlFor="isPinned" className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark cursor-pointer">
            📌 Sematkan catatan ini di posisi teratas
          </label>
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="shadow-glow">
            {initialData ? 'Simpan Perubahan' : 'Simpan Catatan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
