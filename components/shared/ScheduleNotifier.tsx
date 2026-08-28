'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { getLocalDateString } from '@/lib/utils';
import { sendScheduleNotification, areNotificationsEnabled } from '@/lib/notifications';

export function ScheduleNotifier() {
  const { schedules, showToast } = useApp();
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkUpcomingSchedules = () => {
      const todayStr = getLocalDateString();
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const nowTotalMinutes = currentHours * 60 + currentMinutes;

      // Filter today's uncompleted schedules
      const todaySchedules = schedules.filter(
        (s) => s.date === todayStr && !s.completed
      );

      todaySchedules.forEach((item) => {
        const [sh, sm] = item.startTime.split(':').map(Number);
        const itemStartTotalMinutes = sh * 60 + sm;
        const diffMinutes = itemStartTotalMinutes - nowTotalMinutes;

        // Trigger notification at 15 minutes before or exactly at start time (0 to 1 min)
        if (
          (diffMinutes > 0 && diffMinutes <= 15) ||
          (diffMinutes >= 0 && diffMinutes < 1)
        ) {
          const notificationKey = `${item.id}_${diffMinutes <= 1 ? 'start' : '15m'}_${todayStr}`;

          if (!notifiedIdsRef.current.has(notificationKey)) {
            notifiedIdsRef.current.add(notificationKey);

            const title =
              diffMinutes <= 1
                ? `⏰ Agenda Dimulai Sekarang: ${item.title}`
                : `⏰ Pengingat (15 mnt lagi): ${item.title}`;

            const body = `Pukul ${item.startTime} - ${item.endTime} (${item.category}). ${
              item.locationOrLink ? `Lokasi: ${item.locationOrLink}` : ''
            }`;

            // 1. Send Browser / Service Worker Notification if enabled
            if (areNotificationsEnabled()) {
              sendScheduleNotification(title, body, item.id);
            }

            // 2. In-App Toast Notification
            showToast(title, body, 'info');
          }
        }
      });
    };

    // Check immediately on mount
    checkUpcomingSchedules();

    // Run interval every 30 seconds
    const interval = setInterval(checkUpcomingSchedules, 30000);
    return () => clearInterval(interval);
  }, [schedules, showToast]);

  return null;
}
