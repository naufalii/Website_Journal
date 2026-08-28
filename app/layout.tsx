import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { QuickActionModal } from '@/components/shared/QuickActionModal';
import { ToastContainer } from '@/components/ui/Toast';

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'NexusWorkspace | Personal Productivity OS',
  description: 'Ruang kerja digital & dashboard produktivitas harian: Goals, Jadwal, Kursus, Catatan, dan Resource Vault.',
  applicationName: 'Nexus Workspace',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nexus',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-app-light dark:bg-app-dark text-content-primaryLight dark:text-content-primaryDark min-h-screen transition-colors duration-200 antialiased selection:bg-brand-primary selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
                  <Header />
                  <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                  </main>
                </div>
              </div>

              {/* Global Command Palette (Ctrl+K / Cmd+K) */}
              <CommandPalette />

              {/* Mobile Floating Bottom Navigation */}
              <MobileNav />

              {/* Global Quick Action Modal */}
              <QuickActionModal />

              {/* Global Toast Alerts */}
              <ToastContainer />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
