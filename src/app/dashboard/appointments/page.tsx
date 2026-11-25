'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Mic, Star, Video } from 'lucide-react';
import api from '@/lib/api';
import { fmtDate, fmtTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Chip, Empty, PageHeader, Spinner, StatusChip } from '@/components/student/ui';

interface Appt {
  id: string; counselor_name: string | null; scheduled_at: string; duration_minutes: number;
  status: string; session_type: string; meeting_link: string;
}

const ICON = { video: Video, voice: Mic, text: MessageSquare, anonymous: MessageSquare } as const;
const EARLY_MS = 10 * 60e3;

function Review({ id, onDone }: { id: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async () => {
    setBusy(true); setErr('');
    try { await api.post(`/api/appointments/${id}/review/`, { rating, comment }); onDone(); }
    catch { setErr('Could not save your review. You may have already reviewed this session.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="mt-3 rounded-xl bg-secondary p-3">
      <p className="text-sm font-semibold">How was it?</p>
      <div className="mt-1 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)} className="tap grid place-items-center">
            <Star size={26} className={n <= rating ? 'fill-marigold text-marigold' : 'text-muted-foreground'} aria-hidden />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder="Anything to add? (optional)" aria-label="Comment"
        className="mt-2 w-full resize-none rounded-xl border-2 border-input bg-card px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      {err && <p role="alert" className="mt-1 text-sm text-destructive">{err}</p>}
      <Button size="sm" className="mt-2" disabled={!rating || busy} onClick={submit}>{busy ? 'Saving…' : 'Send review'}</Button>
    </div>
  );
}

function Card({ a, reload }: { a: Appt; reload: () => void }) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  const start = new Date(a.scheduled_at).getTime();
  const end = start + a.duration_minutes * 60e3;
  const isCall = a.session_type === 'video' || a.session_type === 'voice';
  const live = ['confirmed', 'in_progress'].includes(a.status);
  const canJoin = live && isCall && now >= start - EARLY_MS && now <= end + 30 * 60e3;
  const Icon = ICON[a.session_type as keyof typeof ICON] ?? MessageSquare;
  const d = new Date(a.scheduled_at);

  const cancel = async () => {
    setBusy(true);
    try { await api.patch(`/api/appointments/${a.id}/`, { status: 'cancelled' }); reload(); }
    finally { setBusy(false); setConfirmCancel(false); }
  };

  return (
    <li className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
      <div className="flex gap-4">
        <div className="grid h-16 w-16 shrink-0 place-content-center rounded-2xl bg-secondary text-center text-primary">
          <span className="text-xs font-semibold">{d.toLocaleDateString(undefined, { month: 'short' })}</span>
          <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate font-display font-semibold">{a.counselor_name ?? 'Counsellor'}</h2>
            <StatusChip status={a.status} />
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon size={14} aria-hidden /> {fmtDate(a.scheduled_at)}, {fmtTime(a.scheduled_at)} · {a.duration_minutes} min
          </p>
        </div>
      </div>

      {live && isCall && (
        canJoin ? (
          <Button asChild variant="cta" size="lg" className="mt-4 w-full"><Link href={`/call/${a.id}`}><Icon size={18} aria-hidden /> Join call</Link></Button>
        ) : now < start - EARLY_MS ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">Join opens 10 minutes before your session.</p>
        ) : null
      )}
      {live && !isCall && <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">Your counsellor will message you.</p>}
      {a.status === 'pending' && <p className="mt-3 text-sm text-muted-foreground">Waiting for your counsellor to confirm.</p>}

      {a.status === 'completed' && !reviewing && (
        <Button variant="soft" size="sm" className="mt-3" onClick={() => setReviewing(true)}>Leave a review</Button>
      )}
      {a.status === 'completed' && reviewing && <Review id={a.id} onDone={() => { setReviewing(false); reload(); }} />}

      {['pending', 'confirmed'].includes(a.status) && now < start && (
        <div className="mt-3">
          {confirmCancel ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="destructive" disabled={busy} onClick={cancel}>{busy ? 'Cancelling…' : 'Yes, cancel'}</Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmCancel(false)}>Keep it</Button>
            </div>
          ) : (
            <button onClick={() => setConfirmCancel(true)} className="tap text-sm font-semibold text-muted-foreground underline">Cancel session</button>
          )}
        </div>
      )}
    </li>
  );
}

export default function AppointmentsPage() {
  const [list, setList] = useState<Appt[] | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const load = useCallback(() => {
    api.get('/api/appointments/').then(({ data }) => setList(data.results ?? data)).catch(() => setList([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  const { upcoming, past } = useMemo(() => {
    const up: Appt[] = [], pa: Appt[] = [];
    (list ?? []).forEach((a) => (['pending', 'confirmed', 'in_progress'].includes(a.status) ? up : pa).push(a));
    up.sort((a, b) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at));
    pa.sort((a, b) => +new Date(b.scheduled_at) - +new Date(a.scheduled_at));
    return { upcoming: up, past: pa };
  }, [list]);

  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div>
      <PageHeader title="Sessions" action={<Button asChild size="sm" variant="cta"><Link href="/dashboard/counselors">Book</Link></Button>} />
      <div className="mb-4 flex gap-2">
        <Chip active={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Upcoming{upcoming.length ? ` (${upcoming.length})` : ''}</Chip>
        <Chip active={tab === 'past'} onClick={() => setTab('past')}>Past</Chip>
      </div>
      {list === null && <Spinner />}
      {list && shown.length === 0 && (
        <Empty
          title={tab === 'upcoming' ? 'No sessions booked' : 'Nothing here yet'}
          body={tab === 'upcoming' ? 'Book a time with a counsellor whenever you are ready.' : undefined}
          action={tab === 'upcoming' ? <Button asChild><Link href="/dashboard/counselors">Find a counsellor</Link></Button> : undefined}
        />
      )}
      <ul className="space-y-3">{shown.map((a) => <Card key={a.id} a={a} reload={load} />)}</ul>
    </div>
  );
}
