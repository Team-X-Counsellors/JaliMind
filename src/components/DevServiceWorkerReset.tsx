'use client';
import { useEffect } from 'react';

/**
 * JaliMind has no service worker. On localhost, other apps often run on the same port and leave one
 * behind, which then serves this app stale CSS and scripts (new layouts look broken until a hard refresh).
 * Remove any such worker, and its caches, in development only.
 */
export default function DevServiceWorkerReset() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !['localhost', '127.0.0.1'].includes(location.hostname)) return;
    navigator.serviceWorker?.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
    caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
  }, []);
  return null;
}
