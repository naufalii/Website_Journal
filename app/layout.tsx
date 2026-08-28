import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { QuickActionModal } from '@/components/shared/QuickActionModal';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'NexusWorkspace | All-in-One Personal Workspace & Productivity Dashboard',
  description: 'Ruang kerja digital & dashboard produktivitas pribadi: Goals, Jadwal, Kursus, Catatan, dan Resource Vault tersinkronisasi multi-device dengan Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <AppProvider>
            <div className="flex min-h-screen">
              {/* Desktop Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
                <Header />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </main>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Global Quick Action Modal */}
            <QuickActionModal />

            {/* Global Toast Alerts */}
            <ToastContainer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
