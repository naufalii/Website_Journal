import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'cyan' | 'emerald' | 'amber';
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = false,
  className,
  barClassName,
  size = 'md',
  color = 'brand',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colors = {
    brand: 'bg-gradient-to-r from-brand-primary to-brand-cyan',
    cyan: 'bg-gradient-to-r from-cyan-500 to-teal-400',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
  };

  return (
    <div className={cn('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-xs font-bold text-content-primaryLight dark:text-content-primaryDark mb-1.5">
          <span>Progres</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full bg-surface-lightPill dark:bg-surface-darkPill rounded-full overflow-hidden p-0.5', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color], barClassName)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
