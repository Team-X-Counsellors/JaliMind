'use client';
import { useMemo, useState } from 'react';
import { Lock, Plus, Search, Trash2 } from 'lucide-react';

export interface ConversationSummary {
  id: string;
  title: string;
  started_at: string;
  last_message_at: string;
  crisis_detected: boolean;
  message_count: number;
}

const ORDER = ['Today', 'Yesterday', 'Previous 7 days', 'Earlier'] as const;

function bucket(iso: string): (typeof ORDER)[number] {
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((day(new Date()) - day(new Date(iso))) / 86_400_000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff <= 7) return 'Previous 7 days';
  return 'Earlier';
}

/** Chat history: grouped by day, searchable, with a two-step delete. Used in the desktop panel and the phone drawer. */
export default function ChatSidebar({
  conversations, activeId, onSelect, onNew, onDelete,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = conversations
      .filter((c) => !q || (c.title || 'Untitled chat').toLowerCase().includes(q))
      .sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));
    return ORDER.map((name) => ({ name, items: list.filter((c) => bucket(c.last_message_at) === name) })).filter((g) => g.items.length);
  }, [conversations, query]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 px-3 pb-2 pt-3">
        <button
          onClick={onNew}
          className="tap flex w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-primary transition-colors hover:bg-lilac"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-lilac text-primary"><Plus size={16} aria-hidden /></span>
          New chat
        </button>
        {conversations.length > 0 && (
          <label className="relative block">
            <span className="sr-only">Search chats</span>
            <Search size={15} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="h-10 w-full rounded-xl border border-transparent bg-lilac/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:bg-card focus:outline-none"
            />
          </label>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3" aria-label="Past chats">
        {conversations.length === 0 && (
          <p className="px-3 py-6 text-sm text-muted-foreground">Your chats will show up here.</p>
        )}
        {conversations.length > 0 && groups.length === 0 && (
          <p className="px-3 py-6 text-sm text-muted-foreground">No chats match &ldquo;{query}&rdquo;.</p>
        )}
        {groups.map((g) => (
          <section key={g.name} className="mb-3">
            <h2 className="px-3 pb-1 pt-2 text-xs font-semibold text-muted-foreground">{g.name}</h2>
            <ul>
              {g.items.map((c) => {
                const active = activeId === c.id;
                if (confirming === c.id) {
                  return (
                    <li key={c.id} className="flex items-center gap-1 rounded-xl bg-hibiscus/10 px-3 py-2">
                      <span className="flex-1 text-sm font-semibold text-hibiscus">Delete this chat?</span>
                      <button onClick={() => { setConfirming(null); onDelete(c.id); }} className="rounded-lg bg-hibiscus px-2.5 py-1 text-xs font-bold text-white">Delete</button>
                      <button onClick={() => setConfirming(null)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-black/5">Keep</button>
                    </li>
                  );
                }
                return (
                  <li key={c.id} className="group relative">
                    <button
                      onClick={() => onSelect(c.id)}
                      aria-current={active ? 'true' : undefined}
                      className={`tap w-full truncate rounded-xl py-2 pl-3 pr-10 text-left text-sm transition-colors ${
                        active ? 'bg-lilac font-semibold text-night' : 'text-foreground/85 hover:bg-lilac/60'
                      }`}
                    >
                      {c.title || 'Untitled chat'}
                    </button>
                    <button
                      onClick={() => setConfirming(c.id)}
                      aria-label={`Delete chat: ${c.title || 'Untitled chat'}`}
                      className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground opacity-100 hover:bg-black/5 hover:text-hibiscus focus-visible:opacity-100 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="flex items-center gap-1.5 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <Lock size={12} aria-hidden /> Only you can see these chats.
      </p>
    </div>
  );
}
