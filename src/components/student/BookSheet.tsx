'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle2, MessageSquare, Mic, Video, X } from 'lucide-react';
import api from '@/lib/api';
import { fmtDate, fmtTime, ymd } from '@/lib/format';
import { Button } from '@/components/ui/button';

export interface BookableCounselor { id: string; user_name: string }

type SessionType = 'video' | 'voice' | 'text';

const TYPES: { key: SessionType; label: string; icon: typeof Video; hint: string }[] = [
  { key: 'video', label: 'Video', icon: Video, hint: 'See each other' },
  { key: 'voice', label: 'Voice', icon: Mic, hint: 'Audio only' },
  { key: 'text', label: 'Text', icon: MessageSquare, hint: 'Type, no call' },
];

/** Bottom sheet on phones, centred dialog on larger screens. Pick a day, a time, a format. */
export default function BookSheet({ counselor, onClose }: { counselor: BookableCounselor | null; onClose: () => void }) {
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }), []);
  const [day, setDay] = useState(days[0]);
  const [times, setTimes] = useState<string[] | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [type, setType] = useState<SessionType>('video');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!counselor) return;
    setDay(days[0]); setTime(null); setType('video'); setNote(''); setError(''); setDone(false);
  }, [counselor, days]);

  useEffect(() => {
    if (!counselor) return;
    let live = true;
    setTimes(null); setTime(null);
    api.get(`/api/counselors/${counselor.id}/times/`, { params: { date: ymd(day) } })
      .then(({ data }) => { if (live) setTimes(data.times); })
      .catch(() => { if (live) setTimes([]); });
    return () => { live = false; };
  }, [counselor, day]);

  const confirm = async () => {
    if (!counselor || !time) return;
    setBusy(true); setError('');
    try {
      await api.post(`/api/counselors/${counselor.id}/book/`, {
        scheduled_at: time, session_type: type, duration_minutes: 60, notes: note,
      });
      setDone(true);
    } catch (e) {
      const d = (e as { response?: { data?: Record<string, string[] | string> } })?.response?.data;
      const first = d ? Object.values(d).flat()[0] : null;
      setError(typeof first === 'string' ? first : 'We could not book that time. Pick another and try again.');
    } finally { setBusy(false); }
  };

  return (
    <Dialog.Root open={!!counselor} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-night/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl bg-background shadow-pop focus:outline-none md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <Dialog.Title className="font-display text-xl font-bold">
              {done ? 'Request sent' : `Book ${counselor?.user_name ?? ''}`}
            </Dialog.Title>
            <Dialog.Close className="tap grid place-items-center rounded-full text-muted-foreground hover:bg-secondary" aria-label="Close">
              <X size={20} aria-hidden />
            </Dialog.Close>
          </div>

          {done ? (
            <div className="px-5 pb-8 pt-4 text-center">
              <CheckCircle2 size={48} className="mx-auto text-calm" aria-hidden />
              <p className="mt-3 font-display text-lg font-semibold">You asked for {time && `${fmtDate(time)} at ${fmtTime(time)}`}</p>
              <p className="mt-1 text-sm text-muted-foreground">Your counsellor will confirm. You&apos;ll see it under Sessions.</p>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild variant="cta" size="lg"><Link href="/dashboard/appointments">See my sessions</Link></Button>
                <Button variant="ghost" onClick={onClose}>Done</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-4 pt-2">
                <section>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Day</h3>
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none" role="radiogroup" aria-label="Day">
                    {days.map((d) => {
                      const on = ymd(d) === ymd(day);
                      return (
                        <button
                          key={ymd(d)} role="radio" aria-checked={on} onClick={() => setDay(d)}
                          className={`tap flex w-16 shrink-0 flex-col items-center rounded-2xl px-2 py-2.5 ${on ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card ring-1 ring-border'}`}
                        >
                          <span className="text-xs">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                          <span className="font-display text-lg font-bold">{d.getDate()}</span>
                          <span className="text-xs">{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Time</h3>
                  {times === null && <p className="text-sm text-muted-foreground" role="status">Checking times…</p>}
                  {times && times.length === 0 && <p className="rounded-xl bg-secondary px-4 py-3 text-sm">Nothing free this day. Try another day.</p>}
                  {times && times.length > 0 && (
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Time">
                      {times.map((t) => (
                        <button
                          key={t} role="radio" aria-checked={time === t} onClick={() => setTime(t)}
                          className={`tap rounded-xl py-2.5 text-sm font-semibold ${time === t ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card ring-1 ring-border hover:ring-primary'}`}
                        >
                          {fmtTime(t)}
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">How</h3>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Session type">
                    {TYPES.map(({ key, label, icon: Icon, hint }) => (
                      <button
                        key={key} role="radio" aria-checked={type === key} onClick={() => setType(key)}
                        className={`tap flex flex-col items-center gap-1 rounded-2xl px-2 py-3 ${type === key ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card ring-1 ring-border hover:ring-primary'}`}
                      >
                        <Icon size={20} aria-hidden />
                        <span className="text-sm font-semibold">{label}</span>
                        <span className={`text-[11px] ${type === key ? 'text-white/75' : 'text-muted-foreground'}`}>{hint}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label htmlFor="note" className="mb-2 block text-sm font-semibold text-muted-foreground">
                    Anything they should know? <span className="font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500}
                    className="w-full resize-none rounded-xl border-2 border-input bg-card px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </section>
              </div>

              <div className="border-t border-border px-5 pb-safe pt-3">
                {error && <p role="alert" className="mb-2 text-sm text-destructive">{error}</p>}
                <Button variant="cta" size="lg" className="mb-2 w-full" disabled={!time || busy} onClick={confirm}>
                  {busy ? 'Sending…' : time ? `Request ${fmtDate(time)}, ${fmtTime(time)}` : 'Pick a time'}
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
