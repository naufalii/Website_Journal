'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ScheduleItem, ScheduleCategory, Priority } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { getLocalDateString } from '@/lib/utils';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ScheduleItem | null;
}

export function ScheduleModal({ isOpen, onClose, initialData }: ScheduleModalProps) {
  const { addSchedule, updateSchedule } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<ScheduleCategory>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [locationOrLink, setLocationOrLink] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setCategory(initialData.category);
      setPriority(initialData.priority);
      setDescription(initialData.description || '');
      setLocationOrLink(initialData.locationOrLink || '');
    } else {
      setTitle('');
      setDate(getLocalDateString());
      setStartTime('09:00');
      setEndTime('10:00');
      setCategory('work');
      setPriority('medium');
      setDescription('');
      setLocationOrLink('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData) {
      updateSchedule(initialData.id, {
        title: title.trim(),
        date,
        startTime,
        endTime,
        category,
        priority,
        description: description.trim() || undefined,
        locationOrLink: locationOrLink.trim() || undefined,
      });
    } else {
      addSchedule({
        title: title.trim(),
        date,
        startTime,
        endTime,
        category,
        priority,
        description: description.trim() || undefined,
        locationOrLink: locationOrLink.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Agenda' : 'Tambah Agenda Baru'}
      description="Rencanakan aktivitas harian, alokasi waktu, dan jadwal pertemuan."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Aktivitas / Agenda"
          placeholder="Contoh: Meeting Proyek, Review Laporan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            type="date"
            label="Tanggal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Jam Mulai"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Jam Selesai"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
          >
            <option value="work">Kerja / Tugas</option>
            <option value="meeting">Meeting / Diskusi</option>
            <option value="study">Belajar / Kuliah</option>
            <option value="health">Kesehatan & Olahraga</option>
            <option value="personal">Personal</option>
            <option value="other">Lainnya</option>
          </Select>

          <Select
            label="Prioritas"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
        </div>

        <Input
          label="Lokasi atau Tautan Pertemuan (Opsional)"
          placeholder="Contoh: Ruang Rapat A, atau https://meet.google.com/..."
          value={locationOrLink}
          onChange={(e) => setLocationOrLink(e.target.value)}
        />

        <Textarea
          label="Deskripsi / Catatan Tambahan (Opsional)"
          placeholder="Tuliskan detail agenda atau poin pembahasan..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="shadow-glow">
            {initialData ? 'Simpan Perubahan' : 'Tambah Agenda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
