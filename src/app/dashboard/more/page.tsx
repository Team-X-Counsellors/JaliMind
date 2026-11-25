'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Bot, ClipboardCheck, HeartHandshake, LogOut, MessagesSquare, Network, Sparkles, Users,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/student/ui';

const items = [
  { href: '/dashboard/counselors', label: 'Counsellors', hint: 'Find and book one', icon: HeartHandshake },
  { href: '/dashboard/assessments', label: 'Check-ins', hint: 'Mood, anxiety, wellbeing', icon: ClipboardCheck },
  { href: '/dashboard/jalibot', label: 'JaliBot', hint: 'AI helper', icon: Bot },
  { href: '/dashboard/referrals', label: 'Campus help', hint: 'Offices at your university', icon: Network },
  { href: '/dashboard/circle', label: 'Circle', hint: 'Student community', icon: Users },
  { href: '/dashboard/memories', label: 'Memories', hint: 'What JaliBot remembers', icon: Sparkles },
];

export default function MorePage() {
  const { user, logout } = useAuth();
  const [wa, setWa] = useState('');
  useEffect(() => {
    api.get('/api/referrals/whatsapp/').then(({ data }) => { if (data.enabled) setWa(data.url); }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="More" />

      <div className="mb-5 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
          {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{user?.first_name || user?.username}</p>
          <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          {user?.university && <p className="truncate text-sm text-muted-foreground">{user.university}</p>}
        </div>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
        {items.map(({ href, label, hint, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="tap flex items-center gap-4 px-4 py-3.5 hover:bg-secondary/60">
              <Icon size={20} className="shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{label}</span>
                <span className="block truncate text-sm text-muted-foreground">{hint}</span>
              </span>
              <ArrowRight size={16} className="text-muted-foreground" aria-hidden />
            </Link>
          </li>
        ))}
        {wa && (
          <li>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="tap flex items-center gap-4 px-4 py-3.5 hover:bg-secondary/60">
              <MessagesSquare size={20} className="shrink-0 text-calm" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Chat with us on WhatsApp</span>
                <span className="block truncate text-sm text-muted-foreground">Opens WhatsApp</span>
              </span>
              <ArrowRight size={16} className="text-muted-foreground" aria-hidden />
            </a>
          </li>
        )}
      </ul>

      <button
        onClick={logout}
        className="tap mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-input px-4 py-3 font-semibold text-muted-foreground hover:border-destructive hover:text-destructive"
      >
        <LogOut size={18} aria-hidden /> Sign out
      </button>
    </div>
  );
}
