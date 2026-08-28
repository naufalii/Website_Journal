'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { getLocalDateString, calculateStreak, formatShortDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function AnalyticsDashboard() {
  const { goals, schedules, courses, notes } = useApp();
  const todayStr = getLocalDateString();

  // -------------------------------------------------------------
  // 1. Goal Completion 7-Days Chart Data
  // -------------------------------------------------------------
  const weeklyGoalsData = useMemo(() => {
    const data = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      const totalGoals = goals.length;
      const completed = goals.filter((g) => g.completedDates.includes(dateStr)).length;
      const rate = totalGoals > 0 ? Math.round((completed / totalGoals) * 100) : 0;

      data.push({
        date: dayLabel,
        rawDate: dateStr,
        rate,
        completed,
        total: totalGoals,
      });
    }
    return data;
  }, [goals]);

  // -------------------------------------------------------------
  // 2. Streak & Consistency Status
  // -------------------------------------------------------------
  const streakStats = useMemo(() => {
    if (goals.length === 0) {
      return { maxStreak: 0, currentStreak: 0, consistencyRate: 0, activeDays: 0 };
    }

    let maxStreak = 0;
    let totalStreaks = 0;

    goals.forEach((g) => {
      const s = calculateStreak(g.completedDates);
      if (s > maxStreak) maxStreak = s;
      totalStreaks += s;
    });

    const currentStreak = goals.length > 0 ? Math.round(totalStreaks / goals.length) : 0;

    // Check past 14 days activity dots
    const last14Days = [];
    let activeDaysCount = 0;
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const hasActivity = goals.some((g) => g.completedDates.includes(dateStr));
      if (hasActivity) activeDaysCount++;
      last14Days.push({
        dateStr,
        dayNum: d.getDate(),
        active: hasActivity,
      });
    }

    const consistencyRate = Math.round((activeDaysCount / 14) * 100);

    return { maxStreak, currentStreak, consistencyRate, activeDays: activeDaysCount, last14Days };
  }, [goals]);

  // -------------------------------------------------------------
  // 3. Time Distribution by Category (Pie/Donut Chart)
  // -------------------------------------------------------------
  const timeDistributionData = useMemo(() => {
    const categoryMinutes: Record<string, number> = {
      work: 0,
      study: 0,
      meeting: 0,
      health: 0,
      personal: 0,
      other: 0,
    };

    schedules.forEach((item) => {
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      let duration = (eh * 60 + em) - (sh * 60 + sm);
      if (duration <= 0) duration = 60; // fallback 1 hour

      const cat = item.category || 'other';
      categoryMinutes[cat] = (categoryMinutes[cat] || 0) + duration;
    });

    const categoryNames: Record<string, string> = {
      work: 'Kerja & Tugas',
      study: 'Belajar & Skill',
      meeting: 'Meeting & Diskusi',
      health: 'Kesehatan & Olahraga',
      personal: 'Personal & Hobi',
      other: 'Lainnya',
    };

    const colors: Record<string, string> = {
      work: '#4F46E5',    // brand.primary
      study: '#06B6D4',   // brand.cyan
      meeting: '#6366F1', // brand.vibrant
      health: '#10B981',  // Emerald
      personal: '#F59E0B',// Amber
      other: '#EC4899',   // Pink
    };

    const result = Object.entries(categoryMinutes)
      .filter(([_, minutes]) => minutes > 0)
      .map(([cat, minutes]) => ({
        name: categoryNames[cat] || cat,
        value: Math.round(minutes / 60 * 10) / 10, // in hours
        color: colors[cat] || '#4F46E5',
      }));

    if (result.length === 0) {
      return [
        { name: 'Belum Ada Jadwal', value: 1, color: '#334155' },
      ];
    }

    return result;
  }, [schedules]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-content-primaryLight dark:text-content-primaryDark tracking-tight flex items-center gap-2.5">
          <TrendingUp className="h-6 w-6 text-brand-primary dark:text-brand-vibrant" />
          <span>Analytics & Insight Produktivitas</span>
        </h1>
        <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark mt-1">
          Pantau konsistensi pencapaian target mingguan, distribusi waktu, dan ritme kerja harian Anda.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shadow-soft flex-shrink-0">
            <Flame className="h-6 w-6 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">Streak Tertinggi</span>
            <h3 className="text-2xl font-black text-content-primaryLight dark:text-content-primaryDark font-mono mt-0.5">
              {streakStats.maxStreak} Hari 🔥
            </h3>
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark">
              Rata-rata konsistensi: {streakStats.consistencyRate}%
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant shadow-soft flex-shrink-0">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">Target Aktif</span>
            <h3 className="text-2xl font-black text-brand-primary dark:text-brand-vibrant font-mono mt-0.5">
              {goals.length} Rutinitas
            </h3>
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark">
              {goals.filter((g) => g.completedDates.includes(todayStr)).length} selesai hari ini
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-cyan/10 text-brand-cyan shadow-soft flex-shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">Total Agenda Terjadwal</span>
            <h3 className="text-2xl font-black text-brand-cyan font-mono mt-0.5">
              {schedules.length} Aktivitas
            </h3>
            <p className="text-[11px] text-content-mutedLight dark:text-content-mutedDark">
              {schedules.filter((s) => s.completed).length} telah terselesaikan
            </p>
          </div>
        </div>
      </div>

      {/* Grid 2 Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Completion Rate Chart */}
        <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark flex items-center gap-2">
                <Target className="h-4 w-4 text-brand-primary dark:text-brand-vibrant" />
                <span>Pencapaian Target 7 Hari Terakhir</span>
              </h3>
              <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
                Tingkat keberhasilan pemenuhan target harian (%)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyGoalsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-2xl bg-surface-dark text-white text-xs shadow-xl border border-white/10">
                          <p className="font-bold">{data.date}</p>
                          <p className="text-brand-vibrant font-mono mt-1 font-bold">
                            Tercapai: {data.rate}% ({data.completed}/{data.total} target)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rateGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Donut Chart */}
        <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-cyan" />
                <span>Distribusi Waktu Berdasarkan Kategori</span>
              </h3>
              <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
                Alokasi durasi jam aktivitas pada timeline agenda
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {timeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="p-3 rounded-2xl bg-surface-dark text-white text-xs shadow-xl border border-white/10">
                          <p className="font-bold">{data.name}</p>
                          <p className="font-mono mt-1 font-bold" style={{ color: data.payload.color }}>
                            {data.value} Jam
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-bold text-content-primaryLight dark:text-content-primaryDark">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consistency Rhythm & 14-Day Dot Grid */}
      <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-content-primaryLight dark:text-content-primaryDark flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Matriks Konsistensi 14 Hari Terakhir</span>
            </h3>
            <p className="text-xs text-content-mutedLight dark:text-content-mutedDark mt-0.5">
              Setiap lingkaran mewakili hari dengan target harian yang berhasil diselesaikan.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-content-mutedLight dark:text-content-mutedDark">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary"></span>
            <span>Aktif</span>
            <span className="h-2.5 w-2.5 rounded-full bg-surface-lightPill dark:bg-surface-darkPill ml-2"></span>
            <span>Kosong</span>
          </div>
        </div>

        {/* 14-Day Visual Dots */}
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2.5 pt-2">
          {streakStats.last14Days?.map((dot) => (
            <div
              key={dot.dateStr}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                dot.active
                  ? 'bg-brand-primary text-white shadow-soft font-bold scale-105'
                  : 'bg-surface-lightPill dark:bg-surface-darkPill text-content-mutedLight dark:text-content-mutedDark'
              }`}
            >
              <span className="text-[10px] font-mono">{dot.dayNum}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full mt-1 ${
                  dot.active ? 'bg-brand-cyan' : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
