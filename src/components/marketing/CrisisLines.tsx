import { Phone } from 'lucide-react';
import { crisisLines, telHref } from '@/data/crisis';

/** Tap-to-call hotlines. `dark` for night backgrounds. */
export default function CrisisLines({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {crisisLines.map((l) => (
        <li key={l.country}>
          <a
            href={telHref(l.phone)}
            className={`flex min-h-[56px] items-center gap-3 rounded-2xl px-4 py-2 transition-colors ${
              dark ? 'bg-white/10 hover:bg-white/15' : 'bg-white shadow-soft hover:bg-lilac'
            }`}
          >
            <Phone size={18} className={dark ? 'text-marigold' : 'text-primary'} aria-hidden />
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{l.country}: {l.phone}</span>
              <span className={`block text-xs ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>{l.name}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
