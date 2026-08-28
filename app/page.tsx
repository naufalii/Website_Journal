'use client';

import React, { useState } from 'react';
import { GreetingBanner } from '@/components/dashboard/GreetingBanner';
import { StatCards } from '@/components/dashboard/StatCards';
import { HorizontalDateStrip } from '@/components/dashboard/HorizontalDateStrip';
import { TodayGoalsWidget } from '@/components/dashboard/TodayGoalsWidget';
import { TodayScheduleWidget } from '@/components/dashboard/TodayScheduleWidget';
import { ActiveCoursesWidget } from '@/components/dashboard/ActiveCoursesWidget';
import { RecentNotesWidget } from '@/components/dashboard/RecentNotesWidget';
import { getLocalDateString } from '@/lib/utils';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString());

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Friendly Greeting Header */}
      <GreetingBanner />

      {/* 2x2 Metrics Summary Grid */}
      <StatCards />

      {/* Horizontal 7-Day Calendar Strip */}
      <HorizontalDateStrip
        selectedDate={selectedDate}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Two Column Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Goals & Schedule for Selected Date */}
        <div className="space-y-6">
          <TodayGoalsWidget selectedDate={selectedDate} />
          <TodayScheduleWidget selectedDate={selectedDate} />
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
