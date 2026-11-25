import { Phone, ShieldAlert } from 'lucide-react';
import { CRISIS_HOTLINES } from '@/lib/counselor';

/** Counsellor-facing protocol reminder for chats where the student may be at risk. */
export default function CrisisCard({ compact = false }: { compact?: boolean }) {
  return (
    <div role="note" className="rounded-2xl border-2 border-hibiscus/40 bg-hibiscus/10 p-4 text-sm">
      <p className="flex items-center gap-2 font-display font-bold text-hibiscus">
        <ShieldAlert size={18} /> Possible risk: safety first
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>Stay with them. Keep replying; do not rush to end the chat.</li>
        <li>Ask directly: “Are you thinking about hurting yourself or ending your life?”</li>
        <li>Ask if they are safe right now and if someone is nearby.</li>
        <li>Share a hotline below and the campus counselling office.</li>
      </ul>
      {!compact && (
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {CRISIS_HOTLINES.map((h) => (
            <li key={h.country}>
              <a href={`tel:${h.phone.replace(/\s/g, '')}`} className="tap flex items-center gap-2 rounded-xl bg-card px-3 py-2 font-semibold">
                <Phone size={15} className="shrink-0 text-hibiscus" />
                <span className="min-w-0"><span className="block truncate">{h.country}: {h.name}</span><span className="font-normal text-muted-foreground">{h.phone}</span></span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
