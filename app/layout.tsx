import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CookieProvider } from '@/contexts/cookie-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '小红书内容矩阵工具',
  description: '专为内部运营团队打造的小红书内容创作和监控工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <CookieProvider>
          {children}
          <Toaster />
        </CookieProvider>
      </body>
    </html>
  );
}