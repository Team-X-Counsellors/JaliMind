'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { buildReplyTree, Reply, ReplyNode } from '@/lib/replyTree';

interface Thread {
  id: string;
  title: string;
  body: string;
  author_display: string;
  category_name: string;
  created_at: string;
}

const MAX_VISUAL_DEPTH = 6;

function ReplyForm({
  onSubmit,
  onCancel,
  autoFocus,
}: {
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    try {
      await onSubmit(body);
      setBody('');
      onCancel?.();
    } finally {
      setPosting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        autoFocus={autoFocus}
        className="w-full min-h-[70px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Write a reply…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={posting}>{posting ? 'Posting…' : 'Reply'}</Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  );
}

function ReplyItem({
  node,
  depth,
  onReply,
}: {
  node: ReplyNode;
  depth: number;
  onReply: (parentId: string, body: string) => Promise<void>;
}) {
  const [replying, setReplying] = useState(false);
  const indent = Math.min(depth, MAX_VISUAL_DEPTH) * 20;

  return (
    <div style={{ marginLeft: indent }} className="border-l border-border pl-3">
      <div className="py-2">
        <p className="text-xs text-muted-foreground">
          {node.author_display} · {new Date(node.created_at).toLocaleString()}
        </p>
        <p className="text-sm whitespace-pre-wrap mt-1">{node.body}</p>
        <button
          onClick={() => setReplying((v) => !v)}
          className="text-xs text-primary mt-1 hover:underline"
        >
          {replying ? 'Cancel' : 'Reply'}
        </button>
        {replying && (
          <div className="mt-2">
            <ReplyForm
              autoFocus
              onCancel={() => setReplying(false)}
              onSubmit={(body) => onReply(node.id, body)}
            />
          </div>
        )}
      </div>
      {node.children.map((child) => (
        <ReplyItem key={child.id} node={child} depth={depth + 1} onReply={onReply} />
      ))}
    </div>
  );
}

export default function ThreadDetailPage() {
  const params = useParams<{ id: string }>();
  const threadId = params.id;
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
      loadReplies(),
    ]).finally(() => setLoading(false));
  }, [threadId, loadReplies]);

  const postReply = async (body: string, parentReply: string | null) => {
    const payload: Record<string, unknown> = { body };
    if (parentReply) payload.parent_reply = parentReply;
    await api.post(`/api/circle/threads/${threadId}/replies/`, payload);
    await loadReplies();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading discussion…</p>;
  if (!thread) return <p className="text-muted-foreground text-sm">Thread not found.</p>;

  const tree = buildReplyTree(replies);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/dashboard/circle" className="text-sm text-primary hover:underline">
        ← Back to Circle
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{thread.title}</CardTitle>
          <CardDescription className="text-xs">
            {thread.category_name && <span className="text-primary mr-2">{thread.category_name}</span>}
            by {thread.author_display} · {new Date(thread.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{thread.body}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a reply</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyForm onSubmit={(body) => postReply(body, null)} />
        </CardContent>
      </Card>

      <div className="space-y-1">
        {tree.length === 0 && (
          <p className="text-muted-foreground text-sm">No replies yet. Be the first to respond.</p>
        )}
        {tree.map((node) => (
          <ReplyItem
            key={node.id}
            node={node}
            depth={0}
            onReply={(parentId, body) => postReply(body, parentId)}
          />
        ))}
      </div>
    </div>
  );
}
