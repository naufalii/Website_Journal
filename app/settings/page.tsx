'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Sun,
  Moon,
  LogOut,
  LogIn,
  AlertTriangle,
  User,
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

  const { user, signOut } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();

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
  const userName = user?.email ? user.email.split('@')[0] : 'Pengguna';

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
          <span>Pengaturan & Preferensi</span>
        </h1>
        <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
          Kelola profil akun, tampilan tema, serta cadangan data ruang kerja Anda.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-brand-primary via-brand-vibrant to-brand-cyan text-white flex items-center justify-center font-black text-xl shadow-glow">
              {userName[0].toUpperCase()}
            </div>
            <div>
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-content-primaryLight dark:text-content-primaryDark capitalize">
                      {userName}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Akun Aktif</span>
                    </span>
                  </div>
                  <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
                    {user.email}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-content-primaryLight dark:text-content-primaryDark">
                    Mode Tamu / Offline
                  </h3>
                  <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
                    Masuk ke akun Anda untuk menyinkronkan data antar-perangkat secara otomatis.
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
                className="gap-2 text-rose-500 hover:bg-rose-500/10 border-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar (Logout)</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2 shadow-glow">
                  <LogIn className="h-4 w-4" />
                  <span>Masuk / Daftar Akun</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Theme Switcher Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Tema Tampilan
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
              Pilih mode tampilan gelap (Dark) atau terang (Light) yang nyaman untuk mata Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-brand-primary shadow-soft'
                  : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
              }`}
            >
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-surface-dark text-brand-vibrant shadow-soft border border-white/10'
                  : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryDark'
              }`}
            >
              <Moon className="h-4 w-4 text-brand-vibrant" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Breakdown Summary */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
              Ringkasan Data Tersimpan
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">
              Jumlah data aktif pada workspace Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-center">
            <span className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Target Harian</span>
            <p className="text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-1">
              {goals.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-center">
            <span className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Agenda</span>
            <p className="text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-1">
              {schedules.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-center">
            <span className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Kursus</span>
            <p className="text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-1">
              {courses.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-center">
            <span className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Catatan</span>
            <p className="text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-1">
              {notes.length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-content-mutedLight dark:text-content-mutedDark font-bold">Resource</span>
            <p className="text-xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-1">
              {vault.length} <span className="text-xs text-brand-cyan font-normal">({totalVaultFiles} file)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Backup & Restore Action Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-primary dark:text-brand-vibrant">
              <Download className="h-5 w-5" />
              <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
                Cadangkan Data (.json)
              </h3>
            </div>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed">
              Unduh seluruh target, jadwal, kursus, catatan, dan berkas ke dalam satu berkas cadangan offline.
            </p>
          </div>

          <Button
            onClick={onExportClick}
            disabled={isExporting}
            className="w-full gap-2 text-xs font-bold shadow-soft hover:shadow-glow"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Memproses...' : 'Unduh Berkas Cadangan'}</span>
          </Button>
        </div>

        {/* Import Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-cyan">
              <Upload className="h-5 w-5" />
              <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark">
                Pulihkan Data (.json)
              </h3>
            </div>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed">
              Pulihkan data ruang kerja Anda dari berkas cadangan JSON sebelumnya.
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
              className="w-full gap-2 text-xs font-bold"
            >
              <Upload className="h-4 w-4 text-brand-cyan" />
              <span>{isImporting ? 'Memulihkan...' : 'Pilih Berkas Cadangan'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear all data */}
      <div className="p-6 sm:p-7 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <div className="flex items-center gap-2 text-rose-500">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-sm font-bold">Zona Bahaya: Bersihkan Ruang Kerja</h3>
        </div>
        <p className="text-xs text-content-mutedLight dark:text-content-mutedDark leading-relaxed">
          Tindakan ini akan mengosongkan seluruh target, agenda, kursus, catatan, dan berkas yang tersimpan.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2 text-xs font-bold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Kosongkan Seluruh Data</span>
          </Button>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={clearAllData}
        title="Bersihkan Seluruh Data?"
        message="PERINGATAN: Semua target, agenda, kursus, catatan, dan berkas akan dihapus seketika. Apakah Anda yakin?"
        confirmLabel="Ya, Kosongkan Data"
        variant="danger"
      />
    </div>
  );
}
