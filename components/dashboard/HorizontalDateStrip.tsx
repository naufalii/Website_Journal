'use client';

import React from 'react';
import { getLocalDateString } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface HorizontalDateStripProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export function HorizontalDateStrip({ selectedDate, onSelectDate }: HorizontalDateStripProps) {
  const todayStr = getLocalDateString();

  // Generate 7 days centered on selectedDate or today
  const getWeekDays = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const centerDate = new Date(y, m - 1, d);

    const days = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i);
      const dateStr = getLocalDateString(date);

      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayNum = date.getDate();
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push({
        dateStr,
        dayName,
        dayNum,
        isSelected,
        isToday,
      });
    }
    return days;
  };

  const days = getWeekDays();

  const changeDateBy = (offset: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offset);
    onSelectDate(getLocalDateString(date));
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft">
      {/* Prev Button */}
      <button
        onClick={() => changeDateBy(-1)}
        className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark transition-colors flex-shrink-0"
        title="Hari Sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* 7-Day Strip */}
      <div className="flex items-center justify-around gap-2 flex-1 overflow-x-auto no-scrollbar py-1">
        {days.map((item) => (
          <button
            key={item.dateStr}
            onClick={() => onSelectDate(item.dateStr)}
            className={`w-12 sm:w-14 h-18 sm:h-20 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer select-none ${
              item.isSelected
                ? 'bg-brand-primary text-white shadow-glow scale-105 font-bold'
                : 'bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark border border-transparent'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {item.dayName}
            </span>
            <span
              className={`text-base sm:text-lg font-black mt-0.5 font-mono ${
                item.isSelected
                  ? 'text-white'
                  : 'text-content-primaryLight dark:text-content-primaryDark'
              }`}
            >
              {item.dayNum}
            </span>
            {item.isToday && (
              <span
                className={`h-1.5 w-1.5 rounded-full mt-1 ${
                  item.isSelected ? 'bg-brand-cyan' : 'bg-brand-primary dark:bg-brand-vibrant'
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => changeDateBy(1)}
        className="p-2 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight dark:hover:text-content-primaryDark transition-colors flex-shrink-0"
        title="Hari Berikutnya"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
