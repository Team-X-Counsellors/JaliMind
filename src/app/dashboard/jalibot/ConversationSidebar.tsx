'use client';
import { Badge } from '@/components/ui/badge';

export interface ConversationSummary {
  id: string;
  title: string;
  started_at: string;
  last_message_at: string;
  crisis_detected: boolean;
  message_count: number;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-56 shrink-0 border-r border-border pr-3 overflow-y-auto hidden md:block">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
        Recent conversations
      </p>
      {conversations.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">No past conversations yet.</p>
      )}
      <div className="space-y-1">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-2 py-2 rounded-md text-sm transition-colors ${
              activeId === c.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{c.title || 'Untitled conversation'}</span>
              {c.crisis_detected && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
                  !
                </Badge>
              )}
            </div>
            <span
              className={`text-xs ${
                activeId === c.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {relativeTime(c.last_message_at)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
