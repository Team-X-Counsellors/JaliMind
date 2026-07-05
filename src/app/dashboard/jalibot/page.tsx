'use client';
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'bot';
  content: string;
  crisis?: boolean;
}

export default function JalibotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Habari! I'm JaliBot, your AI counselling companion. How are you feeling today? I'm here to listen and support you." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/api/jalibot/chat/', { message: text });
      setMessages((m) => [...m, { role: 'bot', content: data.reply, crisis: data.crisis_detected }]);
      if (data.crisis_detected) setCrisisDetected(true);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { reply?: string } } })?.response?.data;
      const msg = data?.reply || 'Sorry, I had trouble responding. Please try again in a moment.';
      setMessages((m) => [...m, { role: 'bot', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="mb-4">
        <h2 className="text-2xl font-bold font-display">JaliBot AI</h2>
        <p className="text-muted-foreground text-sm">Confidential, culturally aware AI guidance</p>
      </div>

      {crisisDetected && (
        <Card className="mb-4 border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            JaliBot has detected distress signals. You&apos;re not alone — please reach out to a counselor or crisis line:
          </p>
          <ul className="text-sm mt-2 space-y-1 text-destructive/80">
            <li>Kenya: Befrienders Kenya — +254 722 178 177</li>
            <li>Nigeria: SURPIN — 0800-800-2000</li>
            <li>South Africa: SADAG — 0800 456 789</li>
          </ul>
        </Card>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-card border border-border rounded-tl-sm'
              }`}
            >
              {msg.crisis && (
                <Badge variant="destructive" className="mb-2 text-xs">Crisis support activated</Badge>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground">
              JaliBot is thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-4 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          disabled={loading}
          className="flex-1"
        />
        <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
      </div>
    </div>
  );
}
