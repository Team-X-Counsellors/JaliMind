'use client';
import { useEffect, useRef } from 'react';
import { ArrowUp, Mic } from 'lucide-react';

/** Message box: one rounded card that grows with the text, mic and send inside it. */
export default function Composer({
  value, onChange, onSend, busy, listening, micOk, onMic,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  busy: boolean;
  listening: boolean;
  micOk: boolean;
  onMic: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [value]);

  const canSend = !busy && value.trim().length > 0;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (canSend) onSend(); }}
      className="rounded-[28px] border border-border bg-card p-2 shadow-soft transition-shadow focus-within:border-primary/40 focus-within:shadow-pop"
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (canSend) onSend(); } }}
        rows={1}
        maxLength={2000}
        placeholder={listening ? 'Listening…' : 'Tell JaliBot what is on your mind'}
        aria-label="Your message"
        className="block max-h-[168px] w-full resize-none bg-transparent px-3 pb-1 pt-2 text-base leading-relaxed placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="flex items-center justify-between px-1 pb-0.5 pt-1">
        {micOk ? (
          <button
            type="button"
            onClick={onMic}
            aria-label={listening ? 'Stop listening' : 'Speak your message'}
            aria-pressed={listening}
            className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
              listening ? 'animate-pulse bg-hibiscus text-white' : 'text-muted-foreground hover:bg-lilac hover:text-primary'
            }`}
          >
            <Mic size={20} aria-hidden />
          </button>
        ) : <span />}
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground shadow-soft transition-all hover:brightness-95 active:scale-95 disabled:bg-lilac disabled:text-muted-foreground disabled:shadow-none"
        >
          <ArrowUp size={20} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </form>
  );
}
