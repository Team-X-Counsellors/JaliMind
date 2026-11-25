'use client';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { fmtDate } from '@/lib/format';
import { Empty, PageHeader, Spinner } from '@/components/student/ui';

interface Memory { id: string; content: string; category: string; created_at: string }

const CATEGORY: Record<string, string> = { academic: 'School', emotional: 'Feelings', family: 'Family', career: 'Career', other: 'Other' };

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[] | null>(null);

  useEffect(() => {
    api.get('/api/jalibot/memories/').then(({ data }) => setMemories(data)).catch(() => setMemories([]));
  }, []);

  const remove = async (id: string) => {
    setMemories((m) => (m ?? []).filter((x) => x.id !== id));
    try { await api.delete(`/api/jalibot/memories/${id}/`); }
    catch { const { data } = await api.get('/api/jalibot/memories/'); setMemories(data); }
  };

  return (
    <div>
      <PageHeader title="Memories" subtitle="A few things JaliBot remembers so you don't have to repeat yourself. Delete any of them." back="/dashboard/more" />
      {memories === null && <Spinner />}
      {memories && memories.length === 0 && <Empty title="Nothing remembered yet" body="JaliBot saves a few key facts as you chat." />}
      <ul className="space-y-3">
        {(memories ?? []).map((m) => (
          <li key={m.id} className="flex items-start justify-between gap-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
            <div className="min-w-0">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">{CATEGORY[m.category] ?? m.category}</span>
              <p className="mt-2">{m.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">{fmtDate(m.created_at)}</p>
            </div>
            <button onClick={() => remove(m.id)} className="tap grid shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-hibiscus/10 hover:text-hibiscus" aria-label="Delete this memory">
              <Trash2 size={18} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
