# NexusWorkspace — All-in-One Personal Workspace & Productivity Dashboard

Aplikasi web modern, terstruktur, responsif, dan siap dideploy 100% ke **Vercel** untuk manajemen produktivitas harian Anda.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![Vercel Ready](https://img.shields.io/badge/Vercel-100%25_Ready-success)

---

## 🌟 Fitur & Modul Utama

1. **Dashboard Overview (Home)**
   - Header dinamis: Jam digital real-time & salam kontekstual (Pagi/Siang/Sore/Malam).
   - Stat Cards: Rangkuman progres target hari ini, streak konsistensi, jumlah agenda, dan kursus aktif.
   - Quick Action Modal (+ Tambah Cepat) di header & sidebar yang dapat diakses dari halaman mana saja.
   - Widgets terintegrasi: Checklist target hari ini, timeline agenda hari ini, progres kursus aktif, dan catatan terbaru.

2. **Daily Goals & Habit Tracker (`/goals`)**
   - Checklist target & kebiasaan harian interaktif.
   - Perhitungan persentase progres harian otomatis.
   - Visualisasi **Streak Counter** (menghitung hari berturut-turut checklist target tercapai).
   - Navigasi tanggal (Hari Ini, Kemarin, Besok, Kalender).
   - Filter berdasarkan kategori (Karir, Belajar, Kesehatan, Finansial, Personal, Umum).

3. **Schedule & Agenda Planner (`/schedule`)**
   - Form agenda: Nama aktivitas, Tanggal, Jam (Mulai - Selesai), Kategori, dan Skala Prioritas (High 🔴, Medium 🟡, Low 🟢).
   - Timeline list terurut secara kronologis waktu terdekat.
   - Filter waktu: Hari Ini, Besok, 7 Hari ke Depan, dan Semua Jadwal.
   - Status toggle (Selesai / Belum Selesai) & tautan lokasi/meeting online yang dapat diklik langsung.

4. **Course & Skill Tracker (`/courses`)**
   - Pelacak materi belajar / kursus daring.
   - Parameter: Judul Kursus, Platform/Lembaga, Link URL, Target Selesai, Total Modul vs Modul Selesai, dan Dynamic Progress Bar (%).
   - Kontrol cepat tombol `+1 Bab` / `-1 Bab`.
   - Filter status: *Sedang Berjalan*, *Selesai*, *Rencana*.

5. **Quick Notes & Knowledge Base (`/notes`)**
   - Catatan ide harian & dokumentasi ringkas.
   - Pencarian instan (Live Search) berdasarkan judul, isi catatan, atau tags.
   - Fitur **Pin to Top** 📌 untuk menyematkan catatan penting di urutan teratas.
   - Timestamp waktu pembuatan & terakhir diperbarui.

6. **Document & Resource Vault (`/vault`)**
   - Brankas penyimpanan dokumen dan link penting:
     - **Mode 1: External Links** (Google Drive, Notion, GitHub, Figma, Docs).
     - **Mode 2: Local File Upload** yang disimpan secara privat dan aman di **IndexedDB** browser (bebas dari batasan kuota 5MB LocalStorage).
   - Fitur Preview file langsung di browser (PDF, Gambar) & tombol Download.

7. **Pengaturan, Backup & Restore (`/settings`)**
   - **Export Backup (.json)**: Mengunduh seluruh data teks & berkas file IndexedDB (terenkripsi Base64) ke dalam satu file `.json`.
   - **Import / Restore (.json)**: Memulihkan kembali seluruh data workspace dari cadangan sebelumnya.
   - **Reset Data**: Fitur kosongkan data dengan modal konfirmasi pengaman.

---

## 🚀 Panduan Menjalankan Secara Lokal

1. **Clone repositori atau buka folder proyek**:
   ```bash
   cd Website_Journal
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

4. **Build untuk Production**:
   ```bash
   npm run build
   ```

---

## ☁️ Panduan Deploy ke Vercel (100% Ready)

### Cara 1: Menggunakan Vercel Dashboard (Rekomendasi)
1. Push proyek ini ke repositori **GitHub** / **GitLab** Anda.
2. Buka [vercel.com](https://vercel.com) dan login.
3. Klik **"Add New..."** > **"Project"**.
4. Import repositori GitHub Anda.
5. Vercel akan otomatis mendeteksi Framework **Next.js**. Klik **"Deploy"**.

### Cara 2: Menggunakan Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📁 Struktur Direktori Proyek

```
Website_Journal/
├── app/
│   ├── layout.tsx              # Root Layout & Provider
│   ├── page.tsx                # Dashboard Overview (Home Page)
│   ├── globals.css             # Tailwind styling & custom scrollbar
│   ├── goals/page.tsx          # Modul Daily Goals & Habits
│   ├── schedule/page.tsx       # Modul Schedule & Agenda
│   ├── courses/page.tsx        # Modul Course & Skill Tracker
│   ├── notes/page.tsx          # Modul Quick Notes
│   ├── vault/page.tsx          # Modul Resource Vault
│   └── settings/page.tsx       # Modul Backup, Restore & Reset
├── components/
│   ├── dashboard/              # Widget-widget dashboard overview
│   │   ├── GreetingBanner.tsx
│   │   ├── StatCards.tsx
│   │   ├── TodayGoalsWidget.tsx
│   │   ├── TodayScheduleWidget.tsx
│   │   ├── ActiveCoursesWidget.tsx
│   │   └── RecentNotesWidget.tsx
│   ├── layout/                 # Layout & navigasi
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   ├── goals/GoalModal.tsx
│   ├── schedule/ScheduleModal.tsx
│   ├── courses/CourseModal.tsx
│   ├── notes/NoteModal.tsx
│   ├── vault/
│   │   ├── VaultModal.tsx
│   │   └── FilePreviewModal.tsx
│   ├── shared/
│   │   ├── QuickActionModal.tsx
│   │   └── ConfirmDialog.tsx
│   └── ui/                     # UI Primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── ProgressBar.tsx
│       ├── EmptyState.tsx
│       └── Toast.tsx
├── context/
│   └── AppContext.tsx          # Global Client State & Persistent Storage Handlers
├── lib/
│   ├── types.ts                # TypeScript Interfaces
│   ├── utils.ts                # Date formatting, Streak calculation, cn helper
│   ├── storage.ts              # LocalStorage & IndexedDB handlers
│   └── backup.ts               # JSON Backup & Restore engine
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── vercel.json
└── README.md
```
