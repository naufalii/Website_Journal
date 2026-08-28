import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics & Insight | NexusWorkspace',
  description: 'Grafik performa produktivitas, matriks konsistensi, dan alokasi waktu.',
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
