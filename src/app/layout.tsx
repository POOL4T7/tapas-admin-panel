import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import DashboardLayout from '@/components/layout/admin-layout';
import { AppToaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Modern admin dashboard built with Next.js and Shadcn UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <DashboardLayout>{children}</DashboardLayout>
        <AppToaster />
      </body>
    </html>
  );
}
