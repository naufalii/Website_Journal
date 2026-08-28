'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { PlusCircle, Sparkles } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils';

export function GreetingBanner() {
  const { user } = useAuth();
  const { goals, openQuickAction } = useApp();

  const todayStr = getLocalDateString();
  const completedGoalsCount = goals.filter((g) => g.completedDates.includes(todayStr)).length;
  const pendingGoalsCount = goals.length - completedGoalsCount;

  const userName = user?.email ? user.email.split('@')[0] : 'Kawan';

  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-deep via-brand-primary to-slate-900 p-6 sm:p-8 text-white shadow-soft transition-all duration-300">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-brand-vibrant/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight capitalize">
            Halo, {userName} 👋
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-indigo-100/90 font-medium leading-relaxed max-w-lg">
            {goals.length === 0
              ? 'Selamat datang di ruang kerja produktivitas Anda. Siap menyusun target hari ini?'
              : pendingGoalsCount > 0
              ? `${pendingGoalsCount} target menunggu diselesaikan hari ini. Tetap fokus dan semangat!`
              : 'Luar biasa! Seluruh target harian Anda telah terselesaikan hari ini.'}
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => openQuickAction()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-deep hover:bg-slate-50 active:scale-95 font-bold text-xs shadow-soft transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 text-brand-primary" />
            <span>+ Tambah Target</span>
          </button>
        </div>
      </div>
    </div>
  );
}
