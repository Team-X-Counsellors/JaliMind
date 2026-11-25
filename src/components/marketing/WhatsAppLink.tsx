'use client';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/ws';

/**
 * Click-to-chat link to the platform's WhatsApp number. It renders nothing unless the backend
 * has WHATSAPP_NUMBER configured, so we never show a dead button. This is a link only:
 * sessions and follow-ups do not happen inside WhatsApp.
 */
export default function WhatsAppLink({ className = '', children = 'Message us on WhatsApp' }: { className?: string; children?: React.ReactNode }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let live = true;
    fetch(`${API_URL}/api/referrals/whatsapp/`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d?.enabled && d.url) setUrl(d.url); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  if (!url) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
