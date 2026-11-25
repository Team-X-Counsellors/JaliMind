'use client';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NotebookPen } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import ApptRow, { JoinLink } from '@/components/counselor/ApptRow';
import Sheet from '@/components/counselor/Sheet';
import { Appt, errorText, fetchAllAppointments, usePolling } from '@/lib/counselor';

type Tab = 'requests' | 'upcoming' | 'past';
const TABS: { key: Tab; label: string }[] = [
  { key: 'requests', label: 'Requests' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

function Sessions() {
  const router = useRouter();
  const params = useSearchParams();
  const completeParam = params.get('complete');
  const { data, error, loading, refresh } = usePolling(fetchAllAppointments, 20000);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [sheet, setSheet] = useState<{ kind: 'complete' | 'notes' | 'decline'; appt: Appt } | null>(null);
  const [notes, setNotes] = useState('');
  const [openedFor, setOpenedFor] = useState<string | null>(null);

  const groups = useMemo(() => {
    const all = data ?? [];
    const asc = (a: Appt, b: Appt) => +new Date(a.scheduled_at) - +new Date(b.scheduled_at);
    return {
      requests: all.filter((a) => a.status === 'pending').sort(asc),
      upcoming: all.filter((a) => a.status === 'confirmed' || a.status === 'in_progress').sort(asc),
      past: all.filter((a) => ['completed', 'cancelled', 'no_show'].includes(a.status)).sort((a, b) => asc(b, a)),
    };
  }, [data]);

  const open = useCallback((kind: 'complete' | 'notes' | 'decline', appt: Appt) => {
    setNotes(kind === 'decline' ? '' : appt.counselor_notes ?? '');
    setSheet({ kind, appt });
  }, []);

  // Arriving from the call room: suggest completing that session straight away.
  useEffect(() => {
    if (!completeParam || !data || openedFor === completeParam) return;
    const appt = data.find((a) => a.id === completeParam);
    if (appt && appt.status !== 'completed') { setTab('upcoming'); open('complete', appt); }
    setOpenedFor(completeParam);
  }, [completeParam, data, openedFor, open]);

  const run = async (id: string, path: string, body: object = {}) => {
    setBusy(id); setMsg(null);
    try { await api.post(`/api/appointments/${id}/${path}/`, body); await refresh(); return true; }
    catch (e) { setMsg(errorText(e)); return false; }
    finally { setBusy(null); }
  };

  const close = () => { setSheet(null); if (completeParam) router.replace('/counselor/sessions'); };

  const submit = async () => {
    if (!sheet) return;
    const ok = sheet.kind === 'complete' ? await run(sheet.appt.id, 'complete', { counselor_notes: notes })
      : sheet.kind === 'notes' ? await run(sheet.appt.id, 'notes', { counselor_notes: notes })
      : await run(sheet.appt.id, 'decline', { reason: notes });
    if (ok) close();
  };

  const list = groups[tab];

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Sessions</h1>

      <div role="tablist" aria-label="Session groups" className="grid grid-cols-3 gap-1 rounded-full bg-secondary p-1">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`tap rounded-full px-2 text-sm font-semibold transition-colors ${tab === t.key ? 'bg-card text-primary shadow-soft' : 'text-secondary-foreground/70'}`}>
            {t.label}
            {groups[t.key].length > 0 && t.key !== 'past' && <span className="ml-1.5 rounded-full bg-marigold px-1.5 text-xs text-night">{groups[t.key].length}</span>}
          </button>
        ))}
      </div>

      {msg && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{msg}</p>}
      {loading && <p className="py-10 text-center text-muted-foreground" role="status">Loading…</p>}
      {error && !data && <p className="text-destructive" role="alert">{error} <button className="underline" onClick={refresh}>Retry</button></p>}

      {!loading && list.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
          {tab === 'requests' ? 'No requests waiting for you.' : tab === 'upcoming' ? 'No confirmed sessions. Open more times in Schedule so students can book.' : 'Finished sessions will show here.'}
        </p>
      )}

      <ul className="space-y-3" role="tabpanel">
        {list.map((a) => (
          <ApptRow key={a.id} appt={a} showStatus={tab === 'past'} actions={
            tab === 'requests' ? <>
              <Button variant="calm" className="flex-1 sm:flex-none" disabled={busy === a.id} onClick={() => run(a.id, 'confirm')}>Confirm</Button>
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => open('decline', a)}>Decline</Button>
            </> : tab === 'upcoming' ? <>
              <JoinLink appt={a} />
              <Button variant="soft" onClick={() => open('complete', a)}>Mark complete</Button>
              <Button variant="ghost" onClick={() => open('decline', a)}>Cancel</Button>
            </> : a.status === 'completed' ? (
              <Button variant="soft" onClick={() => open('notes', a)}><NotebookPen size={16} /> Session notes</Button>
            ) : null
          } />
        ))}
      </ul>

      <Sheet open={!!sheet} onClose={close}
        title={sheet?.kind === 'complete' ? `Complete session with ${sheet.appt.student_name}` : sheet?.kind === 'notes' ? 'Session notes' : `${sheet?.appt.status === 'pending' ? 'Decline' : 'Cancel'} session?`}>
        <label htmlFor="sheet-text" className="mb-1.5 block text-sm font-medium">
          {sheet?.kind === 'decline' ? 'Reason (the student will see this)' : 'Private notes (only you can see these)'}
        </label>
        <textarea id="sheet-text" value={notes} onChange={(e) => setNotes(e.target.value)} rows={sheet?.kind === 'decline' ? 3 : 6} maxLength={sheet?.kind === 'decline' ? 300 : 5000}
          placeholder={sheet?.kind === 'decline' ? 'e.g. I’m unwell. Please pick another time.' : 'What was discussed, what helped, what to follow up…'}
          className="w-full rounded-xl border-2 border-input bg-card p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        {sheet && sheet.kind !== 'decline' && sheet.appt.counselor_notes === undefined && (
          <p className="mt-2 text-xs text-muted-foreground">Heads up: saving replaces any notes you saved earlier for this session.</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={close}>Not now</Button>
          <Button variant={sheet?.kind === 'decline' ? 'destructive' : 'cta'} className="flex-1" disabled={!!busy} onClick={submit}>
            {sheet?.kind === 'complete' ? 'Mark complete' : sheet?.kind === 'notes' ? 'Save notes' : 'Confirm'}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

export default function SessionsPage() {
  return <Suspense fallback={<p className="py-16 text-center text-muted-foreground" role="status">Loading…</p>}><Sessions /></Suspense>;
}
