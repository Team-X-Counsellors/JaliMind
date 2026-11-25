'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import api from '@/lib/api';
import { fmtDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { PageHeader, Spinner } from '@/components/student/ui';
import CrisisCard from '@/components/student/CrisisCard';
import type { CrisisResource } from '@/lib/shadow';

interface Instrument {
  key: string; title: string; blurb: string; prompt: string; higher_is_better: boolean; max_score: number;
  options: { value: number; label: string }[]; questions: string[];
}
interface Result {
  id: string; instrument: string; score: number; max_score: number; severity: string; severity_label: string;
  higher_is_better: boolean; shared: boolean; created_at: string;
}
interface Outcome extends Result { advice: string; elevated: boolean; crisis_resources: CrisisResource[] | null }
interface Counselor { id: string; user_name: string }

/** Tiny inline-SVG line chart: oldest to newest, scaled to the instrument's max score. */
function Trend({ results, max, better }: { results: Result[]; max: number; better: 'lower' | 'higher' }) {
  const pts = [...results].reverse(); // API is newest-first
  if (pts.length === 0) return null;
  const W = 300, H = 90, P = 10;
  const x = (i: number) => (pts.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (pts.length - 1));
  const y = (s: number) => H - P - (s / max) * (H - 2 * P);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" role="img" aria-label={`Your last ${pts.length} scores. Latest ${last.score} out of ${max}. ${better === 'lower' ? 'Lower' : 'Higher'} is better.`}>
        <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="#DDD8D0" strokeWidth="1" />
        {pts.length > 1 && <path d={d} fill="none" stroke="#8B4A3C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
        {pts.map((p, i) => <circle key={p.id} cx={x(i)} cy={y(p.score)} r={i === pts.length - 1 ? 5 : 3.5} fill={i === pts.length - 1 ? '#FFB224' : '#8B4A3C'} stroke="#fff" strokeWidth="1.5" />)}
      </svg>
      <figcaption className="text-xs text-muted-foreground">{better === 'lower' ? 'Lower is better' : 'Higher is better'} · {pts.length} check-in{pts.length > 1 ? 's' : ''}</figcaption>
    </figure>
  );
}

function ShareControl({ result, onChanged }: { result: Result; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Counselor[] | null>(null);
  const [pick, setPick] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open || list) return;
    api.get('/api/counselors/').then(({ data }) => { const l = data.results ?? data; setList(l); setPick(l[0]?.id ?? ''); }).catch(() => setList([]));
  }, [open, list]);

  const share = async (counselor: string | null) => {
    setBusy(true); setErr('');
    try { await api.post(`/api/assessments/results/${result.id}/share/`, { counselor }); setOpen(false); onChanged(); }
    catch { setErr('Could not update sharing. Try again.'); }
    finally { setBusy(false); }
  };

  if (result.shared) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-calm/10 px-4 py-3 text-sm">
        <span>Shared with a counsellor.</span>
        <button disabled={busy} onClick={() => share(null)} className="tap font-semibold text-primary underline">Stop sharing</button>
      </div>
    );
  }
  return !open ? (
    <Button variant="soft" className="w-full" onClick={() => setOpen(true)}><Share2 size={16} aria-hidden /> Share with a counsellor</Button>
  ) : (
    <div className="rounded-xl bg-secondary p-4">
      <p className="text-sm">Only the counsellor you pick will see this result. You can stop sharing any time.</p>
      {list === null ? <p className="mt-2 text-sm text-muted-foreground" role="status">Loading…</p> : list.length === 0 ? <p className="mt-2 text-sm">No counsellors available.</p> : (
        <>
          <label htmlFor="who" className="mt-3 block text-sm font-semibold">Counsellor</label>
          <select id="who" value={pick} onChange={(e) => setPick(e.target.value)} className="mt-1 h-12 w-full rounded-xl border-2 border-input bg-card px-3 text-base">
            {list.map((c) => <option key={c.id} value={c.id}>{c.user_name}</option>)}
          </select>
        </>
      )}
      {err && <p role="alert" className="mt-2 text-sm text-destructive">{err}</p>}
      <div className="mt-3 flex gap-2">
        <Button disabled={!pick || busy} onClick={() => share(pick)}>{busy ? 'Sharing…' : 'Share'}</Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  const [instruments, setInstruments] = useState<Instrument[] | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [taking, setTaking] = useState<{ inst: Instrument; i: number; answers: number[] } | null>(null);
  const [outcome, setOutcome] = useState<{ inst: Instrument; data: Outcome } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadResults = useCallback(() => api.get('/api/assessments/results/').then(({ data }) => setResults(data)).catch(() => {}), []);
  useEffect(() => {
    api.get('/api/assessments/').then(({ data }) => setInstruments(data)).catch(() => { setInstruments([]); setError('We could not load the check-ins. Try again in a moment.'); });
    loadResults();
  }, [loadResults]);

  const byInst = useMemo(() => {
    const m: Record<string, Result[]> = {};
    results.forEach((r) => (m[r.instrument] ||= []).push(r));
    return m;
  }, [results]);

  const answer = async (value: number) => {
    if (!taking) return;
    const answers = [...taking.answers.slice(0, taking.i), value];
    if (taking.i + 1 < taking.inst.questions.length) {
      setTaking({ ...taking, i: taking.i + 1, answers });
      return;
    }
    setBusy(true); setError('');
    try {
      const { data } = await api.post(`/api/assessments/${taking.inst.key}/submit/`, { answers });
      setOutcome({ inst: taking.inst, data });
      setTaking(null);
      loadResults();
    } catch { setError('We could not save your answers. Check your connection and try the last question again.'); }
    finally { setBusy(false); }
  };

  /* ---------- taking ---------- */
  if (taking) {
    const { inst, i } = taking;
    const pct = (i / inst.questions.length) * 100;
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => (i === 0 ? setTaking(null) : setTaking({ ...taking, i: i - 1 }))} className="tap grid place-items-center rounded-full text-primary hover:bg-secondary" aria-label="Back">
            <ArrowLeft size={20} aria-hidden />
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={inst.questions.length} aria-valuenow={i} aria-label="Progress">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">{i + 1}/{inst.questions.length}</span>
        </div>
        <p className="text-sm text-muted-foreground">{inst.prompt}</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-balance">{inst.questions[i]}</h1>
        <ul className="mt-6 grid gap-2.5">
          {inst.options.map((o) => (
            <li key={o.value}>
              <button
                disabled={busy}
                onClick={() => answer(o.value)}
                aria-pressed={taking.answers[i] === o.value}
                className={`tap w-full rounded-2xl px-5 py-4 text-left font-semibold transition-colors disabled:opacity-60 ${taking.answers[i] === o.value ? 'bg-primary text-primary-foreground' : 'bg-card ring-1 ring-border hover:ring-primary'}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
        {busy && <p className="mt-4 text-sm text-muted-foreground" role="status">Saving…</p>}
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  /* ---------- result ---------- */
  if (outcome) {
    const { inst, data } = outcome;
    const hist = byInst[inst.key] ?? [];
    const current = hist.find((r) => r.id === data.id) ?? { ...data };
    return (
      <div className="mx-auto max-w-xl space-y-5">
        {data.crisis_resources && <CrisisCard resources={data.crisis_resources} title="One of your answers worries us. Please talk to someone now" />}
        <section className="rounded-3xl bg-card p-6 text-center shadow-soft ring-1 ring-border">
          <p className="text-sm font-semibold text-muted-foreground">{inst.title}</p>
          <p className="mt-2 font-display text-5xl font-bold text-primary">{data.score}<span className="text-xl text-muted-foreground"> / {data.max_score}</span></p>
          <p className="mt-1 font-display text-lg font-semibold">{data.severity_label}</p>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">{data.advice}</p>
          <p className="mt-4 text-xs text-muted-foreground">This is a screening, not a diagnosis. Only a professional can diagnose.</p>
        </section>

        {data.elevated && (
          <div className="grid gap-2">
            <Button asChild variant="cta" size="lg"><Link href="/talk">Talk to someone now</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/dashboard/counselors">Book a counsellor</Link></Button>
          </div>
        )}

        <section className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
          <h2 className="mb-2 font-display font-semibold">Your progress</h2>
          <Trend results={hist} max={inst.max_score} better={inst.higher_is_better ? 'higher' : 'lower'} />
        </section>

        <ShareControl result={current as Result} onChanged={loadResults} />
        <Button variant="ghost" className="w-full" onClick={() => setOutcome(null)}>Back to check-ins</Button>
      </div>
    );
  }

  /* ---------- list ---------- */
  return (
    <div>
      <PageHeader title="Check-ins" subtitle="Short, private questionnaires. Take one every couple of weeks to see how you're doing." />
      {instruments === null && <Spinner />}
      {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
      <ul className="space-y-3">
        {(instruments ?? []).map((inst) => {
          const hist = byInst[inst.key] ?? [];
          const last = hist[0];
          return (
            <li key={inst.key} className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display font-semibold">{inst.title}</h2>
                  <p className="text-sm text-muted-foreground">{inst.blurb}</p>
                </div>
                <Button size="sm" variant={last ? 'soft' : 'default'} onClick={() => setTaking({ inst, i: 0, answers: [] })}>
                  {last ? 'Retake' : 'Start'} <ArrowRight size={14} aria-hidden />
                </Button>
              </div>
              {last && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="mb-1 text-sm"><span className="font-semibold">{last.severity_label}</span> <span className="text-muted-foreground">· {last.score}/{inst.max_score} on {fmtDate(last.created_at)}</span></p>
                  <Trend results={hist} max={inst.max_score} better={inst.higher_is_better ? 'higher' : 'lower'} />
                  <div className="mt-3"><ShareControl result={last} onChanged={loadResults} /></div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-xs text-muted-foreground">Screenings, not diagnoses. Your results are private unless you share them.</p>
    </div>
  );
}
