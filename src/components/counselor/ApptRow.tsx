'use client';
import Link from 'next/link';
import { MessageSquareText, Mic, Video } from 'lucide-react';
import { Appt, SESSION_LABEL, fmtWhen, relTime } from '@/lib/counselor';

const ICON = { video: Video, voice: Mic, text: MessageSquareText, anonymous: MessageSquareText } as const;

export const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-marigold/25 text-night',
  confirmed: 'bg-lagoon/15 text-[#0F6F63]',
  in_progress: 'bg-lagoon/15 text-[#0F6F63]',
  completed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-muted text-muted-foreground',
  no_show: 'bg-muted text-muted-foreground',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status] ?? 'bg-muted'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

/** One appointment. `actions` slot holds the buttons that fit the current tab. */
export default function ApptRow({ appt, actions, showStatus = false }: { appt: Appt; actions?: React.ReactNode; showStatus?: boolean }) {
  const Icon = ICON[appt.session_type] ?? MessageSquareText;
  return (
    <li className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate font-display font-semibold">{appt.student_name}</p>
            {showStatus && <StatusPill status={appt.status} />}
          </div>
          <p className="text-sm text-muted-foreground">
            {fmtWhen(appt.scheduled_at)} · {appt.duration_minutes} min · {SESSION_LABEL[appt.session_type] ?? appt.session_type}
          </p>
          {['pending', 'confirmed', 'in_progress'].includes(appt.status) && (
            <p className="text-xs font-semibold text-primary">{relTime(appt.scheduled_at)}</p>
          )}
          {appt.notes && <p className="mt-2 rounded-xl bg-muted px-3 py-2 text-sm">“{appt.notes}”</p>}
        </div>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </li>
  );
}

export function JoinLink({ appt }: { appt: Appt }) {
  if (appt.session_type === 'video' || appt.session_type === 'voice') {
    return (
      <Link href={`/call/${appt.id}`} className="tap inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 text-[15px] font-semibold text-accent-foreground shadow-pop sm:w-auto">
        {appt.session_type === 'video' ? <Video size={18} /> : <Mic size={18} />} Join {appt.session_type} call
      </Link>
    );
  }
  return <span className="text-sm text-muted-foreground">Text session: reply to the student in the chat they open.</span>;
}
