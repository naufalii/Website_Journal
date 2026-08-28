'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Course, CourseStatus } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Course | null;
}

export function CourseModal({ isOpen, onClose, initialData }: CourseModalProps) {
  const { addCourse, updateCourse } = useApp();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [totalModules, setTotalModules] = useState(10);
  const [completedModules, setCompletedModules] = useState(0);
  const [status, setStatus] = useState<CourseStatus>('in_progress');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPlatform(initialData.platform);
      setUrl(initialData.url || '');
      setTargetDate(initialData.targetDate || '');
      setTotalModules(initialData.totalModules);
      setCompletedModules(initialData.completedModules);
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setPlatform('');
      setUrl('');
      setTargetDate('');
      setTotalModules(10);
      setCompletedModules(0);
      setStatus('in_progress');
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !platform.trim()) return;

    const total = Math.max(1, Number(totalModules) || 1);
    const completed = Math.max(0, Math.min(Number(completedModules) || 0, total));

    if (initialData) {
      updateCourse(initialData.id, {
        title: title.trim(),
        platform: platform.trim(),
        url: url.trim() || undefined,
        targetDate: targetDate || undefined,
        totalModules: total,
        completedModules: completed,
        status,
        notes: notes.trim() || undefined,
      });
    } else {
      addCourse({
        title: title.trim(),
        platform: platform.trim(),
        url: url.trim() || undefined,
        targetDate: targetDate || undefined,
        totalModules: total,
        completedModules: completed,
        status,
        notes: notes.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Kursus / Materi Belajar' : 'Tambah Kursus / Skill Baru'}
      description="Kelola progres belajar, materi, modul, dan link materi online."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Kursus / Topik Keahlian"
          placeholder="Contoh: Complete Web Development Bootcamp, UI/UX Design Figma"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Platform / Lembaga"
            placeholder="Contoh: Coursera, Udemy, YouTube, Dicoding"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />
          <Input
            label="Target Selesai (Opsional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <Input
          label="Link Kursus (URL)"
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Total Modul/Bab"
            type="number"
            min="1"
            value={totalModules}
            onChange={(e) => setTotalModules(Math.max(1, Number(e.target.value)))}
            required
          />
          <Input
            label="Modul Diselesaikan"
            type="number"
            min="0"
            max={totalModules}
            value={completedModules}
            onChange={(e) => setCompletedModules(Number(e.target.value))}
            required
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as CourseStatus)}
          >
            <option value="in_progress">Sedang Berjalan ⚡</option>
            <option value="completed">Telah Selesai 🎓</option>
            <option value="planned">Rencana Belajar 📌</option>
          </Select>
        </div>

        <Textarea
          label="Catatan Belajar / Silabus (Opsional)"
          placeholder="Catatan penting, link repositori latihan, atau ringkasan..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm">
            {initialData ? 'Simpan Perubahan' : 'Daftarkan Kursus'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
