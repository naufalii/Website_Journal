'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VaultCategory } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const { addVaultLink, addVaultFile } = useApp();

  const [type, setType] = useState<'link' | 'file'>('file');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultCategory>('document');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setFile(null);
    setCategory('document');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (type === 'link') {
        if (!url.trim()) return;
        addVaultLink({
          title: title.trim(),
          category,
          url: url.trim(),
          tags: [],
        });
      } else {
        if (!file) return;
        await addVaultFile(
          {
            title: title.trim(),
            category,
            tags: [],
          },
          file
        );
      }
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Simpan ke Resource Vault"
      description="Simpan berkas dokumen, sertifikat, atau tautan referensi penting."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill">
          <button
            type="button"
            onClick={() => setType('file')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              type === 'file'
                ? 'bg-surface-light dark:bg-surface-dark text-brand-primary dark:text-brand-vibrant shadow-soft'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Berkas File</span>
          </button>
          <button
            type="button"
            onClick={() => setType('link')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              type === 'link'
                ? 'bg-surface-light dark:bg-surface-dark text-brand-primary dark:text-brand-vibrant shadow-soft'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Tautan Link</span>
          </button>
        </div>

        <Input
          label="Nama Dokumen / Resource"
          placeholder="Contoh: Salinan KTP, Ijazah, Link Drive Materi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value as VaultCategory)}
        >
          <option value="document">Dokumen / Surat Resmi</option>
          <option value="learning">Pembelajaran & Ebook</option>
          <option value="certificate">Sertifikat & Piagam</option>
          <option value="work">Pekerjaan & Proyek</option>
          <option value="finance">Finansial & Tagihan</option>
          <option value="personal">Personal / Pribadi</option>
          <option value="other">Lainnya</option>
        </Select>

        {type === 'link' ? (
          <Input
            label="URL / Tautan Link"
            type="url"
            placeholder="https://drive.google.com/... atau https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        ) : (
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark">
              Pilih Berkas File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-content-mutedLight dark:text-content-mutedDark file:mr-4 file:py-2.5 file:px-4 file:rounded-2xl file:border-0 file:text-xs file:font-bold file:bg-brand-primary/10 file:text-brand-primary dark:file:text-brand-vibrant hover:file:bg-brand-primary/20 cursor-pointer"
              required
            />
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting} className="shadow-glow">
            {isSubmitting ? 'Mengunggah...' : 'Simpan Resource'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
