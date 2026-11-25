'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { relativeTime } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { buildReplyTree, Reply, ReplyNode } from '@/lib/replyTree';
import { Empty, PageHeader, Spinner } from '@/components/student/ui';

interface Thread { id: string; title: string; body: string; author_display: string; category_name: string; created_at: string }

const MAX_VISUAL_DEPTH = 3; // deeper than this is capped so replies stay readable on a phone

function ReplyForm({ onSubmit, onCancel, autoFocus }: { onSubmit: (body: string) => Promise<void>; onCancel?: () => void; autoFocus?: boolean }) {
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true); setErr('');
    try { await onSubmit(body); setBody(''); onCancel?.(); }
    catch { setErr('Could not post your reply. Try again.'); }
    finally { setPosting(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea autoFocus={autoFocus} aria-label="Your reply" placeholder="Write a reply" value={body} onChange={(e) => setBody(e.target.value)} rows={3}
        className="w-full resize-none rounded-xl border-2 border-input bg-card px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={posting || !body.trim()}>{posting ? 'Posting…' : 'Reply'}</Button>
        {onCancel && <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

function ReplyItem({ node, depth, onReply }: { node: ReplyNode; depth: number; onReply: (parentId: string, body: string) => Promise<void> }) {
  const [replying, setReplying] = useState(false);
  return (
    <div className={depth > 0 && depth <= MAX_VISUAL_DEPTH ? 'ml-3 border-l-2 border-secondary pl-3 sm:ml-5' : depth > MAX_VISUAL_DEPTH ? 'border-l-2 border-secondary pl-3' : ''}>
      <div className="py-2.5">
        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{node.author_display}</span> · {relativeTime(node.created_at)}</p>
        <p className="mt-1 whitespace-pre-wrap break-words">{node.body}</p>
        <button onClick={() => setReplying((v) => !v)} className="tap -ml-1 mt-0.5 px-1 text-sm font-semibold text-primary">{replying ? 'Cancel' : 'Reply'}</button>
        {replying && <div className="mt-2"><ReplyForm autoFocus onCancel={() => setReplying(false)} onSubmit={(b) => onReply(node.id, b)} /></div>}
      </div>
      {node.children.map((c) => <ReplyItem key={c.id} node={c} depth={depth + 1} onReply={onReply} />)}
    </div>
  );
}

export default function ThreadDetailPage() {
  const { id: threadId } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReplies = useCallback(async () => {
    const { data } = await api.get(`/api/circle/threads/${threadId}/replies/`);
    setReplies(data);
  }, [threadId]);

  useEffect(() => {
    Promise.all([
      api.get(`/api/circle/threads/${threadId}/`).then(({ data }) => setThread(data)),
      api.get(`/api/circle/threads/${threadId}/replies/`).then(({ data }) => setReplies(data)),
    ])
      .catch(() => {}).finally(() => setLoading(false));
  }, [threadId]);

  const postReply = async (body: string, parent: string | null) => {
    const payload: Record<string, unknown> = { body };
    if (parent) payload.parent_reply = parent;
    await api.post(`/api/circle/threads/${threadId}/replies/`, payload);
    await loadReplies();
  };

  if (loading) return <Spinner />;
  if (!thread) return <Empty title="Post not found" action={<Button asChild><Link href="/dashboard/circle">Back to Circle</Link></Button>} />;

  return (
    <div>
      <PageHeader title={thread.title} back="/dashboard/circle" />
      <article className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
        <p className="text-xs text-muted-foreground">
          {thread.category_name && <span className="mr-2 font-semibold text-primary">{thread.category_name}</span>}
          {thread.author_display} · {relativeTime(thread.created_at)}
        </p>
        <p className="mt-2 whitespace-pre-wrap break-words">{thread.body}</p>
      </article>

      <section className="mt-5" aria-label="Add a reply">
        <ReplyForm onSubmit={(b) => postReply(b, null)} />
      </section>

      <section className="mt-6" aria-label="Replies">
        <h2 className="mb-1 font-display text-sm font-semibold text-muted-foreground">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</h2>
        {replies.length === 0 && <p className="text-sm text-muted-foreground">No replies yet. Be the first.</p>}
        <div className="divide-y divide-border/60">
          {buildReplyTree(replies).map((n) => <ReplyItem key={n.id} node={n} depth={0} onReply={(pid, b) => postReply(b, pid)} />)}
        </div>
      </section>
    </div>
  );
}
