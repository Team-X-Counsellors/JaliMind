'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeOff, MessageCircle, Siren } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import CrisisCard from '@/components/counselor/CrisisCard';
import { QueueItem, errorText, usePolling, waitLabel } from '@/lib/counselor';

interface Queue { waiting: QueueItem[]; mine: QueueItem[] }

export default function ChatsPage() {
  const router = useRouter();
  const { data, error, loading, refresh } = usePolling<Queue>(async () => (await api.get('/api/shadow/queue/')).data, 5000);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const claim = async (id: string) => {
    setClaiming(id); setMsg(null);
    try {
      await api.post(`/api/shadow/queue/${id}/claim/`);
      router.push(`/counselor/chats/${id}`);
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setMsg(status === 409 ? 'Another counsellor just picked that one up. Here is who is still waiting.' : errorText(e));
      setClaiming(null);
      refresh();
    }
  };

  const hasUrgent = !!data?.waiting.some((w) => w.crisis_flagged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Anonymous chats</h1>
        <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
          <EyeOff size={16} className="mt-0.5 shrink-0" />
          You only ever see a nickname. No name, email, or account is linked to these chats, and they are wiped when ended.
        </p>
      </div>

      {msg && <p role="status" className="rounded-xl bg-marigold/25 px-4 py-3 text-sm font-medium">{msg}</p>}
      {error && !data && <p role="alert" className="text-destructive">{error} <button className="underline" onClick={refresh}>Retry</button></p>}
      {hasUrgent && <CrisisCard compact />}

      {data?.mine.length ? (
        <section aria-labelledby="mine">
          <h2 id="mine" className="mb-3 font-display text-lg font-bold">Your open chats</h2>
          <ul className="space-y-3">
            {data.mine.map((c) => (
              <li key={c.session_id}>
                <Link href={`/counselor/chats/${c.session_id}`} className="tap flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lagoon/15 text-[#0F6F63]"><MessageCircle size={20} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-display font-semibold">{c.pseudonym}{c.crisis_flagged && <span className="rounded-full bg-hibiscus px-2 py-0.5 text-[11px] font-bold text-white">URGENT</span>}</span>
                    <span className="block truncate text-sm text-muted-foreground">{c.preview || c.topic_label}</span>
                  </span>
                  <span className="text-sm font-semibold text-primary">Open</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="waiting">
        <h2 id="waiting" className="mb-3 font-display text-lg font-bold">Waiting for a counsellor {data && data.waiting.length > 0 && <span className="ml-1 rounded-full bg-marigold px-2 py-0.5 text-sm text-night">{data.waiting.length}</span>}</h2>
        {loading ? (
          <p className="text-muted-foreground" role="status">Loading…</p>
        ) : !data?.waiting.length ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
            No one is waiting right now. This page checks every few seconds.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.waiting.map((c) => (
              <li key={c.session_id} className={`rounded-2xl border-2 p-4 shadow-soft ${c.crisis_flagged ? 'border-hibiscus bg-hibiscus/5' : 'border-border/70 bg-card'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${c.crisis_flagged ? 'bg-hibiscus text-white' : 'bg-secondary text-primary'}`}>
                    {c.crisis_flagged ? <Siren size={20} /> : <MessageCircle size={20} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-display font-semibold">
                      {c.pseudonym}
                      {c.crisis_flagged && <span className="rounded-full bg-hibiscus px-2 py-0.5 text-[11px] font-bold text-white">URGENT</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{c.topic_label} · waiting {waitLabel(c.created_at)}</p>
                    {c.preview && <p className="mt-2 rounded-xl bg-muted px-3 py-2 text-sm">“{c.preview}”</p>}
                  </div>
                </div>
                <Button variant={c.crisis_flagged ? 'destructive' : 'cta'} className="mt-3 w-full" disabled={claiming === c.session_id} onClick={() => claim(c.session_id)}>
                  {claiming === c.session_id ? 'Joining…' : c.crisis_flagged ? 'Respond now' : 'Take this chat'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
