'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />,
          info: <Info className="h-5 w-5 text-brand-primary dark:text-brand-vibrant flex-shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-500/30',
          error: 'border-rose-500/30',
          info: 'border-brand-primary/30',
          warning: 'border-amber-500/30',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-soft border text-content-primaryLight dark:text-content-primaryDark transition-all transform animate-in slide-in-from-bottom-5',
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5 leading-snug break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark transition-colors -mr-1 -mt-1 p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
