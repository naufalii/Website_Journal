'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signUp, isConfigured } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);
        if (error) {
          setErrorMessage(error.message || 'Gagal mendaftar. Silakan coba lagi.');
        } else {
          if (data?.session) {
            router.push('/');
          } else {
            setSuccessMessage(
              'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi (jika email confirmation aktif di Supabase), atau langsung coba login.'
            );
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'Email atau password salah.');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Intro */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 items-center justify-center text-white shadow-xl shadow-emerald-600/20 mb-2">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? 'Buat Akun NexusWorkspace' : 'Selamat Datang Kembali'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sinkronkan target, jadwal, kursus, catatan, dan berkas di seluruh perangkat Anda.
          </p>
        </div>

        {!isConfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span>Supabase Belum Dikonfigurasi</span>
            </div>
            <p>
              Harap tambahkan <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pada file <code className="font-mono">.env.local</code> atau di Dashboard Vercel.
            </p>
          </div>
        )}

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Alamat Email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
              autoFocus
            />

            <Input
              type="password"
              label="Kata Sandi"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
              minLength={6}
            />

            <Button
              type="submit"
              disabled={isLoading || !isConfigured}
              className="w-full py-3 shadow-md shadow-emerald-600/20 text-xs sm:text-sm font-bold gap-2 mt-2"
            >
              <span>{isLoading ? 'Memproses...' : isSignUp ? 'Daftar Akun Baru' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Toggle Login / SignUp */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            {isSignUp ? (
              <span>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Masuk di sini
                </button>
              </span>
            ) : (
              <span>
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Daftar akun baru
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Dilindungi oleh Row Level Security (RLS) Supabase</span>
        </div>
      </div>
    </div>
  );
}
