'use client';
import { useEffect, useMemo, useState } from 'react';
import { Languages, Star } from 'lucide-react';
import api from '@/lib/api';
import { initials } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empty, PageHeader, Spinner } from '@/components/student/ui';
import BookSheet from '@/components/student/BookSheet';

interface Counselor {
  id: string; user_name: string; bio: string; specialties: string[]; languages: string[];
  years_experience: number; is_available: boolean; rating: string; total_sessions: number; avatar: string | null;
}

const LANG: Record<string, string> = { en: 'English', sw: 'Swahili', fr: 'French', ig: 'Igbo', ha: 'Hausa', tw: 'Twi', yo: 'Yoruba' };

export default function CounselorsPage() {
  const [list, setList] = useState<Counselor[] | null>(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<Counselor | null>(null);

  useEffect(() => {
    api.get('/api/counselors/')
      .then(({ data }) => setList(data.results ?? data))
      .catch(() => { setError('We could not load counsellors. Pull to refresh or try again.'); setList([]); });
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (list ?? []).filter((c) => !s || c.user_name.toLowerCase().includes(s) || c.specialties.some((x) => x.toLowerCase().includes(s)));
  }, [list, q]);

  return (
    <div>
      <PageHeader title="Counsellors" subtitle="Real, verified people. Pick a time that suits you." />
      <Input type="search" placeholder="Search by name or topic" aria-label="Search counsellors" value={q} onChange={(e) => setQ(e.target.value)} className="mb-5" />

      {list === null && <Spinner label="Finding counsellors" />}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {list && !error && shown.length === 0 && <Empty title="No counsellors match" body="Try a different name or topic." />}

      <ul className="space-y-3">
        {shown.map((c) => (
          <li key={c.id} className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
            <div className="flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground">
                {initials(c.user_name)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-display font-semibold">{c.user_name}</h2>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                  <span>{c.years_experience} yrs experience</span>
                  {Number(c.rating) > 0 && <span className="inline-flex items-center gap-1"><Star size={13} className="fill-marigold text-marigold" aria-hidden />{Number(c.rating).toFixed(1)}</span>}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{s}</span>
                  ))}
                </div>
                {c.languages.length > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Languages size={14} aria-hidden /> {c.languages.map((l) => LANG[l] ?? l).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <Button variant={c.is_available ? 'default' : 'outline'} className="mt-4 w-full" disabled={!c.is_available} onClick={() => setBooking(c)}>
              {c.is_available ? 'See times' : 'Not taking bookings right now'}
            </Button>
          </li>
        ))}
      </ul>

      <BookSheet counselor={booking} onClose={() => setBooking(null)} />
    </div>
  );
}
