'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeft, BookOpen, Check, CloudRain, Copy, Moon, PanelLeft, SquarePen, Square, Users, Volume2, Waves, X,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CrisisCard from '@/components/student/CrisisCard';
import Markdown, { stripMarkdown } from '@/components/student/Markdown';
import Orb from '@/components/student/Orb';
import ChatSidebar, { ConversationSummary } from './ChatSidebar';
import Composer from './Composer';

interface Message { role: 'user' | 'bot'; content: string }

interface SpeechRecognitionResultEvent extends Event {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean;
  start: () => void; stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null; onerror: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const CONVERSATION_ID_KEY = 'jalibot_conversation_id';
const PANEL_KEY = 'jalibot_panel';
const STARTERS = [
  { icon: Waves, label: 'I feel overwhelmed', prompt: "I feel overwhelmed and don't know where to start" },
  { icon: Moon, label: "I can't sleep", prompt: "I can't sleep and my mind keeps racing" },
  { icon: BookOpen, label: 'Exam stress', prompt: "I'm stressed about my exams" },
  { icon: CloudRain, label: 'I feel lonely', prompt: 'I feel lonely on campus' },
];

export default function JalibotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  // Desktop history panel. Read before first paint (this page only renders after the auth guard, on the
  // client) so a collapsed panel never flashes open and animates shut.
  const [panelOpen, setPanelOpen] = useState(() =>
    typeof window === 'undefined' || localStorage.getItem(PANEL_KEY) !== '0');
  const [drawerOpen, setDrawerOpen] = useState(false); // phone/tablet drawer
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [speechOk, setSpeechOk] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const empty = messages.length === 0;
  const firstName = user?.first_name || '';

  useEffect(() => {
    // With no messages the greeting should sit at the top, not be scrolled past.
    if (messages.length === 0 && !loading) scrollRef.current?.scrollTo({ top: 0 });
    else bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading]);

  useEffect(() => {
    setSpeechOk('speechSynthesis' in window);
    setMicOk(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => { window.speechSynthesis?.cancel(); recRef.current?.stop(); };
  }, []);

  const toggleHistory = () => {
    // Below the lg breakpoint the history is a drawer; on desktop it is a panel that folds away.
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setPanelOpen((open) => { localStorage.setItem(PANEL_KEY, open ? '0' : '1'); return !open; });
    } else {
      setDrawerOpen(true);
    }
  };

  const speak = (text: string, i: number) => {
    if (!speechOk) return;
    window.speechSynthesis.cancel();
    if (speakingIndex === i) { setSpeakingIndex(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => setSpeakingIndex(null);
    u.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(i);
    window.speechSynthesis.speak(u);
  };

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex((c) => (c === i ? null : c)), 1800);
    } catch { /* clipboard blocked: nothing to do */ }
  };

  const toggleListening = () => {
    if (listening) { recRef.current?.stop(); return; }
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = 'en-US'; r.continuous = false; r.interimResults = false;
    r.onresult = (e) => { const t = e.results[0][0].transcript; setInput((p) => (p ? `${p} ${t}` : t)); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    r.start();
    setListening(true);
  };

  const loadHistoryList = useCallback(async () => {
    try { const { data } = await api.get('/api/jalibot/history/'); setConversations(data); } catch { /* optional */ }
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/api/jalibot/history/${id}/`);
      const hydrated: Message[] = data.messages.map((m: { role: string; content: string }) => ({ role: m.role === 'user' ? 'user' : 'bot', content: m.content }));
      window.speechSynthesis?.cancel();
      setSpeakingIndex(null);
      setMessages(hydrated);
      setConversationId(id);
      setCrisis(data.crisis_detected);
      localStorage.setItem(CONVERSATION_ID_KEY, id);
    } catch {
      localStorage.removeItem(CONVERSATION_ID_KEY);
      setConversationId(null);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    loadHistoryList();
    const stored = localStorage.getItem(CONVERSATION_ID_KEY);
    if (stored) loadConversation(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNew = () => {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setMessages([]);
    setConversationId(null);
    setCrisis(false);
    setInput('');
    localStorage.removeItem(CONVERSATION_ID_KEY);
    setDrawerOpen(false);
  };

  const deleteConversation = async (id: string) => {
    try {
      await api.delete(`/api/jalibot/history/${id}/`);
      setConversations((list) => list.filter((c) => c.id !== id));
      if (id === conversationId) startNew();
    } catch { /* leave it in the list so the person can try again */ }
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/api/jalibot/chat/', { message: text, conversation_id: conversationId });
      setMessages((m) => [...m, { role: 'bot', content: data.reply }]);
      if (data.crisis_detected) setCrisis(true);
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
        localStorage.setItem(CONVERSATION_ID_KEY, data.conversation_id);
      }
      loadHistoryList();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { reply?: string } } })?.response?.data;
      setMessages((m) => [...m, { role: 'bot', content: data?.reply || "I couldn't answer just now. Please try again in a moment." }]);
    } finally { setLoading(false); }
  };

  const sidebar = (afterSelect?: () => void) => (
    <ChatSidebar
      conversations={conversations}
      activeId={conversationId}
      onSelect={(id) => { loadConversation(id); afterSelect?.(); }}
      onNew={startNew}
      onDelete={deleteConversation}
    />
  );

  return (
    <div className="flex h-dvh-screen bg-background">
      {/* Desktop history panel: folds away completely */}
      <aside
        aria-label="Chat history"
        aria-hidden={!panelOpen}
        inert={!panelOpen}
        className={`hidden shrink-0 overflow-hidden border-border bg-mist lg:block transition-[width] duration-200 ${panelOpen ? 'w-72 border-r' : 'w-0'}`}
      >
        <div className="h-full w-72">{sidebar()}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-1 px-2 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4">
          <Link href="/dashboard/more" className="tap grid place-items-center rounded-full text-muted-foreground hover:bg-lilac hover:text-primary md:hidden" aria-label="Back">
            <ArrowLeft size={20} aria-hidden />
          </Link>
          <button
            onClick={toggleHistory}
            aria-label={panelOpen ? 'Hide chat history' : 'Show chat history'}
            title={panelOpen ? 'Hide chat history' : 'Show chat history'}
            className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-lilac hover:text-primary"
          >
            <PanelLeft size={20} aria-hidden />
          </button>
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-2">
            <Orb size={22} />
            <h1 className="font-display text-base font-semibold">JaliBot</h1>
            <span className="rounded-full bg-lilac px-2 py-0.5 text-[11px] font-semibold text-primary">AI</span>
          </div>
          <Link
            href="/talk"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-lilac px-3 text-sm font-semibold text-primary hover:bg-lilac/70 sm:px-4"
            aria-label="Talk to a human counsellor"
          >
            <Users size={16} aria-hidden /> <span className="hidden sm:inline">Talk to a human</span><span className="sm:hidden">Human</span>
          </Link>
          <button
            onClick={startNew}
            aria-label="New chat"
            title="New chat"
            className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:bg-lilac hover:text-primary"
          >
            <SquarePen size={19} aria-hidden />
          </button>
        </header>

        {crisis && (
          <div className="max-h-[38dvh] shrink-0 overflow-y-auto border-y border-border bg-background px-4 py-3">
            <div className="mx-auto max-w-3xl"><CrisisCard title="It sounds like you're going through a lot. Real people can talk right now" /></div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto" aria-live="polite">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-4 pt-4">
            {empty && !loading && (
              <div className="my-auto py-4 text-center">
                <Orb size={56} mode="breathe" className="mx-auto" />
                <h2 className="mt-5 font-display text-3xl font-semibold text-balance sm:text-4xl">
                  {firstName ? `Hi ${firstName}, what's on your mind?` : "Hi, what's on your mind?"}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground text-balance">
                  I&apos;m an AI. I give short, practical steps and I don&apos;t diagnose. If it feels heavy, a human counsellor is one tap away.
                </p>
                <ul className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {STARTERS.map(({ icon: Icon, label, prompt }) => (
                    <li key={label}>
                      <button
                        onClick={() => send(prompt)}
                        className="flex h-full w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lilac text-primary"><Icon size={18} aria-hidden /></span>
                        <span className="text-[15px] font-semibold leading-snug">{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl rounded-br-lg bg-lilac px-4 py-2.5 text-night">{m.content}</p>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <Orb size={28} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="sr-only">JaliBot says</p>
                      <Markdown>{m.content}</Markdown>
                      <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                        <button onClick={() => copy(stripMarkdown(m.content), i)} aria-label="Copy reply" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold hover:bg-lilac hover:text-primary">
                          {copiedIndex === i ? <><Check size={14} aria-hidden /> Copied</> : <><Copy size={14} aria-hidden /> Copy</>}
                        </button>
                        {speechOk && (
                          <button onClick={() => speak(stripMarkdown(m.content), i)} aria-label={speakingIndex === i ? 'Stop reading' : 'Read reply aloud'} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold hover:bg-lilac hover:text-primary">
                            {speakingIndex === i ? <><Square size={13} aria-hidden /> Stop</> : <><Volume2 size={14} aria-hidden /> Listen</>}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}

              {loading && (
                <div className="flex items-center gap-3" role="status">
                  <Orb size={28} mode="think" />
                  <span className="text-sm text-muted-foreground">JaliBot is thinking…</span>
                </div>
              )}
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="px-3 pb-safe pt-1 sm:px-4">
          <div className="mx-auto max-w-3xl">
            <Composer value={input} onChange={setInput} onSend={() => send()} busy={loading} listening={listening} micOk={micOk} onMic={toggleListening} />
            <p className="px-2 pb-1 pt-2 text-center text-xs text-muted-foreground">
              JaliBot is an AI and can make mistakes. In an emergency, call a helpline or{' '}
              <Link href="/talk" className="font-semibold text-primary underline">talk to a human</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Phone and tablet history drawer */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-night/60" />
          <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-mist shadow-pop focus:outline-none">
            <div className="flex items-center justify-between px-4 pb-1 pt-[max(1rem,env(safe-area-inset-top))]">
              <Dialog.Title className="font-display text-lg font-semibold">Chat history</Dialog.Title>
              <Dialog.Close className="tap grid place-items-center rounded-full hover:bg-lilac" aria-label="Close"><X size={20} aria-hidden /></Dialog.Close>
            </div>
            <div className="min-h-0 flex-1">{sidebar(() => setDrawerOpen(false))}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
