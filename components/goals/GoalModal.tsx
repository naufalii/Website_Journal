'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Goal, GoalCategory } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Goal | null;
}

export function GoalModal({ isOpen, onClose, initialData }: GoalModalProps) {
  const { addGoal, updateGoal } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('career');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
    } else {
      setTitle('');
      setCategory('career');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData) {
      updateGoal(initialData.id, {
        title: title.trim(),
        category,
      });
    } else {
      addGoal({
        title: title.trim(),
        category,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Target Harian' : 'Tambah Target Harian'}
      description="Tentukan kebiasaan harian atau target yang ingin Anda selesaikan secara konsisten."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Target / Kebiasaan"
          placeholder="Contoh: Belajar Next.js 1 Jam, Olahraga Pagi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value as GoalCategory)}
        >
          <option value="career">Karir & Profesional</option>
          <option value="learning">Belajar & Skill</option>
          <option value="health">Kesehatan & Kebugaran</option>
          <option value="finance">Finansial & Investasi</option>
          <option value="personal">Personal & Hobi</option>
          <option value="general">Umum</option>
        </Select>

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" size="sm" className="shadow-glow">
            {initialData ? 'Simpan Perubahan' : 'Tambah Target'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
