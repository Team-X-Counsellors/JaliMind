'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, EyeOff, Send, ShieldAlert, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { openLiveSocket, wsUrl, LiveSocket } from '@/lib/ws';
import { Button } from '@/components/ui/button';
import Sheet from '@/components/counselor/Sheet';
import CrisisCard from '@/components/counselor/CrisisCard';
import { errorText, fmtTime, useVisualViewportHeight } from '@/lib/counselor';

interface Msg { id: number; sender: 'user' | 'counselor' | 'bot'; content: string; created_at: string }
interface Meta { pseudonym: string; topic_label: string; crisis_flagged: boolean }

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const vvh = useVisualViewportHeight();

  const [meta, setMeta] = useState<Meta | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [gone, setGone] = useState<string | null>(null); // chat missing / ended
  const [typing, setTyping] = useState(false);
  const [live, setLive] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastId = useRef(0);
  const sockRef = useRef<LiveSocket | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTypingSent = useRef(0);

  const merge = useCallback((incoming: Msg[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      incoming.forEach((m) => map.set(m.id, m));
      const list = [...map.values()].sort((a, b) => a.id - b.id);
      lastId.current = list[list.length - 1].id;
      return list;
    });
  }, []);

  const fetchNew = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/shadow/counselor/${id}/`, { params: lastId.current ? { after: lastId.current } : {} });
      setMeta({ pseudonym: data.pseudonym, topic_label: data.topic_label, crisis_flagged: data.crisis_flagged });
      merge(data.messages);
      if (data.status === 'closed') setGone('This chat has ended.');
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 404) setGone('This chat has ended or is not assigned to you.');
    }
  }, [id, merge]);

  // First load + REST fallback poll (covers sockets blocked by a network, and reconnect gaps).
  useEffect(() => {
    fetchNew();
    const t = setInterval(() => { if (!document.hidden) fetchNew(); }, 5000);
    return () => clearInterval(t);
  }, [fetchNew]);

  // Live socket
  useEffect(() => {
    const sock = openLiveSocket({
      url: () => wsUrl(`/ws/shadow/${id}/`, { jwt: localStorage.getItem('access_token') ?? '' }),
      onStatus: setLive,
      onOpen: fetchNew, // catch up on anything missed while disconnected
      onMessage: (d) => {
        if (d.event === 'message') merge([d.message]);
        else if (d.event === 'typing' && d.from === 'student') {
          setTyping(true);
          clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setTyping(false), 3000);
        } else if (d.event === 'crisis') setMeta((m) => (m ? { ...m, crisis_flagged: true } : m));
        else if (d.event === 'closed') setGone('The student ended this chat. Their messages have been wiped.');
      },
    });
    sockRef.current = sock;
    return () => { sock.close(); clearTimeout(typingTimer.current); };
  }, [id, fetchNew, merge]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages.length, typing, vvh]);

  const send = async () => {
    const content = text.trim();
    if (!content || sending || gone) return;
    setSending(true); setError(null); setText('');
    try {
      const { data } = await api.post(`/api/shadow/counselor/${id}/`, { content });
      merge([data]);
    } catch (e) {
      setText(content);
      setError(errorText(e, 'Message not sent. Check your connection and try again.'));
    } finally { setSending(false); }
  };

  const onChange = (v: string) => {
    setText(v);
    const now = Date.now();
    if (now - lastTypingSent.current > 2000) { lastTypingSent.current = now; sockRef.current?.send({ type: 'typing' }); }
  };

  const endChat = async () => {
    try { await api.delete(`/api/shadow/counselor/${id}/`); } catch { /* already gone */ }
    router.replace('/counselor/chats');
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col bg-background" style={{ height: vvh ? `${vvh}px` : '100dvh' }}>
      <header className="flex items-center gap-2 border-b border-border bg-night px-2 py-2 text-white lg:rounded-b-2xl">
        <Link href="/counselor/chats" aria-label="Back to chats" className="tap flex items-center justify-center rounded-full hover:bg-white/10"><ArrowLeft size={22} /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold leading-tight">{meta?.pseudonym ?? 'Loading…'}</p>
          <p className="flex items-center gap-1.5 truncate text-xs text-white/65">
            <span className={`h-2 w-2 rounded-full ${live === 'open' ? 'bg-lagoon-light' : 'bg-marigold'}`} aria-hidden />
            {live === 'open' ? 'Live' : 'Reconnecting…'} · {meta?.topic_label}
          </p>
        </div>
        {meta?.crisis_flagged && (
          <button onClick={() => setProtocolOpen(true)} className="tap flex items-center gap-1.5 rounded-full bg-hibiscus px-3 text-xs font-bold">
            <ShieldAlert size={16} /> Safety
          </button>
        )}
        <button onClick={() => setConfirmEnd(true)} aria-label="End chat" className="tap flex items-center justify-center rounded-full hover:bg-white/10"><Trash2 size={20} /></button>
      </header>

      <p className="flex items-center justify-center gap-1.5 bg-secondary/70 px-3 py-1.5 text-center text-xs text-secondary-foreground">
        <EyeOff size={13} /> You can see their nickname only. Never ask for identifying details.
      </p>

      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4" role="log" aria-live="polite" aria-label="Conversation">
        {meta?.crisis_flagged && <CrisisCard compact />}
        {messages.map((m) => {
          const mine = m.sender === 'counselor';
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] ${mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border border-border bg-card shadow-soft'}`}>
                {m.sender === 'bot' && <span className="mb-0.5 block text-xs font-semibold text-indigo">JaliBot (AI) covered while no counsellor was free</span>}
                {m.content}
                <span className={`mt-1 block text-[11px] ${mine ? 'text-white/65' : 'text-muted-foreground'}`}>{fmtTime(m.created_at)}</span>
              </div>
            </div>
          );
        })}
        {typing && <p className="px-2 text-sm italic text-muted-foreground" aria-live="polite">{meta?.pseudonym} is typing…</p>}
        <div ref={endRef} />
      </div>

      {gone ? (
        <div className="pb-safe border-t border-border bg-card p-4 text-center">
          <p className="mb-3 text-sm text-muted-foreground">{gone}</p>
          <Button onClick={() => router.replace('/counselor/chats')}>Back to chats</Button>
        </div>
      ) : (
        <div className="pb-safe border-t border-border bg-card px-3 pt-2">
          {error && <p role="alert" className="pb-2 text-sm text-destructive">{error}</p>}
          <div className="flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && window.matchMedia('(pointer: fine)').matches) { e.preventDefault(); send(); }
              }}
              rows={1}
              maxLength={2000}
              placeholder="Write a message…"
              aria-label="Message"
              className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button size="icon" aria-label="Send" disabled={!text.trim() || sending} onClick={send} className="h-12 w-12 shrink-0">
              <Send size={20} />
            </Button>
          </div>
          <p className="pb-1 pt-1 text-center text-[11px] text-muted-foreground">Chat is deleted for both of you when it ends.</p>
        </div>
      )}

      <Sheet open={protocolOpen} onClose={() => setProtocolOpen(false)} title="Safety protocol"><CrisisCard /></Sheet>
      <Sheet open={confirmEnd} onClose={() => setConfirmEnd(false)} title="End this chat?">
        <p className="text-sm text-muted-foreground">The conversation is deleted for both of you and cannot be recovered. If they are still in distress, stay with them first.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setConfirmEnd(false)}>Keep chatting</Button>
          <Button variant="destructive" className="flex-1" onClick={endChat}>End and delete</Button>
        </div>
      </Sheet>
    </div>
  );
}
