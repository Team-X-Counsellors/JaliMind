'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import { relativeTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empty, PageHeader, Spinner } from '@/components/student/ui';

interface Thread {
  id: string; title: string; body: string; author_display: string; reply_count: number;
  created_at: string; category: number; category_name: string;
}
interface Category { id: number; name: string; icon: string }

export default function CirclePage() {
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [error, setError] = useState('');

  const load = () => api.get('/api/circle/threads/').then(({ data }) => setThreads(data.results ?? data)).catch(() => setThreads([]));

  useEffect(() => {
    load();
    api.get('/api/circle/categories/').then(({ data }) => {
      const cats = data.results ?? data;
      setCategories(cats);
      if (cats.length) setCategoryId(cats[0].id);
    }).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPosting(true); setError('');
    try {
      const payload: Record<string, unknown> = { title, body };
      if (categoryId !== '') payload.category = categoryId;
      await api.post('/api/circle/threads/', payload);
      setTitle(''); setBody(''); setShowForm(false);
      load();
    } catch { setError('Could not post. Please try again.'); }
    finally { setPosting(false); }
  };

  return (
    <div>
      <PageHeader
        title="Circle"
        subtitle="Talk with other students. Be kind."
        back="/dashboard/more"
        action={<Button size="sm" variant={showForm ? 'ghost' : 'default'} onClick={() => setShowForm((v) => !v)}>{showForm ? <><X size={14} aria-hidden /> Close</> : <><Plus size={14} aria-hidden /> New post</>}</Button>}
      />

      {showForm && (
        <form onSubmit={submit} className="mb-5 space-y-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
          <Input placeholder="Title" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          {categories.length > 0 && (
            <select aria-label="Topic" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="h-12 w-full rounded-xl border-2 border-input bg-card px-3 text-base">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          )}
          <textarea aria-label="What's on your mind" placeholder="What's on your mind?" value={body} onChange={(e) => setBody(e.target.value)} required rows={4}
            className="w-full resize-none rounded-xl border-2 border-input bg-card px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={posting}>{posting ? 'Posting…' : 'Post'}</Button>
        </form>
      )}

      {threads === null && <Spinner />}
      {threads && threads.length === 0 && <Empty title="No posts yet" body="Start the first conversation." />}

      <ul className="space-y-3">
        {(threads ?? []).map((t) => (
          <li key={t.id}>
            <Link href={`/dashboard/circle/${t.id}`} className="block rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border transition-shadow hover:shadow-pop">
              <p className="text-xs text-muted-foreground">
                {t.category_name && <span className="mr-2 font-semibold text-primary">{t.category_name}</span>}
                {t.author_display} · {relativeTime(t.created_at)}
              </p>
              <h2 className="mt-1 font-display font-semibold leading-snug">{t.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.body}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><MessageCircle size={14} aria-hidden /> {t.reply_count} {t.reply_count === 1 ? 'reply' : 'replies'}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
