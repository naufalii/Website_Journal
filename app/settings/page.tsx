'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function SettingsPage() {
  const {
    goals,
    schedules,
    courses,
    notes,
    vault,
    handleExport,
    handleImport,
    clearAllData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const onExportClick = async () => {
    setIsExporting(true);
    try {
      await handleExport();
    } finally {
      setIsExporting(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await handleImport(file);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const totalVaultFiles = vault.filter((v) => v.type === 'file').length;

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          <span>Pengaturan & Manajemen Data</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kontrol penuh atas data produktivitas Anda: Ekspor backup, restore cadangan, dan ringkasan penyimpanan.
        </p>
      </div>

      {/* Storage Breakdown Summary */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status Penyimpanan Data</h3>
            <p className="text-xs text-slate-400">Penyimpanan client-side (LocalStorage & IndexedDB)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold">Daily Goals</span>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {goals.length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold">Agenda/Jadwal</span>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {schedules.length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold">Courses</span>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {courses.length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-semibold">Catatan</span>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {notes.length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-semibold">Resource Vault</span>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {vault.length} <span className="text-xs text-emerald-600 font-normal">({totalVaultFiles} file)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Backup & Restore Action Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Download className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Export / Cadangkan Data
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unduh seluruh data Anda (target, jadwal, kursus, catatan, serta seluruh file di vault) ke dalam satu file berkas <strong>.json</strong> terstruktur.
            </p>
          </div>

          <Button
            onClick={onExportClick}
            disabled={isExporting}
            className="w-full gap-2 text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Membuat Cadangan...' : 'Download File Backup (.json)'}</span>
          </Button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Upload className="h-5 w-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Import / Pulihkan Data
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pulihkan data workspace Anda dari file cadangan <strong>.json</strong> sebelumnya. Seluruh teks dan file IndexedDB akan dipulihkan secara otomatis.
            </p>
          </div>

          <div className="w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="w-full gap-2 text-xs font-bold border-slate-300 dark:border-slate-700"
            >
              <Upload className="h-4 w-4 text-blue-600" />
              <span>{isImporting ? 'Memulihkan Data...' : 'Pilih File Backup (.json)'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear all data */}
      <div className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-sm font-bold">Zona Bahaya: Reset Workspace</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Tindakan ini akan menghapus seluruh data yang tersimpan di browser Anda (Goals, Jadwal, Kursus, Catatan, dan Berkas Vault). Pastikan Anda telah melakukan ekspor backup jika masih membutuhkannya.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2 text-xs font-bold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Kosongkan Seluruh Data Workspace</span>
          </Button>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={clearAllData}
        title="Reset Seluruh Data Workspace?"
        message="PERINGATAN: Semua target, jadwal, kursus, catatan, dan berkas di brankas akan dihapus bersih seketika dari browser ini. Apakah Anda yakin?"
        confirmLabel="Ya, Hapus Semua Data"
        variant="danger"
      />
    </div>
  );
}
