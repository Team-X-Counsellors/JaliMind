'use client';
import { useState } from 'react';
import { ClipboardList, Send, ShieldAlert } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import Sheet from '@/components/counselor/Sheet';
import { errorText, fmtDay, usePolling } from '@/lib/counselor';

interface Student { student_id: number | string; name: string; university: string; sessions: number; completed: number }
interface Shared {
  id: string; instrument: string; title: string; score: number; max_score: number; severity: string; severity_label: string;
  risk_flag: boolean; student_name: string; shared_at: string; higher_is_better: boolean;
}
interface Office { id: string; name: string; category_label: string; description: string; university: string }

const TONE: Record<string, string> = {
  minimal: 'bg-lagoon/15 text-[#0F6F63]', good: 'bg-lagoon/15 text-[#0F6F63]', mild: 'bg-marigold/25 text-night', low: 'bg-marigold/25 text-night',
  moderate: 'bg-marigold/40 text-night', moderately_severe: 'bg-hibiscus/15 text-hibiscus', severe: 'bg-hibiscus/15 text-hibiscus', very_low: 'bg-hibiscus/15 text-hibiscus',
};

export default function StudentsPage() {
  const students = usePolling<Student[]>(async () => (await api.get('/api/counselors/students/')).data, null);
  const shared = usePolling<Shared[]>(async () => (await api.get('/api/assessments/shared/')).data, 60000);

  const [target, setTarget] = useState<Student | null>(null);
  const [offices, setOffices] = useState<Office[] | null>(null);
  const [officeId, setOfficeId] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const openRefer = async (s: Student) => {
    setTarget(s); setOffices(null); setOfficeId(''); setNote(''); setMsg(null);
    try {
      const { data } = await api.get('/api/referrals/resources/', { params: s.university ? { university: s.university } : {} });
      setOffices(data);
      if (data[0]) setOfficeId(data[0].id);
    } catch (e) { setMsg(errorText(e)); setOffices([]); }
  };

  const refer = async () => {
    if (!target || !officeId) return;
    setBusy(true); setMsg(null);
    try {
      await api.post('/api/referrals/', { resource: officeId, student: target.student_id, note });
      setDone(`Referral sent for ${target.name}.`);
      setTarget(null);
    } catch (e) { setMsg(errorText(e)); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Students</h1>
        <p className="mt-1 text-sm text-muted-foreground">People you have had a booked session with. Anonymous chats never appear here.</p>
      </div>

      {done && <p role="status" className="rounded-xl bg-lagoon/15 px-4 py-3 text-sm font-medium text-[#0F6F63]">{done}</p>}

      <section aria-labelledby="stu">
        <h2 id="stu" className="sr-only">Your students</h2>
        {students.loading ? <p className="text-muted-foreground" role="status">Loading…</p> : !students.data?.length ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">No students yet. They appear once someone books you.</p>
        ) : (
          <ul className="space-y-3">
            {students.data.map((s) => (
              <li key={s.student_id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-display font-bold text-primary">{s.name[0]?.toUpperCase()}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold">{s.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{s.university || 'University not set'} · {s.completed}/{s.sessions} sessions done</p>
                </div>
                <Button variant="soft" size="sm" onClick={() => openRefer(s)}><Send size={15} /> Refer</Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="sh">
        <h2 id="sh" className="mb-1 flex items-center gap-2 font-display text-lg font-bold"><ClipboardList size={19} /> Shared check-ins</h2>
        <p className="mb-3 text-sm text-muted-foreground">Screening results (not diagnoses) that students chose to share with you.</p>
        {!shared.data?.length ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">Nothing shared with you yet.</p>
        ) : (
          <ul className="space-y-3">
            {shared.data.map((r) => (
              <li key={r.id} className={`rounded-2xl border-2 bg-card p-4 shadow-soft ${r.risk_flag ? 'border-hibiscus' : 'border-border/70'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold">{r.student_name}</p>
                    <p className="text-sm text-muted-foreground">{r.title} · shared {fmtDay(r.shared_at)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${TONE[r.severity] ?? 'bg-muted'}`}>{r.severity_label}</span>
                </div>
                <p className="mt-2 text-sm">Score <b>{r.score}</b> of {r.max_score}{r.higher_is_better ? ' (higher is better)' : ''}</p>
                {r.risk_flag && (
                  <p className="mt-2 flex items-start gap-2 rounded-xl bg-hibiscus/10 px-3 py-2 text-sm font-semibold text-hibiscus">
                    <ShieldAlert size={17} className="mt-0.5 shrink-0" /> They answered yes to thoughts of self-harm. Check in with them soon.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Sheet open={!!target} onClose={() => setTarget(null)} title={`Refer ${target?.name ?? ''}`}>
        {offices === null ? <p className="text-sm text-muted-foreground" role="status">Loading campus offices…</p> : offices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No campus offices are listed for this university yet. An admin can add them.</p>
        ) : (
          <div className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Campus office</legend>
              <div className="space-y-2">
                {offices.map((o) => (
                  <label key={o.id} className={`tap flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${officeId === o.id ? 'border-primary bg-secondary/60' : 'border-border'}`}>
                    <input type="radio" name="office" checked={officeId === o.id} onChange={() => setOfficeId(o.id)} className="mt-1 h-4 w-4 accent-[#8B4A3C]" />
                    <span><span className="block font-semibold">{o.name}</span><span className="text-sm text-muted-foreground">{o.category_label}{o.description ? ` · ${o.description}` : ''}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-medium">Note for the student (optional)
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} className="mt-1.5 w-full rounded-xl border-2 border-input bg-card p-3 text-base" />
            </label>
            {msg && <p role="alert" className="text-sm text-destructive">{msg}</p>}
            <Button variant="cta" className="w-full" disabled={busy || !officeId} onClick={refer}>{busy ? 'Sending…' : 'Send referral'}</Button>
          </div>
        )}
        {offices !== null && offices.length === 0 && msg && <p role="alert" className="mt-2 text-sm text-destructive">{msg}</p>}
      </Sheet>
    </div>
  );
}
