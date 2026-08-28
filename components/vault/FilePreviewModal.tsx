'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { VaultItem } from '@/lib/types';
import { getFileFromVault } from '@/lib/storage';
import { formatBytes, formatShortDate } from '@/lib/utils';
import { Download, FileText, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface FilePreviewModalProps {
  item: VaultItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreviewModal({ item, isOpen, onClose }: FilePreviewModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let activeUrl: string | null = null;

    const loadFile = async () => {
      if (!item || item.type !== 'file') return;

      // If item has a cloud public URL (Supabase Storage), use it directly
      if (item.url && item.url.startsWith('http')) {
        setFileUrl(item.url);
        return;
      }

      setLoading(true);
      try {
        if (item.fileId) {
          const stored = await getFileFromVault(item.fileId);
          if (stored && stored.data) {
            const blob = stored.data instanceof Blob ? stored.data : new Blob([stored.data], { type: stored.type });
            activeUrl = URL.createObjectURL(blob);
            setFileUrl(activeUrl);
          }
        }
      } catch (err) {
        console.error('Failed to load file from storage:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && item) {
      loadFile();
    } else {
      setFileUrl(null);
    }

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [item, isOpen]);

  if (!item) return null;

  const isImage = item.fileType?.startsWith('image/');
  const isPdf = item.fileType === 'application/pdf';

  const handleDownload = () => {
    if (!fileUrl && !item.url) return;
    const downloadUrl = fileUrl || item.url;
    if (!downloadUrl) return;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = item.fileName || item.title;
    if (downloadUrl.startsWith('http')) {
      a.target = '_blank';
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.title}
      description={`Tipe: ${item.fileType || 'Berkas'} | Ukuran: ${formatBytes(item.fileSize)}`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Preview Area */}
        <div className="min-h-[220px] max-h-[420px] rounded-3xl bg-app-light dark:bg-app-dark/70 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden p-4 relative">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-content-mutedLight dark:text-content-mutedDark">
              <Loader2 className="h-7 w-7 animate-spin text-brand-primary dark:text-brand-vibrant" />
              <p className="text-xs font-bold">Memuat berkas...</p>
            </div>
          ) : isImage && fileUrl ? (
            <img
              src={fileUrl}
              alt={item.title}
              className="max-h-[380px] max-w-full object-contain rounded-2xl shadow-sm"
            />
          ) : isPdf && fileUrl ? (
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-3xl bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant flex items-center justify-center mx-auto shadow-soft">
                <FileText className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark max-w-xs truncate mx-auto">
                {item.fileName}
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-primary text-white text-xs font-bold shadow-soft hover:shadow-glow transition-all"
              >
                <span>Buka PDF di Tab Baru</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-3xl bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mx-auto shadow-soft">
                <FileText className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark">{item.fileName}</p>
              <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark">
                Pratinjau langsung tidak tersedia untuk format berkas ini.
              </p>
            </div>
          )}
        </div>

        {/* File Meta Breakdown */}
        <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Kategori</p>
            <Badge variant="primary" size="sm">
              {item.category}
            </Badge>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Diunggah</p>
            <p className="font-mono text-content-primaryLight dark:text-content-primaryDark font-bold">
              {formatShortDate(item.createdAt.slice(0, 10))}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!fileUrl && !item.url}
            className="gap-2 shadow-glow"
          >
            <Download className="h-4 w-4" />
            <span>Unduh Berkas</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
