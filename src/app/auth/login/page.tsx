'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, homeFor } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthShell from '@/components/AuthShell';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identity.trim(), password);
      router.replace(homeFor(user?.role));
    } catch {
      setError('That email or password is not right. Try again, or use Google.');
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Pick up where you left off.">
      <GoogleSignInButton oneTap />
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />or use your email<span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="identity">Email or username</Label>
          <Input id="identity" value={identity} onChange={(e) => setIdentity(e.target.value)} required autoComplete="username" autoCapitalize="none" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="pr-12" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}
              className="tap absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link href="/auth/register" className="font-semibold text-primary underline">Create a free account</Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Just want to talk? <Link href="/talk" className="font-semibold text-primary underline">Chat anonymously</Link>
      </p>
    </AuthShell>
  );
}
