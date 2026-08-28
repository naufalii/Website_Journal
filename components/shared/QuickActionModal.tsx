'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  Target,
  Calendar,
  GraduationCap,
  FileText,
  FolderLock,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { getLocalDateString } from '@/lib/utils';
import { GoalCategory, ScheduleCategory, Priority, CourseStatus, NoteCategory, VaultCategory } from '@/lib/types';

export function QuickActionModal() {
  const {
    isQuickActionOpen,
    quickActionTab,
    closeQuickAction,
    addGoal,
    addSchedule,
    addCourse,
    addNote,
    addVaultLink,
    addVaultFile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'goal' | 'schedule' | 'course' | 'note' | 'vault'>(
    quickActionTab
  );

  useEffect(() => {
    setActiveTab(quickActionTab);
  }, [quickActionTab]);

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('career');

  // Schedule Form State
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDate, setSchedDate] = useState(getLocalDateString());
  const [schedStart, setSchedStart] = useState('09:00');
  const [schedEnd, setSchedEnd] = useState('10:00');
  const [schedCategory, setSchedCategory] = useState<ScheduleCategory>('work');
  const [schedPriority, setSchedPriority] = useState<Priority>('medium');
  const [schedDesc, setSchedDesc] = useState('');

  // Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePlatform, setCoursePlatform] = useState('');
  const [courseUrl, setCourseUrl] = useState('');
  const [courseTargetDate, setCourseTargetDate] = useState('');
  const [courseTotalModules, setCourseTotalModules] = useState(10);
  const [courseCompletedModules, setCourseCompletedModules] = useState(0);
  const [courseStatus, setCourseStatus] = useState<CourseStatus>('in_progress');

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('idea');
  const [noteTags, setNoteTags] = useState('');

  // Vault Form State
  const [vaultTitle, setVaultTitle] = useState('');
  const [vaultType, setVaultType] = useState<'link' | 'file'>('link');
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>('document');
  const [vaultUrl, setVaultUrl] = useState('');
  const [vaultFile, setVaultFile] = useState<File | null>(null);

  const resetForms = () => {
    setGoalTitle('');
    setSchedTitle('');
    setSchedDesc('');
    setCourseTitle('');
    setCoursePlatform('');
    setCourseUrl('');
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setVaultTitle('');
    setVaultUrl('');
    setVaultFile(null);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
    });
    resetForms();
    closeQuickAction();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;
    addSchedule({
      title: schedTitle.trim(),
      date: schedDate,
      startTime: schedStart,
      endTime: schedEnd,
      category: schedCategory,
      priority: schedPriority,
      description: schedDesc.trim() || undefined,
    });
    resetForms();
    closeQuickAction();
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !coursePlatform.trim()) return;
    addCourse({
      title: courseTitle.trim(),
      platform: coursePlatform.trim(),
      url: courseUrl.trim() || undefined,
      targetDate: courseTargetDate || undefined,
      totalModules: Number(courseTotalModules) || 1,
      completedModules: Number(courseCompletedModules) || 0,
      status: courseStatus,
    });
    resetForms();
    closeQuickAction();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const tagsArray = noteTags
      ? noteTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      tags: tagsArray,
      isPinned: false,
    });
    resetForms();
    closeQuickAction();
  };

  const handleVaultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultTitle.trim()) return;
    if (vaultType === 'link') {
      if (!vaultUrl.trim()) return;
      addVaultLink({
        title: vaultTitle.trim(),
        category: vaultCategory,
        url: vaultUrl.trim(),
        tags: [],
      });
    } else {
      if (!vaultFile) return;
      await addVaultFile(
        {
          title: vaultTitle.trim(),
          category: vaultCategory,
          tags: [],
        },
        vaultFile
      );
    }
    resetForms();
    closeQuickAction();
  };

  const tabs = [
    { id: 'goal', label: 'Goal', icon: Target },
    { id: 'schedule', label: 'Jadwal', icon: Calendar },
    { id: 'course', label: 'Course', icon: GraduationCap },
    { id: 'note', label: 'Catatan', icon: FileText },
    { id: 'vault', label: 'Resource', icon: FolderLock },
  ] as const;

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={closeQuickAction}
      title="Tambah Cepat (+ Quick Action)"
      description="Pilih modul dan masukkan data baru tanpa harus berpindah halaman."
      maxWidth="lg"
    >
      {/* Module Selector Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 -mx-6 px-6 mb-5 overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Goal Form */}
      {activeTab === 'goal' && (
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <Input
            label="Nama Target / Kebiasaan"
            placeholder="Contoh: Belajar Next.js 1 Jam, Olahraga 30 Menit"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            required
            autoFocus
          />
          <Select
            label="Kategori"
            value={goalCategory}
            onChange={(e) => setGoalCategory(e.target.value as GoalCategory)}
          >
            <option value="career">Karir & Profesional</option>
            <option value="learning">Belajar & Skill</option>
            <option value="health">Kesehatan & Kebugaran</option>
            <option value="finance">Finansial</option>
            <option value="personal">Personal / Hobi</option>
            <option value="general">Umum</option>
          </Select>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={closeQuickAction}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Goal
            </Button>
          </div>
        </form>
      )}

      {/* Schedule Form */}
      {activeTab === 'schedule' && (
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Input
            label="Nama Aktivitas / Agenda"
            placeholder="Contoh: Daily Standup Meeting, Review PR"
            value={schedTitle}
            onChange={(e) => setSchedTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="date"
              label="Tanggal"
              value={schedDate}
              onChange={(e) => setSchedDate(e.target.value)}
              required
            />
            <Input
              type="time"
              label="Jam Mulai"
              value={schedStart}
              onChange={(e) => setSchedStart(e.target.value)}
              required
            />
            <Input
              type="time"
              label="Jam Selesai"
              value={schedEnd}
              onChange={(e) => setSchedEnd(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={schedCategory}
              onChange={(e) => setSchedCategory(e.target.value as ScheduleCategory)}
            >
              <option value="work">Kerja / Tugas</option>
              <option value="meeting">Meeting / Diskusi</option>
              <option value="study">Belajar / Kelas</option>
              <option value="health">Kesehatan</option>
              <option value="personal">Personal</option>
              <option value="other">Lainnya</option>
            </Select>
            <Select
              label="Prioritas"
              value={schedPriority}
              onChange={(e) => setSchedPriority(e.target.value as Priority)}
            >
              <option value="high">High Priority 🔴</option>
              <option value="medium">Medium Priority 🟡</option>
              <option value="low">Low Priority 🟢</option>
            </Select>
          </div>
          <Textarea
            label="Keterangan / Lokasi / Link (Opsional)"
            placeholder="Google Meet, Zoom, atau catatan pendukung..."
            rows={2}
            value={schedDesc}
            onChange={(e) => setSchedDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={closeQuickAction}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Agenda
            </Button>
          </div>
        </form>
      )}

      {/* Course Form */}
      {activeTab === 'course' && (
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <Input
            label="Judul Kursus / Materi Belajar"
            placeholder="Contoh: Master Next.js 14 & TypeScript"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Platform / Sumber"
              placeholder="Contoh: Udemy, Dicoding, Coursera, YouTube"
              value={coursePlatform}
              onChange={(e) => setCoursePlatform(e.target.value)}
              required
            />
            <Input
              label="Target Selesai (Opsional)"
              type="date"
              value={courseTargetDate}
              onChange={(e) => setCourseTargetDate(e.target.value)}
            />
          </div>
          <Input
            label="Link Kursus (URL)"
            type="url"
            placeholder="https://..."
            value={courseUrl}
            onChange={(e) => setCourseUrl(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Total Bab/Modul"
              type="number"
              min="1"
              value={courseTotalModules}
              onChange={(e) => setCourseTotalModules(Number(e.target.value))}
              required
            />
            <Input
              label="Modul Selesai"
              type="number"
              min="0"
              max={courseTotalModules}
              value={courseCompletedModules}
              onChange={(e) => setCourseCompletedModules(Number(e.target.value))}
              required
            />
            <Select
              label="Status"
              value={courseStatus}
              onChange={(e) => setCourseStatus(e.target.value as CourseStatus)}
            >
              <option value="in_progress">Sedang Berjalan</option>
              <option value="completed">Selesai</option>
              <option value="planned">Rencana</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={closeQuickAction}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Kursus
            </Button>
          </div>
        </form>
      )}

      {/* Note Form */}
      {activeTab === 'note' && (
        <form onSubmit={handleNoteSubmit} className="space-y-4">
          <Input
            label="Judul Catatan"
            placeholder="Contoh: Ide Proyek Web, Panduan Setup Tailwind"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Kategori"
              value={noteCategory}
              onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}
            >
              <option value="idea">💡 Ide & Konsep</option>
              <option value="learning">📚 Belajar & Ringkasan</option>
              <option value="project">🚀 Proyek & Rencana</option>
              <option value="work">💼 Pekerjaan</option>
              <option value="personal">🔒 Personal</option>
              <option value="general">📝 Umum</option>
            </Select>
            <Input
              label="Tags (Pisahkan koma)"
              placeholder="react, tailwind, ui"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
            />
          </div>
          <Textarea
            label="Isi Catatan"
            placeholder="Tuliskan isi catatan, poin penting, atau ide..."
            rows={5}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={closeQuickAction}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Catatan
            </Button>
          </div>
        </form>
      )}

      {/* Vault Form */}
      {activeTab === 'vault' && (
        <form onSubmit={handleVaultSubmit} className="space-y-4">
          <div className="flex gap-3 mb-2">
            <button
              type="button"
              onClick={() => setVaultType('link')}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                vaultType === 'link'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>Link Eksternal</span>
            </button>
            <button
              type="button"
              onClick={() => setVaultType('file')}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                vaultType === 'file'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload File Lokal</span>
            </button>
          </div>

          <Input
            label="Nama Resource / Dokumen"
            placeholder="Contoh: Dokumen Kontrak, Link Google Drive, Template Resume"
            value={vaultTitle}
            onChange={(e) => setVaultTitle(e.target.value)}
            required
            autoFocus
          />

          <Select
            label="Kategori"
            value={vaultCategory}
            onChange={(e) => setVaultCategory(e.target.value as VaultCategory)}
          >
            <option value="document">📄 Dokumen / Surat</option>
            <option value="learning">🎓 Pembelajaran & Ebook</option>
            <option value="certificate">🏆 Sertifikat & Piagam</option>
            <option value="work">💼 Pekerjaan & Proyek</option>
            <option value="finance">💰 Finansial & Tagihan</option>
            <option value="personal">🔒 Pribadi</option>
            <option value="other">📦 Lainnya</option>
          </Select>

          {vaultType === 'link' ? (
            <Input
              label="URL / Link Eksternal"
              type="url"
              placeholder="https://drive.google.com/... atau https://notion.so/..."
              value={vaultUrl}
              onChange={(e) => setVaultUrl(e.target.value)}
              required
            />
          ) : (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Pilih File (PDF, Gambar, Docs - Aman di IndexedDB)
              </label>
              <input
                type="file"
                onChange={(e) => setVaultFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={closeQuickAction}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              Simpan Resource
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
