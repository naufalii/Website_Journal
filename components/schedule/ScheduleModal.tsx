'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
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
  const [locationOrLink, setLocationOrLink] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setCategory(initialData.category);
      setPriority(initialData.priority);
      setLocationOrLink(initialData.locationOrLink || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setDate(getLocalDateString());
      setStartTime('09:00');
      setEndTime('10:00');
      setCategory('work');
      setPriority('medium');
      setLocationOrLink('');
      setDescription('');
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
        locationOrLink: locationOrLink.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      addSchedule({
        title: title.trim(),
        date,
        startTime,
        endTime,
        category,
        priority,
        locationOrLink: locationOrLink.trim() || undefined,
        description: description.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Agenda / Jadwal' : 'Tambah Agenda Baru'}
      description="Jadwalkan aktivitas penting dengan alokasi waktu dan skala prioritas."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Aktivitas / Kegiatan"
          placeholder="Contoh: Sprint Planning, Sesi Belajar Algoritma"
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
            label="Waktu Mulai"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Waktu Selesai"
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
            <option value="work">💼 Pekerjaan & Tugas</option>
            <option value="meeting">👥 Meeting & Diskusi</option>
            <option value="study">📚 Belajar & Kuliah</option>
            <option value="health">🏃 Kesehatan & Olahraga</option>
            <option value="personal">✨ Personal</option>
            <option value="other">📦 Lainnya</option>
          </Select>

          <Select
            label="Prioritas"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">🔴 Tinggi (High Priority)</option>
            <option value="medium">🟡 Sedang (Medium Priority)</option>
            <option value="low">🟢 Rendah (Low Priority)</option>
          </Select>
        </div>

        <Input
          label="Lokasi / Link Pertemuan (Opsional)"
          placeholder="Contoh: Zoom, Google Meet, Ruang Meeting A"
          value={locationOrLink}
          onChange={(e) => setLocationOrLink(e.target.value)}
        />

        <Textarea
          label="Catatan Tambahan (Opsional)"
          placeholder="Rincian agenda atau persiapan yang diperlukan..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm">
            {initialData ? 'Simpan Perubahan' : 'Jadwalkan Agenda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
