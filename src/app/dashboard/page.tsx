'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Bot, CalendarClock, ClipboardCheck, HeartHandshake, MessagesSquare, Network, Users, Video,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { fmtDate, fmtTime } from '@/lib/format';
import JaliPattern from '@/components/student/JaliPattern';
import { StatusChip } from '@/components/student/ui';

interface Appt {
  id: string; counselor_name: string | null; scheduled_at: string; status: string; session_type: string;
}

const tools = [
  { href: '/dashboard/counselors', label: 'Book a counsellor', hint: 'Video, voice or text', icon: HeartHandshake },
  { href: '/dashboard/jalibot', label: 'Ask JaliBot', hint: 'AI helper, replies in seconds', icon: Bot },
  { href: '/dashboard/referrals', label: 'Campus help', hint: 'Advisors, bursary, clinic', icon: Network },
  { href: '/dashboard/circle', label: 'Circle', hint: 'Talk with other students', icon: Users },
];

const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<Appt[] | null>(null);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    api.get('/api/appointments/').then(({ data }) => setAppts(data.results ?? data)).catch(() => setAppts([]));
  }, []);

  const next = useMemo(
    () => (appts ?? [])
      .filter((a) => ['pending', 'confirmed', 'in_progress'].includes(a.status) && new Date(a.scheduled_at).getTime() > now - 2 * 3600e3)
      .sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at))[0],
    [appts, now],
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-night p-6 text-white shadow-pop">
        <JaliPattern />
        <div className="relative">
          <p className="text-sm text-white/70">{greet()}{user?.first_name ? `, ${user.first_name}` : ''}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-balance">How are you, really?</h1>
          <Link
            href="/talk"
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-marigold px-5 py-4 text-night shadow-pop transition-transform active:scale-[0.99]"
          >
            <span>
              <span className="block font-display text-lg font-bold">Talk to someone now</span>
              <span className="block text-sm text-night/70">Anonymous. A real counsellor.</span>
            </span>
            <MessagesSquare size={26} aria-hidden />
          </Link>
        </div>
      </section>

      {next && (
        <Link href="/dashboard/appointments" className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            {next.session_type === 'video' ? <Video size={24} aria-hidden /> : <CalendarClock size={24} aria-hidden />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-muted-foreground">Your next session</span>
            <span className="block truncate font-display font-semibold">{next.counselor_name ?? 'Your counsellor'}</span>
            <span className="block text-sm text-muted-foreground">{fmtDate(next.scheduled_at)} at {fmtTime(next.scheduled_at)}</span>
          </span>
          <StatusChip status={next.status} />
        </Link>
      )}

      <Link href="/dashboard/assessments" className="flex items-center gap-4 rounded-2xl bg-lagoon/15 p-4 ring-1 ring-lagoon/30">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lagoon text-white"><ClipboardCheck size={22} aria-hidden /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold">Quick check-in</span>
          <span className="block text-sm text-muted-foreground">1 to 2 minutes. See how you&apos;re doing over time.</span>
        </span>
        <ArrowRight size={18} className="text-calm" aria-hidden />
      </Link>

      <section aria-label="More ways we can help">
        <h2 className="mb-2 px-1 font-display text-sm font-semibold text-muted-foreground">More ways we can help</h2>
        <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
          {tools.map(({ href, label, hint, icon: Icon }) => (
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
        </ul>
      </section>
    </div>
  );
}
