export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function relativeTime(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Local YYYY-MM-DD (not UTC), which is what the times endpoint expects. */
export function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function initials(name: string) {
  return name.replace(/^(Dr|Mr|Ms|Mrs|Prof)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}
