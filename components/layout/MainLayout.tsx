'use client';

import { TopNavbar } from './TopNavbar';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <TopNavbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}