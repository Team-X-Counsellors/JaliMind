'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { DAYS, errorText, trimTime, usePolling } from '@/lib/counselor';

interface Slot { id: number; day_of_week: number; start_time: string; end_time: string; is_active: boolean }

export default function SchedulePage() {
  const { data, error, loading, refresh } = usePolling<Slot[]>(async () => (await api.get('/api/counselors/me/availability/')).data, null);
  const [day, setDay] = useState(0);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('12:00');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (start >= end) { setMsg('End time must be after the start time.'); return; }
    setSaving(true);
    try {
      await api.post('/api/counselors/me/availability/', { day_of_week: day, start_time: start, end_time: end });
      await refresh();
    } catch (err) { setMsg(errorText(err)); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    setMsg(null);
    try { await api.delete(`/api/counselors/me/availability/${id}/`); await refresh(); }
    catch (err) { setMsg(errorText(err)); }
  };

  const slots = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Your open times</h1>
        <p className="mt-1 text-sm text-muted-foreground">Students can book one-hour sessions inside these windows. Times are in your local time.</p>
      </div>

      <form onSubmit={add} className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
        <p className="font-display font-semibold">Add a window</p>
        <div>
          <p className="mb-1.5 text-sm font-medium" id="day-label">Day</p>
          <div role="radiogroup" aria-labelledby="day-label" className="flex flex-wrap gap-1.5">
            {DAYS.map((d, i) => (
              <button type="button" key={d} role="radio" aria-checked={day === i} onClick={() => setDay(i)}
                className={`tap rounded-full px-3.5 text-sm font-semibold ${day === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">From
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required className="mt-1.5 h-12 w-full rounded-xl border-2 border-input bg-card px-3 text-base" />
          </label>
          <label className="text-sm font-medium">To
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required className="mt-1.5 h-12 w-full rounded-xl border-2 border-input bg-card px-3 text-base" />
          </label>
        </div>
        {msg && <p role="alert" className="text-sm text-destructive">{msg}</p>}
        <Button type="submit" variant="cta" className="w-full" disabled={saving}><Plus size={18} /> {saving ? 'Adding…' : `Add ${DAYS[day]}`}</Button>
      </form>

      {loading && <p className="text-center text-muted-foreground" role="status">Loading…</p>}
      {error && !data && <p role="alert" className="text-destructive">{error} <button className="underline" onClick={refresh}>Retry</button></p>}

      {data && slots.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
          You have no open times, so students cannot book you. Add a window above.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {DAYS.map((name, i) => {
          const daySlots = slots.filter((s) => s.day_of_week === i).sort((a, b) => a.start_time.localeCompare(b.start_time));
          if (!daySlots.length) return null;
          return (
            <section key={name} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft" aria-label={name}>
              <h2 className="mb-2 font-display font-semibold">{name}</h2>
              <ul className="flex flex-wrap gap-2">
                {daySlots.map((s) => (
                  <li key={s.id} className="flex items-center gap-1 rounded-full bg-secondary py-1 pl-4 pr-1 text-sm font-semibold text-secondary-foreground">
                    {trimTime(s.start_time)} – {trimTime(s.end_time)}
                    <button onClick={() => remove(s.id)} aria-label={`Remove ${name} ${trimTime(s.start_time)} to ${trimTime(s.end_time)}`}
                      className="tap flex h-9 min-h-0 w-9 min-w-0 items-center justify-center rounded-full hover:bg-card">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
