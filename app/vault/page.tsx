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
  Download,
  ShieldCheck,
  Search,
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
    document: '📄 Dokumen',
    learning: '🎓 Ebook/Belajar',
    certificate: '🏆 Sertifikat',
    work: '💼 Kerja/Proyek',
    finance: '💰 Finansial',
    personal: '🔒 Personal',
    other: '📦 Lainnya',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FolderLock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span>Document & Resource Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Brankas aman untuk menyimpan tautan penting dan file lokal via IndexedDB browser.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="shadow-md shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Resource</span>
        </Button>
      </div>

      {/* Info Banner on IndexedDB security */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white">Penyimpanan Terisolasi & Privat: </span>
          Semua file yang Anda upload disimpan langsung di penyimpanan <strong>IndexedDB browser lokal Anda</strong>, tanpa batasan 5MB LocalStorage dan tidak dikirimkan ke server publik.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama resource, berkas, atau URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'file', label: 'File Lokal (IndexedDB)' },
            { id: 'link', label: 'Link Eksternal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id as typeof typeFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                typeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
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
              : 'Simpan file dokumen penting, sertifikat PDF, atau link referensi Google Drive di sini.'
          }
          actionLabel="Simpan Resource Pertama"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isFile = item.type === 'file';

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  {/* Top Badge & Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      {isFile ? <FileText className="h-3 w-3 text-emerald-600" /> : <LinkIcon className="h-3 w-3 text-blue-500" />}
                      <span>{isFile ? 'File Lokal' : 'External Link'}</span>
                    </span>

                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Resource"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {categoryLabels[item.category] || item.category}
                    </p>
                  </div>

                  {/* Details depending on type */}
                  {isFile ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-semibold truncate">📄 {item.fileName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Ukuran: {formatBytes(item.fileSize)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-blue-600 dark:text-blue-400 truncate">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] text-slate-400">
                    {formatShortDate(item.createdAt.slice(0, 10))}
                  </span>

                  {isFile ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewItem(item)}
                      className="gap-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview & Unduh</span>
                    </Button>
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
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
        message="Resource ini beserta file yang tersimpan di IndexedDB akan dihapus secara permanen."
      />
    </div>
  );
}
