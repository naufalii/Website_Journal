'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();

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
          setErrorMessage(error.message || 'Pendaftaran tidak dapat diproses. Coba lagi.');
        } else {
          if (data?.session) {
            router.push('/');
          } else {
            setSuccessMessage(
              'Pendaftaran berhasil! Silakan periksa kotak masuk email Anda jika konfirmasi diperlukan, atau langsung coba masuk.'
            );
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'Email atau kata sandi tidak cocok.');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kendala saat menghubungkan akun.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-3xl bg-gradient-to-tr from-brand-primary via-brand-vibrant to-brand-cyan items-center justify-center text-white shadow-glow mb-2">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-content-primaryLight dark:text-content-primaryDark">
            {isSignUp ? 'Buat Akun Nexus' : 'Selamat Datang Kembali'}
          </h1>
          <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark max-w-xs mx-auto">
            Akses target, agenda, kursus, dan catatan Anda dari semua perangkat.
          </p>
        </div>

        {/* Centered Modern Card Form */}
        <div className="p-7 sm:p-9 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Alamat Email"
              placeholder="nama@email.com"
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
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl shadow-glow text-sm font-bold gap-2 mt-3"
            >
              <span>{isLoading ? 'Memproses...' : isSignUp ? 'Daftar Akun' : 'Masuk ke Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Toggle Login / SignUp */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-center text-xs text-content-mutedLight dark:text-content-mutedDark">
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
                  className="font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
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
                  className="font-bold text-brand-primary dark:text-brand-vibrant hover:underline"
                >
                  Daftar sekarang
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
