'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth, homeFor } from '@/contexts/AuthContext';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global { interface Window { google?: any } }

let scriptPromise: Promise<void> | null = null;
function loadGsi() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => { scriptPromise = null; reject(new Error('Google script failed to load')); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/**
 * Official "Sign in with Google" button (Google Identity Services).
 * Follows Google's guidance: the ID token is sent to OUR backend, which verifies it and issues
 * our own session. We never trust anything decoded in the browser.
 * New accounts need privacy consent first; pass `consent` from your form, or we ask when the
 * server replies "consent_required".
 */
export default function GoogleSignInButton({ consent = false, oneTap = false }: { consent?: boolean; oneTap?: boolean }) {
  const { startSession } = useAuth();
  const router = useRouter();
  const holder = useRef<HTMLDivElement>(null);
  const consentRef = useRef(consent);
  const [error, setError] = useState('');
  const [needConsent, setNeedConsent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { consentRef.current = consent; }, [consent]);

  const exchange = async (credential: string, agreed: boolean) => {
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/google/', { credential, consent_given: agreed });
      const user = startSession(data);
      router.replace(homeFor(user?.role ?? data.user?.role));
    } catch (err: any) {
      const res = err?.response;
      if (res?.status === 428) { setNeedConsent(credential); }
      else setError(res?.data?.error || 'Google sign-in did not work. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!CLIENT_ID || !holder.current) return;
    let cancelled = false;
    loadGsi().then(() => {
      if (cancelled || !holder.current || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp: { credential: string }) => exchange(resp.credential, consentRef.current),
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      const width = Math.min(holder.current.offsetWidth || 320, 400);
      window.google.accounts.id.renderButton(holder.current, {
        type: 'standard', theme: 'outline', size: 'large', shape: 'pill',
        text: 'continue_with', logo_alignment: 'left', width,
      });
      if (oneTap) window.google.accounts.id.prompt();
    }).catch(() => setError('Could not load Google sign-in. Check your connection.'));
    return () => { cancelled = true; window.google?.accounts?.id?.cancel?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneTap]);

  if (!CLIENT_ID) return null;

  return (
    <div className="w-full">
      <div ref={holder} className="flex min-h-[44px] w-full justify-center" aria-busy={busy} />
      {needConsent && (
        <div className="mt-3 rounded-2xl border border-border bg-secondary/60 p-4 text-sm">
          <p className="mb-3">To create your account, please agree to how we protect your data.</p>
          <button
            onClick={() => { const c = needConsent; setNeedConsent(null); exchange(c, true); }}
            className="tap w-full rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            I agree. Create my account
          </button>
          <a href="/privacy" className="mt-2 block text-center text-primary underline">Read the privacy policy</a>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
