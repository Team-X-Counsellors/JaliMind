import { Phone } from 'lucide-react';
import { CrisisResource, DEFAULT_CRISIS } from '@/lib/shadow';
import { telHref } from '@/lib/format';

/** Hotlines, one tap to call. Hibiscus is reserved for exactly this kind of moment. */
export default function CrisisCard({
  resources,
  title = 'Need to talk to someone right now?',
  tone = 'alert',
}: {
  resources?: CrisisResource[] | null;
  title?: string;
  tone?: 'alert' | 'quiet';
}) {
  const list = resources && resources.length ? resources : DEFAULT_CRISIS;
  const alert = tone === 'alert';
  return (
    <section
      aria-label="Crisis helplines"
      className={`rounded-2xl p-4 ${alert ? 'bg-hibiscus/10 ring-1 ring-hibiscus/30' : 'bg-secondary'}`}
    >
      <p className={`font-display text-sm font-semibold ${alert ? 'text-hibiscus' : 'text-foreground'}`}>{title}</p>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {list.map((r) => (
          <li key={r.country}>
            <a
              href={telHref(r.phone)}
              className="tap flex items-center gap-3 rounded-xl bg-card px-3 py-2 text-sm shadow-soft active:scale-[0.99]"
            >
              <Phone size={16} className={alert ? 'text-hibiscus' : 'text-primary'} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{r.country}</span>
                <span className="block truncate text-xs text-muted-foreground">{r.name}</span>
              </span>
              <span className="whitespace-nowrap text-xs font-semibold">{r.phone}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
