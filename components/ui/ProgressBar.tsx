import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'blue' | 'indigo' | 'amber' | 'purple';
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = false,
  className,
  barClassName,
  size = 'md',
  color = 'emerald',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color], barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
