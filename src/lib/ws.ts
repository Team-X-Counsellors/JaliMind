/** WebSocket helpers shared by anonymous chat and call signalling. */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** http(s)://host -> ws(s)://host, so the same env var drives REST and sockets. */
export function wsUrl(path: string, params: Record<string, string> = {}) {
  const base = API_URL.replace(/^http/, 'ws').replace(/\/$/, '');
  const qs = new URLSearchParams(params).toString();
  return `${base}${path}${qs ? `?${qs}` : ''}`;
}

export interface LiveSocket {
  close: () => void;
  send: (data: unknown) => void;
}

/**
 * Reconnecting socket for chat. Mobile networks drop constantly, so we retry with backoff and
 * call onOpen again after every reconnect so the caller can re-fetch anything it missed over REST.
 * Close codes 4403 (not allowed) and 4408 (outside call window) are final: we don't retry them.
 */
export function openLiveSocket(opts: {
  url: () => string; // called per attempt so a refreshed token can be used
  onMessage: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onOpen?: () => void;
  onStatus?: (s: 'connecting' | 'open' | 'closed') => void;
  /** Called with the close code on every close (4403 = not allowed, 4408 = outside call window). */
  onClose?: (code: number) => void;
}): LiveSocket {
  let ws: WebSocket | null = null;
  let stopped = false;
  let attempt = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const connect = () => {
    if (stopped) return;
    opts.onStatus?.('connecting');
    ws = new WebSocket(opts.url());
    ws.onopen = () => { attempt = 0; opts.onStatus?.('open'); opts.onOpen?.(); };
    ws.onmessage = (e) => { try { opts.onMessage(JSON.parse(e.data)); } catch { /* ignore malformed */ } };
    ws.onclose = (e) => {
      opts.onStatus?.('closed');
      opts.onClose?.(e.code);
      if (stopped || e.code === 4403 || e.code === 4408) return;
      attempt += 1;
      timer = setTimeout(connect, Math.min(1000 * 2 ** attempt, 15000));
    };
  };
  connect();

  return {
    close: () => { stopped = true; if (timer) clearTimeout(timer); ws?.close(); },
    send: (data) => { if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data)); },
  };
}
