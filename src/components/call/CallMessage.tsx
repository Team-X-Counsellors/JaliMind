import Link from 'next/link';
import { CalendarX2, CheckCircle2, Clock, Lock, PhoneOff, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tone = 'ended' | 'early' | 'blocked' | 'over' | 'offline' | 'text' | 'loading';
const ICON = { ended: CheckCircle2, early: Clock, blocked: Lock, over: CalendarX2, offline: WifiOff, text: PhoneOff, loading: Clock } as const;

/** Full-screen plain-language state for the call route: ended, too early, not allowed, etc. */
export default function CallMessage({
  tone, title, body, actions,
}: { tone: Tone; title: string; body?: string; actions?: { label: string; href?: string; onClick?: () => void; primary?: boolean }[] }) {
  const Icon = ICON[tone];
  return (
    <div className="min-h-dvh-screen flex flex-col items-center justify-center bg-night px-6 text-center text-white" role={tone === 'loading' ? 'status' : undefined}>
      <span className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${tone === 'ended' ? 'bg-lagoon/25 text-lagoon-light' : tone === 'loading' ? 'animate-pulse bg-white/10' : 'bg-white/10 text-marigold'}`}>
        <Icon size={36} />
      </span>
      <h1 className="font-display text-3xl font-bold text-balance">{title}</h1>
      {body && <p className="mt-2 max-w-sm text-white/70">{body}</p>}
      <div className="pb-safe mt-8 flex w-full max-w-xs flex-col gap-3">
        {actions?.map((a) => {
          const variant = a.primary ? 'cta' : 'soft';
          return a.href ? (
            <Button key={a.label} asChild size="lg" variant={variant}><Link href={a.href}>{a.label}</Link></Button>
          ) : (
            <Button key={a.label} size="lg" variant={variant} onClick={a.onClick}>{a.label}</Button>
          );
        })}
      </div>
    </div>
  );
}
