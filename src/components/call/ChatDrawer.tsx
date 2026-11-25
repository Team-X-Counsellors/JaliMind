'use client';
import { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVisualViewportHeight } from '@/lib/counselor';
import type { ChatMsg } from '@/lib/webrtc';

/** In-call text chat. Sits above the on-screen keyboard on phones. */
export default function ChatDrawer({
  open, onClose, messages, onSend,
}: { open: boolean; onClose: () => void; messages: ChatMsg[]; onSend: (t: string) => void }) {
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const vvh = useVisualViewportHeight();

  useEffect(() => { if (open) endRef.current?.scrollIntoView({ block: 'end' }); }, [open, messages.length, vvh]);

  if (!open) return null;
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSend(text); setText(''); };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col justify-end" style={{ height: vvh ? `${vvh}px` : '100dvh' }}>
      <div className="absolute inset-0 bg-night/50" onClick={onClose} />
      <section role="dialog" aria-label="Chat during call" className="pb-safe relative mx-auto flex max-h-[75%] min-h-[40%] w-full max-w-lg flex-col rounded-t-3xl bg-card text-foreground shadow-pop">
        <div className="flex items-center justify-between px-4 pt-3">
          <h2 className="font-display font-bold">Chat</h2>
          <button onClick={onClose} aria-label="Close chat" className="tap flex items-center justify-center rounded-full hover:bg-secondary"><X size={20} /></button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3" role="log" aria-live="polite">
          {messages.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Messages here are only seen by the two of you and are not saved.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-[15px] ${m.mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary'}`}>{m.text}</p>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form onSubmit={submit} className="flex gap-2 border-t border-border px-3 py-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Write a message…" aria-label="Message"
            className="h-12 min-w-0 flex-1 rounded-full border-2 border-input bg-background px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <Button type="submit" size="icon" aria-label="Send" disabled={!text.trim()} className="h-12 w-12"><Send size={19} /></Button>
        </form>
      </section>
    </div>
  );
}
