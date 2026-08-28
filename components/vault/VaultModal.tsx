'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VaultCategory, VaultType } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { Link as LinkIcon, Upload, ShieldCheck } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const { addVaultLink, addVaultFile } = useApp();

  const [type, setType] = useState<VaultType>('link');
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
    setIsSubmitting(false);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Dokumen / Resource ke Vault"
      description="Simpan link penting atau simpan file lokal ke IndexedDB dengan aman tanpa batasan LocalStorage."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <button
            type="button"
            onClick={() => setType('link')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              type === 'link'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Tautan / URL Eksternal</span>
          </button>
          <button
            type="button"
            onClick={() => setType('file')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              type === 'file'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Berkas Lokal (IndexedDB)</span>
          </button>
        </div>

        <Input
          label="Judul Resource"
          placeholder="Contoh: Salinan Polis Asuransi, Repository Template, Sertifikat AWS"
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
          <option value="document">📄 Dokumen & Surat</option>
          <option value="learning">🎓 Ebook & Bahan Belajar</option>
          <option value="certificate">🏆 Sertifikat & Portofolio</option>
          <option value="work">💼 Pekerjaan & Proyek</option>
          <option value="finance">💰 Keuangan & Bukti Bayar</option>
          <option value="personal">🔒 Dokumen Personal</option>
          <option value="other">📦 Lainnya</option>
        </Select>

        {type === 'link' ? (
          <Input
            label="URL / Link Eksternal"
            type="url"
            placeholder="https://drive.google.com/... atau https://github.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        ) : (
          <div className="space-y-2 p-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Penyimpanan Aman di IndexedDB Browser</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              File Anda disimpan langsung di browser Anda secara privat dan tidak diunggah ke server mana pun.
            </p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer pt-2"
              required
            />
            {file && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                File terpilih: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Resource'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
