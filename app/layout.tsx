import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HabitHub - Build Better Habits',
  description: 'A fun, rewarding, and social way to build and maintain habits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
          {children}
        </main>
      </body>
    </html>
  );
} 