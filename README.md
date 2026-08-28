# NexusWorkspace — All-in-One Personal Workspace & Productivity Dashboard

Aplikasi web modern, terstruktur, responsif, dan siap dideploy 100% ke **Vercel** dengan sinkronisasi multi-device (Laptop, Tablet & Smartphone/HP) menggunakan **Supabase** (Auth, PostgreSQL DB + RLS, dan Supabase Storage).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB_&_Storage-3ECF8E)
![Vercel Ready](https://img.shields.io/badge/Vercel-100%25_Ready-success)

---

## 🌟 Fitur Utama & Multi-Device Sync

1. **Sinkronisasi Otomatis Antar Perangkat (Laptop & HP)**
   - Semua target, jadwal, kursus, catatan, dan berkas diunggah langsung ke database **Supabase Cloud**.
   - Buka dashboard dari laptop di kantor, lalu buka dari browser HP saat di jalan — semua data tersinkronisasi instan.

2. **Sistem Autentikasi Terisolasi (Supabase Auth & RLS)**
   - Login & registrasi aman (`/login`).
   - Setiap pengguna memiliki ruang kerja privat. Row Level Security (RLS) di PostgreSQL memastikan data Anda hanya bisa diakses oleh akun Anda sendiri.

3. **Supabase Cloud File Storage**
   - Berkas dokumen (PDF, gambar, docs) diunggah langsung ke bucket `vault-documents` di Supabase Storage.
   - File yang diupload dari laptop dapat langsung dibuka, dipreview, dan diunduh di browser HP.

4. **Modul Produktivitas Lengkap**
   - **Dashboard Overview (`/`)**: Live clock, stat cards, daily focus widget, upcoming agenda timeline, dan active courses.
   - **Daily Goals & Habit Tracker (`/goals`)**: Checklist harian, progres persentase %, streak konsistensi 🔥, dan kalender.
   - **Schedule & Agenda Planner (`/schedule`)**: Timeline urut waktu terdekat, filter prioritas (High 🔴, Med 🟡, Low 🟢), link meeting online.
   - **Course & Skill Tracker (`/courses`)**: Target tanggal, rasio modul total vs selesai, tombol `+1 Bab`, dan progress bar.
   - **Quick Notes & Knowledge Base (`/notes`)**: Live search instan, tags, pin to top 📌.
   - **Document & Resource Vault (`/vault`)**: Simpan link penting dan upload file dokumen ke cloud storage.
   - **Backup & Settings (`/settings`)**: Export JSON, restore, status akun, dan reset data.

---

## ⚡ Panduan Setup Supabase (Hanya 3 Menit)

### Langkah 1: Buat Project di Supabase
1. Buka [supabase.com](https://supabase.com) dan buat akun/login.
2. Buat project baru (misal: `nexus-workspace`).

### Langkah 2: Jalankan Skrip Database & Storage
1. Di Dashboard Supabase, buka menu **SQL Editor** (ikon terminal di sidebar kiri).
2. Buka file [`supabase_schema.sql`](./supabase_schema.sql) dari repositori ini, salin seluruh kodenya.
3. Tempel di SQL Editor Supabase dan klik tombol **"Run"**.
   > Skrip ini otomatis membuat tabel `goals`, `schedules`, `courses`, `notes`, `documents`, bucket storage `vault-documents`, serta seluruh policy keamanan RLS.

### Langkah 3: Ambil API Keys
1. Buka menu **Project Settings** > **API**.
2. Salin:
   - **Project URL**
   - **anon / public key**

---

## 💻 Setup Environment Variables di Lokal

Buat file `.env.local` di root folder proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

Jalankan secara lokal:
```bash
npm install
npm run dev
```
Buka `http://localhost:3000` di browser.

---

## ☁️ Panduan Deploy ke Vercel

1. Push folder proyek ini ke repositori **GitHub** Anda.
2. Buka [vercel.com](https://vercel.com) > **"Add New..."** > **"Project"** > Import repositori Anda.
3. Di bagian **"Environment Variables"**, tambahkan dua variabel berikut:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon public key Supabase Anda)
4. Klik **"Deploy"**.
5. Website Anda telah live! Buka URL Vercel tersebut di laptop maupun di browser HP Anda.

---

## 📁 Struktur Direktori

```
Website_Journal/
├── app/
│   ├── layout.tsx              # Root Layout, AuthProvider & AppProvider
│   ├── page.tsx                # Dashboard Overview (Home Page)
│   ├── login/page.tsx          # Login & Registrasi Supabase Auth
│   ├── goals/page.tsx          # Modul Daily Goals & Habit Tracker
│   ├── schedule/page.tsx       # Modul Jadwal & Agenda Planner
│   ├── courses/page.tsx        # Modul Course & Skill Tracker
│   ├── notes/page.tsx          # Modul Quick Notes
│   ├── vault/page.tsx          # Modul Document & Resource Vault
│   ├── settings/page.tsx       # Modul Settings & Status Akun
│   └── globals.css
├── components/
│   ├── dashboard/              # Widget-widget overview
│   ├── layout/                 # Sidebar, Header, MobileNav
│   ├── shared/                 # SupabaseSetupBanner, QuickActionModal, ConfirmDialog
│   ├── goals/GoalModal.tsx
│   ├── schedule/ScheduleModal.tsx
│   ├── courses/CourseModal.tsx
│   ├── notes/NoteModal.tsx
│   ├── vault/                  # VaultModal & FilePreviewModal
│   └── ui/                     # UI Primitives
├── context/
│   ├── AuthContext.tsx         # Supabase Authentication & Session Provider
│   └── AppContext.tsx          # Cross-Device Sync State Engine
├── lib/
│   ├── supabase.ts             # Supabase Client Initializer
│   ├── types.ts                # TypeScript Interfaces
│   ├── utils.ts                # Formatting & Streak Calculation
│   ├── storage.ts              # LocalStorage & IndexedDB handlers
│   └── backup.ts               # JSON Backup & Restore
├── supabase_schema.sql         # Skrip SQL DDL, RLS & Storage Buckets
├── .env.local.example
├── package.json
└── vercel.json
```
