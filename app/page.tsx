'use client';

import React from 'react';
import { GreetingBanner } from '@/components/dashboard/GreetingBanner';
import { SupabaseSetupBanner } from '@/components/shared/SupabaseSetupBanner';
import { StatCards } from '@/components/dashboard/StatCards';
import { TodayGoalsWidget } from '@/components/dashboard/TodayGoalsWidget';
import { TodayScheduleWidget } from '@/components/dashboard/TodayScheduleWidget';
import { ActiveCoursesWidget } from '@/components/dashboard/ActiveCoursesWidget';
import { RecentNotesWidget } from '@/components/dashboard/RecentNotesWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Supabase Connection / Auth Banner */}
      <SupabaseSetupBanner />

      {/* Dynamic Greeting & Live Banner */}
      <GreetingBanner />

      {/* Overview Stat Cards */}
      <StatCards />

      {/* Two Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Goals & Schedule */}
        <div className="space-y-6">
          <TodayGoalsWidget />
          <TodayScheduleWidget />
        </div>

        {/* Right Column: Courses & Notes */}
        <div className="space-y-6">
          <ActiveCoursesWidget />
          <RecentNotesWidget />
        </div>
      </div>
    </div>
  );
}
