'use client';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, FileText, Headphones, Image as ImageIcon, PlayCircle } from 'lucide-react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Chip, Empty, PageHeader, Spinner } from '@/components/student/ui';

interface Resource {
  id: string; title: string; description: string; resource_type: string; tags: string[];
  language: string; content_url: string; file: string | null;
}

const TYPES: Record<string, { label: string; icon: typeof BookOpen }> = {
  article: { label: 'Articles', icon: BookOpen },
  video: { label: 'Videos', icon: PlayCircle },
  audio: { label: 'Audio', icon: Headphones },
  workbook: { label: 'Workbooks', icon: FileText },
  infographic: { label: 'Infographics', icon: ImageIcon },
};

export default function LibraryPage() {
  const [items, setItems] = useState<Resource[] | null>(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/library/')
      .then(({ data }) => setItems(data.results ?? data))
      .catch(() => { setError('We could not load the library. Try again in a moment.'); setItems([]); });
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (items ?? []).filter((r) =>
      (type === 'all' || r.resource_type === type) &&
      (!s || r.title.toLowerCase().includes(s) || r.description?.toLowerCase().includes(s) || r.tags?.some((t) => t.toLowerCase().includes(s))));
  }, [items, q, type]);

  const present = useMemo(() => Array.from(new Set((items ?? []).map((r) => r.resource_type))), [items]);

  return (
    <div>
      <PageHeader title="Library" subtitle="Short reads, workbooks and audio. Pick what helps." />
      <Input type="search" placeholder="Search" aria-label="Search the library" value={q} onChange={(e) => setQ(e.target.value)} className="mb-3" />

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none" role="group" aria-label="Filter by type">
        <Chip active={type === 'all'} onClick={() => setType('all')}>All</Chip>
        {present.map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{TYPES[t]?.label ?? t}</Chip>)}
      </div>

      {items === null && <Spinner />}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {items && !error && shown.length === 0 && <Empty title="Nothing found" body="Try a different word or filter." />}

      <ul className="space-y-3">
        {shown.map((r) => {
          const Icon = TYPES[r.resource_type]?.icon ?? BookOpen;
          const href = r.file || r.content_url;
          const soon = !href;
          const inner = (
            <>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${soon ? 'bg-muted text-muted-foreground' : 'bg-secondary text-primary'}`}><Icon size={22} aria-hidden /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="font-display font-semibold leading-snug">{r.title}</span>
                  {soon && <span className="shrink-0 rounded-full bg-marigold/20 px-2 py-0.5 text-xs font-semibold text-[#8a5a00]">Coming soon</span>}
                </span>
                {r.description && r.description !== r.title && <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{r.description}</span>}
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {r.tags?.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{t}</span>)}
                </span>
              </span>
            </>
          );
          return (
            <li key={r.id}>
              {soon ? (
                <div className="flex gap-4 rounded-2xl bg-card p-4 opacity-80 shadow-soft ring-1 ring-border">{inner}</div>
              ) : (
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border transition-shadow hover:shadow-pop">{inner}</a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
