import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JaliMind — Guidance & Counselling for University Students',
  description: 'AI-powered mental health and guidance platform supporting university students across Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
