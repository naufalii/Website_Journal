'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { VaultItem } from '@/lib/types';
import { getFileFromVault } from '@/lib/storage';
import { Download, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FilePreviewModalProps {
  item: VaultItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreviewModal({ item, isOpen, onClose }: FilePreviewModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentObjectUrl: string | null = null;

    async function load() {
      if (!item || !isOpen) {
        setPreviewUrl(null);
        return;
      }

      setLoading(true);

      // If item has a cloud URL from Supabase Storage
      if (item.url && item.url.startsWith('http')) {
        setPreviewUrl(item.url);
        setFileType(item.fileType || '');
        setLoading(false);
        return;
      }

      // If item is in local IndexedDB
      if (item.fileId) {
        try {
          const stored = await getFileFromVault(item.fileId);
          if (stored && stored.data) {
            const blob =
              stored.data instanceof Blob
                ? stored.data
                : new Blob([stored.data], { type: stored.type });
            currentObjectUrl = URL.createObjectURL(blob);
            setPreviewUrl(currentObjectUrl);
            setFileType(stored.type || '');
          } else {
            setPreviewUrl(null);
          }
        } catch (err) {
          console.error('Error loading preview file from IndexedDB:', err);
          setPreviewUrl(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(false);
    }

    load();

    return () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [item, isOpen]);

  if (!item) return null;

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = item.fileName || item.title || 'download';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isImage =
    fileType.startsWith('image/') ||
    Boolean(item.fileName?.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i));

  const isPdf =
    fileType.includes('pdf') ||
    Boolean(item.fileName?.toLowerCase().endsWith('.pdf'));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title}
      description={`Berkas: ${item.fileName || '-'} • Ukuran: ${formatBytes(item.fileSize)}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">
            Memuat file preview...
          </div>
        ) : !previewUrl ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-rose-500 gap-2">
            <AlertCircle className="h-8 w-8" />
            <p className="text-sm font-semibold">File tidak dapat dimuat atau tidak ditemukan.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[500px]">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={item.title}
                className="max-h-[450px] w-auto object-contain rounded-lg p-2"
              />
            ) : isPdf ? (
              <iframe
                src={previewUrl}
                className="w-full h-[450px] border-0"
                title={item.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <FileText className="h-16 w-16 text-emerald-600 mb-3" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Preview langsung tidak tersedia untuk format file ini ({fileType || 'dokumen'}).
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Silakan unduh atau buka berkas melalui tombol di bawah.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
          {previewUrl && (
            <div className="flex items-center gap-2">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              >
                <span>Buka di Tab Baru</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Button size="sm" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                <span>Unduh File</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
