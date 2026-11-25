'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { openLiveSocket, wsUrl, LiveSocket } from '@/lib/ws';
import {
  CrisisResource, ShadowMessage, ShadowStatus, ShadowTopic, StoredSession,
  deleteShadow, getShadow, httpStatus, sendShadow, startShadow, storage,
} from '@/lib/shadow';

export type ChatPhase = 'loading' | 'pick' | 'chat' | 'ended';

/**
 * State machine for the anonymous chat with a human counsellor.
 * - Resumes from localStorage after a refresh.
 * - WebSocket for instant delivery, plus a 5s REST poll as a safety net for flaky mobile networks.
 * - Messages are de-duplicated by id because the same message can arrive over both channels.
 */
export function useShadowChat() {
  const [phase, setPhase] = useState<ChatPhase>('loading');
  const [session, setSession] = useState<StoredSession | null>(null);
  const [messages, setMessages] = useState<ShadowMessage[]>([]);
  const [status, setStatus] = useState<ShadowStatus>('waiting');
  const [crisis, setCrisis] = useState<CrisisResource[] | null>(null);
  const [counselorTyping, setCounselorTyping] = useState(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);

  const lastId = useRef(0);
  const sock = useRef<LiveSocket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastTypingSent = useRef(0);

  const merge = useCallback((incoming: ShadowMessage[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !seen.has(m.id));
      if (!fresh.length) return prev;
      const next = [...prev, ...fresh].sort((a, b) => a.id - b.id);
      lastId.current = next[next.length - 1].id;
      return next;
    });
    setCounselorTyping(false);
  }, []);

  const finish = useCallback(() => {
    sock.current?.close();
    sock.current = null;
    storage.clear();
    setSession(null);
    setMessages([]);
    lastId.current = 0;
    setPhase('ended');
  }, []);

  const refresh = useCallback(async (s: StoredSession) => {
    try {
      const snap = await getShadow(s.session_id, s.token, lastId.current || undefined);
      merge(snap.messages);
      setStatus(snap.status);
      if (snap.crisis_flagged) setCrisis(snap.crisis_resources ?? []);
      if (snap.status === 'closed') finish();
    } catch (e) {
      const code = httpStatus(e);
      if (code === 403 || code === 404) finish(); // expired, wiped, or not ours
    }
  }, [merge, finish]);

  // resume an existing chat after a refresh
  useEffect(() => {
    const stored = storage.get();
    if (!stored) { setPhase('pick'); return; }
    setSession(stored);
    setPhase('chat');
    refresh(stored);
  }, [refresh]);

  // live socket + poll fallback while a chat is open
  useEffect(() => {
    if (!session) return;
    const s = session;
    sock.current = openLiveSocket({
      url: () => wsUrl(`/ws/shadow/${s.session_id}/`, { token: s.token }),
      onOpen: () => { refresh(s); }, // catch up on anything missed while offline
      onMessage: (ev) => {
        if (ev.event === 'message') {
          merge([ev.message]);
          if (ev.message.sender === 'counselor') setStatus('active');
        } else if (ev.event === 'typing' && ev.from === 'counselor') {
          setCounselorTyping(true);
          clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => setCounselorTyping(false), 3500);
        } else if (ev.event === 'crisis') {
          setCrisis(ev.crisis_resources ?? []);
        } else if (ev.event === 'closed') {
          finish();
        }
      },
    });
    const poll = setInterval(() => refresh(s), 5000);
    return () => { sock.current?.close(); sock.current = null; clearInterval(poll); clearTimeout(typingTimer.current); };
  }, [session, refresh, merge, finish]);

  const start = async (topic: ShadowTopic) => {
    setStarting(true);
    setError('');
    try {
      const data = await startShadow(topic);
      const s: StoredSession = { session_id: data.session_id, token: data.token, pseudonym: data.pseudonym, expires_at: data.expires_at };
      storage.set(s);
      lastId.current = 0;
      setMessages([]);
      setStatus(data.status);
      setCrisis(topic === 'urgent' ? data.crisis_resources : null);
      setSession(s);
      setPhase('chat');
    } catch (e) {
      setError(httpStatus(e) === 429
        ? 'Too many chats started from this device. Please wait a bit, or call a helpline below.'
        : 'We could not start the chat. Check your connection and try again.');
    } finally {
      setStarting(false);
    }
  };

  const send = async (text: string) => {
    if (!session || !text.trim() || sending) return false;
    setSending(true);
    setError('');
    try {
      merge([await sendShadow(session.session_id, session.token, text.trim())]);
      return true;
    } catch (e) {
      const code = httpStatus(e);
      if (code === 403 || code === 404) finish();
      else setError(code === 429 ? 'Slow down a little. Try again in a moment.' : 'Message not sent. Check your connection and try again.');
      return false;
    } finally {
      setSending(false);
    }
  };

  const notifyTyping = () => {
    const now = Date.now();
    if (now - lastTypingSent.current > 2000) {
      lastTypingSent.current = now;
      sock.current?.send({ type: 'typing' });
    }
  };

  const wipe = async () => {
    if (session) { try { await deleteShadow(session.session_id, session.token); } catch { /* wipe locally regardless */ } }
    finish();
  };

  const reset = () => { setError(''); setCrisis(null); setStatus('waiting'); setPhase('pick'); };

  return { phase, session, messages, status, crisis, counselorTyping, error, starting, sending, start, send, notifyTyping, wipe, reset };
}
