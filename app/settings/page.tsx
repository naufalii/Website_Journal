'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Database,
  User,
  LogOut,
  LogIn,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import Link from 'next/link';

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

  const { user, signOut, isConfigured } = useAuth();

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
          <span>Pengaturan & Sinkronisasi Cloud</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola akun Supabase, status sinkronisasi multi-device, dan cadangan data Anda.
        </p>
      </div>

      {/* Supabase Account & Connection Status Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Koneksi Supabase Cloud
              </h3>
              <p className="text-xs text-slate-400">Database PostgreSQL & Row Level Security (RLS)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Terkonfigurasi</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 text-xs font-semibold">
                <Key className="h-3.5 w-3.5 text-amber-500" />
                <span>Belum Terhubung</span>
              </span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {user?.email ? user.email[0].toUpperCase() : <User className="h-5 w-5" />}
            </div>
            <div>
              {user ? (
                <>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Sinkronisasi Laptop & HP Aktif (User ID: {user.id.slice(0, 8)}...)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Belum Masuk / Mode Offline
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Masuk ke akun Anda untuk menyinkronkan data antar-perangkat.
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar (Logout)</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login / Registrasi</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Storage Breakdown Summary */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ringkasan Data Tersimpan</h3>
            <p className="text-xs text-slate-400">Jumlah item terdaftar di workspace Anda</p>
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
                Export Cadangan (.json)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unduh seluruh target, jadwal, kursus, catatan, dan berkas ke dalam satu file backup <strong>.json</strong>.
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
              Pulihkan data workspace Anda dari file cadangan <strong>.json</strong> sebelumnya.
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
          Tindakan ini akan mengosongkan seluruh data Anda (Goals, Jadwal, Kursus, Catatan, dan Berkas). Pastikan Anda telah melakukan ekspor backup jika masih membutuhkannya.
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
        message="PERINGATAN: Semua target, jadwal, kursus, catatan, dan berkas di brankas akan dihapus bersih seketika. Apakah Anda yakin?"
        confirmLabel="Ya, Hapus Semua Data"
        variant="danger"
      />
    </div>
  );
}
