'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, Siren, Star } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import ApptRow, { JoinLink } from '@/components/counselor/ApptRow';
import Sheet from '@/components/counselor/Sheet';
import { useBadge } from '@/components/counselor/CounselorShell';
import { Appt, errorText, usePolling } from '@/lib/counselor';

interface Overview {
  name: string;
  is_available: boolean;
  pending_requests: Appt[];
  upcoming: Appt[];
  stats: { sessions_completed: number; today: number; rating: number; waiting_chats: number; urgent_chats: number; my_open_chats: number };
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function CounselorHome() {
  const { data, setData, error, loading, refresh } = usePolling<Overview>(
    async () => (await api.get('/api/counselors/dashboard/')).data, 15000);
  const badge = useBadge();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [declining, setDeclining] = useState<Appt | null>(null);
  const [reason, setReason] = useState('');

  const act = async (id: string, path: 'confirm' | 'decline', body?: object) => {
    setBusy(id); setMsg(null);
    try {
      await api.post(`/api/appointments/${id}/${path}/`, body ?? {});
      await refresh();
    } catch (e) { setMsg(errorText(e)); } finally { setBusy(null); }
  };

  const toggle = async () => {
    if (!data) return;
    const next = !data.is_available;
    setData({ ...data, is_available: next }); // optimistic
    try { await api.patch('/api/counselors/dashboard/', { is_available: next }); }
    catch (e) { setData({ ...data, is_available: !next }); setMsg(errorText(e)); }
  };

  if (loading) return <p className="py-16 text-center text-muted-foreground" role="status">Loading…</p>;
  if (error || !data) return <p className="py-16 text-center text-destructive" role="alert">{error ?? 'Could not load.'} <button className="underline" onClick={refresh}>Retry</button></p>;

  const { stats } = data;
  const waiting = badge.waiting || stats.waiting_chats;
  const urgent = badge.urgent || stats.urgent_chats;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{greeting()}, {data.name}</h1>
          <p className="text-sm text-muted-foreground">{stats.today ? `${stats.today} session${stats.today > 1 ? 's' : ''} today` : 'Nothing booked for the rest of today'}</p>
        </div>
        <button role="switch" aria-checked={data.is_available} onClick={toggle}
          className={`tap flex shrink-0 items-center gap-2 rounded-full border-2 px-3 text-sm font-semibold ${data.is_available ? 'border-lagoon bg-lagoon/10 text-[#0F6F63]' : 'border-border bg-card text-muted-foreground'}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${data.is_available ? 'bg-lagoon' : 'bg-muted-foreground/50'}`} />
          {data.is_available ? 'Taking bookings' : 'Away'}
        </button>
      </div>

      {msg && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{msg}</p>}

      {/* The anonymous queue is the most time-sensitive thing here, so it leads. */}
      <Link href="/counselor/chats"
        className={`block rounded-3xl p-5 shadow-pop transition-transform active:scale-[0.99] ${urgent ? 'bg-hibiscus text-white' : waiting ? 'bg-night text-white' : 'bg-card text-foreground border border-border'}`}>
        <div className="flex items-center gap-4">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${waiting ? 'bg-white/15' : 'bg-secondary text-primary'}`}>
            {urgent ? <Siren size={24} /> : <CheckCircle2 size={24} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold">
              {urgent ? `${urgent} urgent chat${urgent > 1 ? 's' : ''} waiting` : waiting ? `${waiting} student${waiting > 1 ? 's' : ''} waiting` : 'No one waiting'}
            </p>
            <p className={`text-sm ${waiting ? 'text-white/80' : 'text-muted-foreground'}`}>
              {waiting ? 'Anonymous chat. Someone reached out and nobody has answered yet.' : `Queue is clear. You have ${stats.my_open_chats} open chat${stats.my_open_chats === 1 ? '' : 's'}.`}
            </p>
          </div>
          <ArrowRight className="shrink-0" />
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Today', value: stats.today, icon: CalendarCheck },
          { label: 'Completed', value: stats.sessions_completed, icon: CheckCircle2 },
          { label: 'Rating', value: stats.rating ? stats.rating.toFixed(1) : '–', icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border/70 bg-card p-3 text-center shadow-soft sm:p-4">
            <Icon size={18} className="mx-auto mb-1 text-primary" />
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="req">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="req" className="font-display text-lg font-bold">Booking requests {data.pending_requests.length > 0 && <span className="ml-1 rounded-full bg-marigold px-2 py-0.5 text-sm text-night">{data.pending_requests.length}</span>}</h2>
          <Link href="/counselor/sessions" className="text-sm font-semibold text-primary">All sessions</Link>
        </div>
        {data.pending_requests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-center text-sm text-muted-foreground">No new requests. Students can book you from your open times.</p>
        ) : (
          <ul className="space-y-3">
            {data.pending_requests.map((a) => (
              <ApptRow key={a.id} appt={a} actions={<>
                <Button variant="calm" className="flex-1 sm:flex-none" disabled={busy === a.id} onClick={() => act(a.id, 'confirm')}>Confirm</Button>
                <Button variant="outline" className="flex-1 sm:flex-none" disabled={busy === a.id} onClick={() => { setDeclining(a); setReason(''); }}>Decline</Button>
              </>} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="up">
        <h2 id="up" className="mb-3 font-display text-lg font-bold">Coming up</h2>
        {data.upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-center text-sm text-muted-foreground">No confirmed sessions yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.upcoming.map((a) => <ApptRow key={a.id} appt={a} actions={<JoinLink appt={a} />} />)}
          </ul>
        )}
      </section>

      <Sheet open={!!declining} onClose={() => setDeclining(null)} title={`Decline ${declining?.student_name ?? ''}?`}>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">Reason (the student will see this)</label>
        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={300}
          placeholder="e.g. I'm away that day. Please pick another time."
          className="w-full rounded-xl border-2 border-input bg-card p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setDeclining(null)}>Keep request</Button>
          <Button variant="destructive" className="flex-1" disabled={busy === declining?.id}
            onClick={async () => { if (declining) { await act(declining.id, 'decline', { reason }); setDeclining(null); } }}>
            Decline
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
