'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FolderLock,
  Plus,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Eye,
  Trash2,
  Search,
  Lock,
} from 'lucide-react';
import { VaultItem, VaultCategory, VaultType } from '@/lib/types';
import { formatBytes, formatShortDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { VaultModal } from '@/components/vault/VaultModal';
import { FilePreviewModal } from '@/components/vault/FilePreviewModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function VaultPage() {
  const { vault, deleteVaultItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | VaultType>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<VaultItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredItems = vault.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.fileName?.toLowerCase().includes(q) ||
        item.url?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryLabels: Record<VaultCategory, string> = {
    document: 'Dokumen',
    learning: 'Ebook / Materi',
    certificate: 'Sertifikat',
    work: 'Pekerjaan',
    finance: 'Finansial',
    personal: 'Personal',
    other: 'Lainnya',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
            <FolderLock className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
            <span>Document & Resource Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
            Brankas aman untuk mengelola berkas dokumen, sertifikat, dan tautan penting Anda.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Resource</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-content-mutedLight dark:text-content-mutedDark" />
          <input
            type="text"
            placeholder="Cari nama resource, berkas, atau URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-soft"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'file', label: 'Berkas Dokumen' },
            { id: 'link', label: 'Tautan Link' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as typeof typeFilter)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                typeFilter === tab.id
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vault Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<FolderLock className="h-8 w-8" />}
          title="Brankas Masih Kosong"
          description={
            searchQuery
              ? `Tidak ditemukan resource dengan kata kunci "${searchQuery}".`
              : 'Simpan file dokumen penting, sertifikat PDF, atau link referensi Anda di sini.'
          }
          actionLabel="Simpan Resource Pertama"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isFile = item.type === 'file';

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex flex-col justify-between space-y-4 hover:border-brand-primary/20 transition-all"
              >
                <div className="space-y-3">
                  {/* Top Badge & Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={isFile ? 'primary' : 'cyan'} size="sm">
                      {isFile ? 'Berkas Dokumen' : 'Tautan Link'}
                    </Badge>

                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Hapus Resource"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark mt-1">
                      {categoryLabels[item.category] || item.category}
                    </p>
                  </div>

                  {/* Details depending on type */}
                  {isFile ? (
                    <div className="p-3 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-xs text-content-primaryLight dark:text-content-primaryDark space-y-1">
                      <p className="font-bold truncate">📄 {item.fileName}</p>
                      <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-mono">
                        Ukuran: {formatBytes(item.fileSize)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-xs text-brand-primary dark:text-brand-vibrant truncate">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1.5 font-bold"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] text-content-mutedLight dark:text-content-mutedDark">
                    {formatShortDate(item.createdAt.slice(0, 10))}
                  </span>

                  {isFile ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewItem(item)}
                      className="gap-1.5 text-xs font-bold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview & Unduh</span>
                    </Button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-lightPill dark:bg-surface-darkPill hover:bg-slate-200 dark:hover:bg-slate-700/60 text-content-primaryLight dark:text-content-primaryDark text-xs font-bold transition-colors"
                    >
                      <span>Buka URL</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vault Modal */}
      <VaultModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* File Preview Modal */}
      <FilePreviewModal
        item={previewItem}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={async () => {
          if (deleteTargetId) await deleteVaultItem(deleteTargetId);
        }}
        title="Hapus Dokumen / Resource?"
        message="Resource ini beserta file yang tersimpan akan dihapus secara permanen."
      />
    </div>
  );
}
