'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Markdown from '@/components/student/Markdown';
import {
  ArrowLeft, Bot, BookOpen, Brain, EyeOff, HeartHandshake, MessageCircle, MessagesSquare,
  Send, Trash2, Wallet, Siren, ShieldCheck, Users,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { TOPICS, ShadowTopic } from '@/lib/shadow';
import { fmtTime } from '@/lib/format';
import { useShadowChat } from '@/components/student/useShadowChat';
import CrisisCard from '@/components/student/CrisisCard';
import JaliPattern from '@/components/student/JaliPattern';
import { Button } from '@/components/ui/button';

const TOPIC_ICON: Record<ShadowTopic, React.ComponentType<{ size?: number; className?: string }>> = {
  urgent: Siren, anxiety: Brain, academic: BookOpen, relationships: Users, money: Wallet, general: MessageCircle,
};

function WhatsAppLink() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    api.get('/api/referrals/whatsapp/').then(({ data }) => { if (data.enabled) setUrl(data.url); }).catch(() => {});
  }, []);
  if (!url) return null;
  return (
    <div className="mt-3 rounded-xl bg-night px-3 py-2">
      <a href={url} target="_blank" rel="noopener noreferrer" className="tap inline-flex items-center gap-2 text-sm font-semibold text-white underline">
        <MessagesSquare size={16} aria-hidden /> Chat with us on WhatsApp
      </a>
    </div>
  );
}

export default function TalkPage() {
  const chat = useShadowChat();
  const { isAuthenticated } = useAuth();
  const homeHref = isAuthenticated ? '/dashboard' : '/';
  const [text, setText] = useState('');
  const [confirmEnd, setConfirmEnd] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [chat.messages.length, chat.counselorTyping, chat.phase]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = text;
    if (!t.trim()) return;
    setText('');
    if (!(await chat.send(t))) setText(t); // give the text back if it failed
  };

  const topBar = (right?: React.ReactNode) => (
    <header className="relative z-10 flex items-center justify-between gap-2 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white">
      <Link href={homeHref} className="tap -ml-2 inline-flex items-center gap-1 px-2 text-sm font-semibold text-white/80">
        <ArrowLeft size={18} aria-hidden /> {isAuthenticated ? 'Dashboard' : 'Home'}
      </Link>
      {right}
    </header>
  );

  /* ---------- loading ---------- */
  if (chat.phase === 'loading') {
    return <div className="grid min-h-dvh-screen place-items-center bg-night text-white/70" role="status">Loading…</div>;
  }

  /* ---------- pick a topic ---------- */
  if (chat.phase === 'pick' || chat.phase === 'ended') {
    return (
      <div className="relative flex min-h-dvh-screen flex-col overflow-hidden bg-night">
        <JaliPattern />
        {topBar()}
        <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-8">
          {chat.phase === 'ended' && (
            <p role="status" className="mb-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
              This chat has ended and everything in it was deleted. You can start a new one any time.
            </p>
          )}
          <h1 className="mt-4 font-display text-3xl font-bold text-white text-balance sm:text-4xl">What&apos;s on your mind?</h1>
          <p className="mt-2 text-white/70">
            A real counsellor will chat with you. No account, no name.
          </p>

          <ul className="mt-6 grid gap-2.5">
            {TOPICS.map((t) => {
              const Icon = TOPIC_ICON[t.key];
              const urgent = t.key === 'urgent';
              return (
                <li key={t.key}>
                  <button
                    onClick={() => chat.start(t.key)}
                    disabled={chat.starting}
                    className={`tap flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-transform active:scale-[0.99] disabled:opacity-60 ${
                      urgent ? 'bg-hibiscus text-white shadow-pop' : 'bg-white text-night hover:bg-lilac'
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${urgent ? 'bg-white/20' : 'bg-secondary text-primary'}`}>
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display font-semibold">{t.label}</span>
                      <span className={`block text-sm ${urgent ? 'text-white/85' : 'text-muted-foreground'}`}>{t.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {chat.error && <p role="alert" className="mt-4 rounded-xl bg-hibiscus/20 px-4 py-3 text-sm text-white">{chat.error}</p>}

          <div className="mt-6 flex items-start gap-3 text-sm text-white/70">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-lagoon-light" aria-hidden />
            <p>You get a random name like <span className="font-semibold text-white">CalmBaobab_2041</span>. Nothing links the chat to you, and you can delete it whenever you want.</p>
          </div>

          <div className="mt-8"><CrisisCard title="In danger or thinking of ending your life? Call now" /></div>
        </main>
      </div>
    );
  }

  /* ---------- in a chat ---------- */
  const withCounsellor = chat.status === 'active';
  return (
    <div className="flex h-dvh-screen flex-col bg-background">
      <div className="relative overflow-hidden bg-night">
        <JaliPattern />
        {topBar(
          <div className="flex items-center gap-1">
            {confirmEnd ? (
              <>
                <Button size="sm" variant="destructive" onClick={chat.wipe}>Delete chat</Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setConfirmEnd(false)}>Keep</Button>
              </>
            ) : (
              <button onClick={() => setConfirmEnd(true)} className="tap inline-flex items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white/80 hover:bg-white/10">
                <Trash2 size={16} aria-hidden /> End and delete
              </button>
            )}
          </div>
        )}
        <div className="relative z-10 px-5 pb-4 text-white">
          <p className="flex items-center gap-2 text-sm text-white/70">
            <EyeOff size={16} aria-hidden /> You&apos;re anonymous as <span className="font-semibold text-white">{chat.session?.pseudonym}</span>
          </p>
          <p className="mt-1 flex items-center gap-2 font-display text-lg font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full ${withCounsellor ? 'bg-lagoon' : 'animate-pulse bg-marigold'}`} aria-hidden />
            {withCounsellor ? 'A counsellor is with you' : 'Waiting for a counsellor'}
          </p>
        </div>
      </div>

      {chat.crisis && (
        <div className="max-h-[38dvh] shrink-0 overflow-y-auto border-b border-border bg-background px-4 py-3">
          <div className="mx-auto max-w-xl"><CrisisCard resources={chat.crisis} title="You're not alone. These people can talk right now" /></div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        <div className="mx-auto flex max-w-xl flex-col gap-3">
          {!withCounsellor && (
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <p className="font-display font-semibold">A counsellor will join soon.</p>
              <p className="mt-1 text-muted-foreground">You can write now. They&apos;ll see your message when they join. Keep this page open.</p>
              <WhatsAppLink />
              {!chat.crisis && <div className="mt-3"><CrisisCard tone="quiet" title="If it can't wait, call a helpline" /></div>}
            </div>
          )}

          {chat.messages.map((m) => {
            const mine = m.sender === 'user';
            const bot = m.sender === 'bot';
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-soft ${mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-card ring-1 ring-border'}`}>
                  {bot && <span className="mb-0.5 flex items-center gap-1 text-xs font-semibold text-indigo"><Bot size={12} aria-hidden /> JaliBot (AI)</span>}
                  {!mine && !bot && <span className="mb-0.5 flex items-center gap-1 text-xs font-semibold text-calm"><HeartHandshake size={12} aria-hidden /> Counsellor</span>}
                  {bot ? <Markdown>{m.content}</Markdown> : <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                  <time className={`mt-1 block text-[11px] ${mine ? 'text-white/60' : 'text-muted-foreground'}`}>{fmtTime(m.created_at)}</time>
                </div>
              </div>
            );
          })}
          {chat.counselorTyping && <p className="text-sm text-muted-foreground" aria-live="polite">Counsellor is typing…</p>}
          <div ref={endRef} />
        </div>
      </div>

      <form onSubmit={submit} className="border-t border-border bg-card px-3 pt-3 pb-safe">
        {chat.error && <p role="alert" className="mx-auto mb-2 max-w-xl text-sm text-destructive">{chat.error}</p>}
        <div className="mx-auto flex max-w-xl items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); chat.notifyTyping(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
            rows={1}
            maxLength={2000}
            placeholder="Type here"
            aria-label="Your message"
            className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border-2 border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" size="icon" variant="cta" className="h-12 w-12 shrink-0" disabled={!text.trim() || chat.sending} aria-label="Send message">
            <Send size={20} aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
