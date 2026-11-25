'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export interface Appt {
  id: string;
  student_id?: number | string | null;
  student_name: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  session_type: 'video' | 'voice' | 'text' | 'anonymous';
  notes: string;
  /** Only present on the dashboard payload today; the appointments list omits it. */
  counselor_notes?: string;
  meeting_link?: string;
}

export interface QueueItem {
  session_id: string;
  pseudonym: string;
  topic: string;
  topic_label: string;
  crisis_flagged: boolean;
  created_at: string;
  preview: string;
  claimed_by_me?: boolean;
}

export const CRISIS_HOTLINES = [
  { country: 'Kenya', name: 'Befrienders Kenya', phone: '+254 722 178 177' },
  { country: 'Nigeria', name: 'SURPIN', phone: '+234 806 210 6493' },
  { country: 'Ghana', name: 'Mental Health Authority', phone: '0800 111 222' },
  { country: 'South Africa', name: 'SADAG', phone: '0800 456 789' },
];

export const SESSION_LABEL: Record<string, string> = {
  video: 'Video', voice: 'Voice', text: 'Text', anonymous: 'Anonymous text',
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function fmtDay(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return 'Today';
  if (same(d, tomorrow)) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function fmtWhen(iso: string) {
  return `${fmtDay(iso)}, ${fmtTime(iso)}`;
}

/** "in 12 min", "in 3 h", "started 5 min ago" */
export function relTime(iso: string, now = Date.now()) {
  const diff = Math.round((new Date(iso).getTime() - now) / 60000);
  const abs = Math.abs(diff);
  const span = abs < 60 ? `${abs} min` : abs < 1440 ? `${Math.round(abs / 60)} h` : `${Math.round(abs / 1440)} d`;
  if (abs < 1) return 'now';
  return diff > 0 ? `in ${span}` : `${span} ago`;
}

export function waitLabel(iso: string, now = Date.now()) {
  const m = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function trimTime(t: string) {
  return t.slice(0, 5);
}

/** The appointments endpoint is paginated (20/page); walk the pages so tabs are complete. */
export async function fetchAllAppointments(): Promise<Appt[]> {
  const out: Appt[] = [];
  let url: string | null = '/api/appointments/';
  for (let i = 0; i < 10 && url; i++) {
    const { data }: { data: { results?: Appt[]; next?: string | null } | Appt[] } = await api.get(url);
    if (Array.isArray(data)) return data;
    out.push(...(data.results ?? []));
    url = data.next ?? null;
  }
  return out;
}

export function errorText(err: unknown, fallback = 'Something went wrong. Please try again.') {
  const res = (err as { response?: { data?: unknown } })?.response?.data;
  if (res && typeof res === 'object') {
    const d = res as Record<string, unknown>;
    if (typeof d.error === 'string') return d.error;
    if (typeof d.detail === 'string') return d.detail;
    const first = Object.values(d).flat()[0];
    if (typeof first === 'string') return first;
  }
  return fallback;
}

/** Fetch now, then keep refreshing. Pauses while the tab is hidden so phones don't burn data. */
export function usePolling<T>(fn: () => Promise<T>, ms: number | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const refresh = useCallback(async () => {
    try {
      setData(await fnRef.current());
      setError(null);
    } catch (e) {
      setError(errorText(e, 'Could not load. Pull to retry.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!ms) return;
    const t = setInterval(() => { if (!document.hidden) refresh(); }, ms);
    const onVis = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, [refresh, ms]);

  return { data, setData, error, loading, refresh };
}

/** Height of the visible area, which shrinks when the mobile keyboard opens (100dvh does not). */
export function useVisualViewportHeight() {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setH(Math.round(vv.height));
    update();
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);
  return h;
}
