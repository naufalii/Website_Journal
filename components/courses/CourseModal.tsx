'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [totalModules, setTotalModules] = useState(10);
  const [completedModules, setCompletedModules] = useState(0);
  const [status, setStatus] = useState<CourseStatus>('in_progress');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPlatform(initialData.platform);
      setNotes(initialData.notes || '');
      setUrl(initialData.url || '');
      setTargetDate(initialData.targetDate || '');
      setTotalModules(initialData.totalModules);
      setCompletedModules(initialData.completedModules);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setPlatform('');
      setNotes('');
      setUrl('');
      setTargetDate('');
      setTotalModules(10);
      setCompletedModules(0);
      setStatus('in_progress');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !platform.trim()) return;

    const payload = {
      title: title.trim(),
      platform: platform.trim(),
      notes: notes.trim() || undefined,
      url: url.trim() || undefined,
      targetDate: targetDate || undefined,
      totalModules: Math.max(1, Number(totalModules) || 1),
      completedModules: Math.max(0, Number(completedModules) || 0),
      status,
    };

    if (initialData) {
      updateCourse(initialData.id, payload);
    } else {
      addCourse(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Kursus & Skill' : 'Tambah Kursus Baru'}
      description="Kelola materi pembelajaran, platform, target waktu, dan modul belajar."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Judul Kursus / Materi"
          placeholder="Contoh: Mastering Next.js 14 & Tailwind CSS"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Platform / Media"
            placeholder="Contoh: Udemy, Dicoding, YouTube, Coursera"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
          />
          <Input
            label="Catatan / Instruktur (Opsional)"
            placeholder="Contoh: John Doe"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Link Kursus (URL)"
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            label="Target Selesai (Opsional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Total Modul / Bab"
            type="number"
            min="1"
            value={totalModules}
            onChange={(e) => setTotalModules(Number(e.target.value))}
            required
          />
          <Input
            label="Modul Selesai"
            type="number"
            min="0"
            max={totalModules}
            value={completedModules}
            onChange={(e) => setCompletedModules(Number(e.target.value))}
            required
          />
          <Select
            label="Status Pembelajaran"
            value={status}
            onChange={(e) => setStatus(e.target.value as CourseStatus)}
          >
            <option value="in_progress">Sedang Berjalan</option>
            <option value="completed">Selesai</option>
            <option value="planned">Direncanakan</option>
          </Select>
        </div>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="shadow-glow">
            {initialData ? 'Simpan Perubahan' : 'Tambah Kursus'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
