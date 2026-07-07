'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Thread {
  id: string;
  title: string;
  body: string;
  author_display: string;
  reply_count: number;
  created_at: string;
  category: number;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

export default function CirclePage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const load = () => {
    api.get('/api/circle/threads/')
      .then(({ data }) => setThreads(data.results ?? data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/api/circle/categories/').then(({ data }) => {
      const cats = data.results ?? data;
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    try {
      const payload: Record<string, unknown> = { title, body };
      if (categoryId !== '') payload.category = categoryId;
      await api.post('/api/circle/threads/', payload);
      setTitle(''); setBody(''); setShowForm(false);
      load();
    } catch {
      alert('Failed to post thread.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">JaliMind Circle</h2>
          <p className="text-muted-foreground text-sm">Peer community — share, support, connect</p>
        </div>
        {user && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : '+ New thread'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Start a discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <Input placeholder="Thread title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              {categories.length > 0 && (
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              )}
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Share your thoughts…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
              <Button type="submit" disabled={posting}>{posting ? 'Posting…' : 'Post thread'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground text-sm">Loading discussions…</p>}

      <div className="space-y-3">
        {threads.map((t) => (
          <Link key={t.id} href={`/dashboard/circle/${t.id}`}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{t.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">{t.reply_count} replies</Badge>
                </div>
                <CardDescription className="text-xs">
                  {t.category_name && <span className="text-primary mr-2">{t.category_name}</span>}
                  by {t.author_display}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.body}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {!loading && threads.length === 0 && (
          <p className="text-muted-foreground text-sm">No discussions yet. Start the first one!</p>
        )}
      </div>
    </div>
  );
}
