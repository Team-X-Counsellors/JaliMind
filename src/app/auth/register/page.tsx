'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useAuth, homeFor } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthShell from '@/components/AuthShell';
import GoogleSignInButton from '@/components/GoogleSignInButton';

// Username is internal; people sign in with email, so we derive a unique one for them.
function makeUsername(email: string) {
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 18) || 'student';
  return `${base}${Math.random().toString(36).slice(2, 6)}`;
}

export default function RegisterPage() {
  const { startSession } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', email: '', university: '', password: '' });
  const [consent, setConsent] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    if (!consent) { setError('Please tick the box to agree to the privacy policy.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register/', {
        ...form,
        email: form.email.trim(),
        username: makeUsername(form.email),
        last_name: '',
        password_confirm: form.password,
        consent_given: true,
      });
      // The response already carries the user, so we go straight in. No second request, no bounce.
      const user = startSession(data);
      router.replace(homeFor(user?.role));
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[] | string> } })?.response?.data;
      const first = data ? Object.values(data).flat()[0] : null;
      setError(typeof first === 'string' ? first : 'We could not create your account. Check your details and try again.');
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Make a free account" subtitle="Private. Free for students. Takes under a minute.">
      <GoogleSignInButton consent={consent} />
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />or use your email<span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} required autoComplete="given-name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" inputMode="email" value={form.email} onChange={(e) => set('email', e.target.value)} required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="university">University <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Input id="university" value={form.university} onChange={(e) => set('university', e.target.value)} placeholder="University of Nairobi" autoComplete="organization" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} required autoComplete="new-password" className="pr-12" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
              className="tap absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#8B4A3C]" />
          <span>I agree to the <Link href="/privacy" className="font-semibold text-primary underline">privacy policy</Link>. My chats stay private.</span>
        </label>
        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating your account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/auth/login" className="font-semibold text-primary underline">Sign in</Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Not ready? <Link href="/talk" className="font-semibold text-primary underline">Chat anonymously</Link> without an account.
      </p>
    </AuthShell>
  );
}
