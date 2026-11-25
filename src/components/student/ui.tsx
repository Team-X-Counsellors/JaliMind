import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function PageHeader({
  title, subtitle, back, action,
}: { title: string; subtitle?: string; back?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-5">
      {back && (
        <Link href={back} className="tap -ml-2 mb-1 inline-flex items-center gap-1 px-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} aria-hidden /> Back
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-balance sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

const TONES: Record<string, string> = {
  pending: 'bg-marigold/20 text-[#8a5a00]',
  confirmed: 'bg-calm/15 text-[#0f6f63]',
  in_progress: 'bg-calm/15 text-[#0f6f63]',
  completed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-muted text-muted-foreground',
  no_show: 'bg-muted text-muted-foreground',
  requested: 'bg-marigold/20 text-[#8a5a00]',
  contacted: 'bg-primary/10 text-primary',
  done: 'bg-calm/15 text-[#0f6f63]',
};

const LABELS: Record<string, string> = {
  pending: 'Waiting for counsellor', confirmed: 'Confirmed', in_progress: 'In progress',
  completed: 'Completed', cancelled: 'Cancelled', no_show: 'Missed',
  requested: 'Requested', contacted: 'Contacted', done: 'Done',
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[status] ?? 'bg-muted'}`}>
      {LABELS[status] ?? status}
    </span>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border px-5 py-10 text-center">
      <p className="font-display font-semibold">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
      {label}…
    </div>
  );
}

export function Chip({
  active, onClick, children,
}: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`tap whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card text-foreground ring-1 ring-border hover:ring-primary'
      }`}
    >
      {children}
    </button>
  );
}
