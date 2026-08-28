'use client';

import React from 'react';
import { getGreeting } from '@/lib/utils';
import { Sparkles, PlusCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function GreetingBanner() {
  const { openQuickAction } = useApp();
  const greeting = getGreeting();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Personal Productivity Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting.text}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {greeting.subtext}
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => openQuickAction()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all duration-150"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Tambah Cepat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
