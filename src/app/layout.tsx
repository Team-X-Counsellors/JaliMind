import type { Metadata, Viewport } from 'next';
import { Lexend, Figtree } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import DevServiceWorkerReset from '@/components/DevServiceWorkerReset';
import './globals.css';

// Lexend was designed for reading proficiency; kind to anyone reading while stressed.
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend', display: 'swap' });
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' });

export const metadata: Metadata = {
  title: 'JaliMind: talk to someone who gets it',
  description: 'Private, free guidance and counselling for university students across Africa. Chat anonymously, book a counsellor, or ask JaliBot.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets us use safe-area insets under the bottom nav
  themeColor: '#17163B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${figtree.variable}`}>
      <body>
        <DevServiceWorkerReset />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
