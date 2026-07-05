'use client';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ShadowMessage {
  sender: 'user' | 'counselor' | 'bot';
  content: string;
  created_at: string;
}

interface Session {
  id: string;
  pseudonym: string;
  token: string;
}

export default function ShadowChatPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ShadowMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('shadow_session');
    if (stored) setSession(JSON.parse(stored));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = async () => {
    setStarting(true);
    try {
      const { data } = await axios.post(`${BASE}/api/shadow/start/`);
      const s = { id: data.session_id, pseudonym: data.pseudonym, token: data.token };
      setSession(s);
      sessionStorage.setItem('shadow_session', JSON.stringify(s));
    } catch {
      alert('Failed to start anonymous session. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !session || loading) return;
    setInput('');
    const optimistic: ShadowMessage = { sender: 'user', content: text, created_at: new Date().toISOString() };
    setMessages((m) => [...m, optimistic]);
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BASE}/api/shadow/session/${session.id}/message/`,
        { content: text },
        { headers: { 'X-Shadow-Token': session.token } }
      );
      if (data.bot_reply) {
        setMessages((m) => [...m, { sender: 'bot', content: data.bot_reply, created_at: new Date().toISOString() }]);
      }
    } catch {
      setMessages((m) => [...m, { sender: 'bot', content: 'Message failed to send.', created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const endSession = () => {
    sessionStorage.removeItem('shadow_session');
    setSession(null);
    setMessages([]);
  };

  if (!session) {
    return (
      <div className="max-w-lg mx-auto mt-10 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Shadow Chat</CardTitle>
            <CardDescription>
              Fully anonymous support — no login, no identity, no traces.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">◎</span> Your identity is never linked to this session</li>
              <li className="flex gap-2"><span className="text-primary">◎</span> You will be assigned a random African pseudonym</li>
              <li className="flex gap-2"><span className="text-primary">◎</span> Session ends when you close the tab</li>
              <li className="flex gap-2"><span className="text-primary">◎</span> Counselors can respond anonymously if referred</li>
            </ul>
            <Button onClick={startSession} disabled={starting} className="w-full">
              {starting ? 'Starting session…' : 'Start anonymous session'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Shadow Chat</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{session.pseudonym}</Badge>
            <span className="text-xs text-muted-foreground">Your anonymous identity</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={endSession}>End session</Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            Your session is active. Start by sharing what&apos;s on your mind.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : msg.sender === 'counselor'
                  ? 'bg-accent/20 border border-accent/30 rounded-tl-sm'
                  : 'bg-card border border-border rounded-tl-sm'
              }`}
            >
              {msg.sender === 'counselor' && (
                <span className="text-xs font-medium text-accent-foreground block mb-1">Counselor</span>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground">
              Sending…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Share what's on your mind…"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
      </div>
    </div>
  );
}
