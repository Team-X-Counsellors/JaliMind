'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { fmtDate, telHref } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Empty, PageHeader, Spinner, StatusChip } from '@/components/student/ui';

interface Office {
  id: string; category: string; category_label: string; name: string; description: string;
  phone: string; email: string; location: string; whatsapp_url: string;
}
interface Referral { id: string; status: string; note: string; created_at: string; resource: Office; referred_by_counselor?: boolean }

function Ask({ office, onDone }: { office: Office; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const send = async () => {
    setBusy(true); setErr('');
    try { await api.post('/api/referrals/', { resource: office.id, note }); setOpen(false); setNote(''); onDone(); }
    catch { setErr('Could not send your request. Try again.'); }
    finally { setBusy(false); }
  };
  if (!open) return <Button variant="soft" size="sm" onClick={() => setOpen(true)}>Ask for a referral</Button>;
  return (
    <div className="mt-3 w-full rounded-xl bg-secondary p-3">
      <label htmlFor={`n-${office.id}`} className="text-sm font-semibold">What do you need help with?</label>
      <textarea id={`n-${office.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500}
        className="mt-1 w-full resize-none rounded-xl border-2 border-input bg-card px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      {err && <p role="alert" className="mt-1 text-sm text-destructive">{err}</p>}
      <div className="mt-2 flex gap-2">
        <Button size="sm" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send request'}</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const [offices, setOffices] = useState<Office[] | null>(null);
  const [mine, setMine] = useState<Referral[]>([]);

  const loadMine = useCallback(() => api.get('/api/referrals/').then(({ data }) => setMine(data.results ?? data)).catch(() => {}), []);
  useEffect(() => {
    api.get('/api/referrals/resources/').then(({ data }) => setOffices(data.results ?? data)).catch(() => setOffices([]));
    loadMine();
  }, [loadMine]);

  const groups = useMemo(() => {
    const m = new Map<string, Office[]>();
    (offices ?? []).forEach((o) => m.set(o.category_label, [...(m.get(o.category_label) ?? []), o]));
    return [...m.entries()];
  }, [offices]);

  return (
    <div>
      <PageHeader
        title="Campus help"
        subtitle={user?.university ? `Offices at ${user.university} that can help.` : 'Offices on campus that can help. Add your university in your profile to see yours.'}
      />
      {offices === null && <Spinner />}
      {offices && offices.length === 0 && <Empty title="No offices listed yet" body="We are adding campus contacts. Check back soon." />}

      <div className="space-y-6">
        {groups.map(([label, list]) => (
          <section key={label} aria-label={label}>
            <h2 className="mb-2 px-1 font-display text-sm font-semibold text-muted-foreground">{label}</h2>
            <ul className="space-y-3">
              {list.map((o) => (
                <li key={o.id} className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                  <h3 className="font-display font-semibold">{o.name}</h3>
                  {o.description && <p className="mt-0.5 text-sm text-muted-foreground">{o.description}</p>}
                  {o.location && <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14} aria-hidden /> {o.location}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {o.phone && <Button asChild size="sm" variant="outline"><a href={telHref(o.phone)}><Phone size={14} aria-hidden /> Call</a></Button>}
                    {o.whatsapp_url && <Button asChild size="sm" variant="outline"><a href={o.whatsapp_url} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} aria-hidden /> WhatsApp</a></Button>}
                    {o.email && <Button asChild size="sm" variant="outline"><a href={`mailto:${o.email}`}><Mail size={14} aria-hidden /> Email</a></Button>}
                    <Ask office={o} onDone={loadMine} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {mine.length > 0 && (
          <section aria-label="My referrals">
            <h2 className="mb-2 px-1 font-display text-sm font-semibold text-muted-foreground">My referrals</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
              {mine.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{r.resource.name}</p>
                    <p className="text-sm text-muted-foreground">{fmtDate(r.created_at)}{r.referred_by_counselor ? ' · from your counsellor' : ''}</p>
                  </div>
                  <StatusChip status={r.status} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
