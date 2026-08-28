'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Database, ExternalLink, Key, Check, Copy, X } from 'lucide-react';
import Link from 'next/link';

export function SupabaseSetupBanner() {
  const { isConfigured, user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isConfigured && user) return null;

  const sampleEnv = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Sinkronisasi Multi-Device Supabase</span>
              {!isConfigured ? (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Setup Diperlukan
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Tersedia
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {!isConfigured
                ? 'Hubungkan ke Supabase agar data otomatis tersinkronisasi antara Laptop dan HP Anda.'
                : 'Masuk dengan akun Anda untuk mulai menyinkronkan data secara real-time ke Cloud Database.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
          {!isConfigured ? (
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              {showGuide ? 'Tutup Panduan' : 'Lihat Panduan Setup'}
            </button>
          ) : !user ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Masuk / Login Akun
            </Link>
          ) : null}
        </div>
      </div>

      {showGuide && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-300 space-y-3 animate-in fade-in duration-200">
          <p className="font-bold text-emerald-400">Langkah Cepat Integrasi Supabase:</p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
            <li>
              Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold inline-flex items-center gap-1">supabase.com <ExternalLink className="h-3 w-3" /></a> dan buat project baru gratis.
            </li>
            <li>
              Jalankan skrip SQL dari file <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono">supabase_schema.sql</code> di menu <strong>SQL Editor</strong> Supabase.
            </li>
            <li>
              Salin <strong>Project URL</strong> & <strong>Anon Key</strong> dari menu <strong>Project Settings &gt; API</strong>.
            </li>
            <li>
              Masukkan ke file <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono">.env.local</code> di lokal atau di tab <strong>Environment Variables</strong> Dashboard Vercel:
            </li>
          </ol>

          <div className="relative p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-emerald-300">
            <button
              onClick={copyToClipboard}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <pre className="overflow-x-auto whitespace-pre-wrap">{sampleEnv}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
