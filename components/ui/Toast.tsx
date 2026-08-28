'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-800/50',
          error: 'border-rose-200 dark:border-rose-800/50',
          info: 'border-blue-200 dark:border-blue-800/50',
          warning: 'border-amber-200 dark:border-amber-800/50',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-xl border text-slate-800 dark:text-slate-100 transition-all transform animate-in slide-in-from-bottom-5',
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors -mr-1 -mt-1 p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
