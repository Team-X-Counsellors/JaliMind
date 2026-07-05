'use client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const quickLinks = [
  { href: '/dashboard/jalibot', label: 'JaliBot AI', desc: 'Chat with our AI counselling assistant', icon: '✦', color: 'bg-primary/10 text-primary' },
  { href: '/dashboard/shadow', label: 'Shadow Chat', desc: 'Fully anonymous — no identity needed', icon: '◎', color: 'bg-muted text-foreground' },
  { href: '/dashboard/counselors', label: 'Find a Counselor', desc: 'Book a session with a human professional', icon: '✜', color: 'bg-accent/10 text-accent-foreground' },
  { href: '/dashboard/library', label: 'Library', desc: 'Resources, articles and self-help tools', icon: '⊟', color: 'bg-secondary text-secondary-foreground' },
  { href: '/dashboard/circle', label: 'Circle', desc: 'Peer community forum — share & connect', icon: '◈', color: 'bg-primary/10 text-primary' },
  { href: '/dashboard/appointments', label: 'Appointments', desc: 'View your upcoming & past sessions', icon: '◷', color: 'bg-muted text-foreground' },
];

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display">
          Welcome back, {user?.first_name || user?.username}
        </h2>
        <p className="text-muted-foreground mt-1">
          How are you doing today? Choose where you&apos;d like to start.
        </p>
        {user?.university && (
          <Badge variant="secondary" className="mt-2">{user.university}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-border/60 hover:border-primary/30">
              <CardHeader className="pb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-2 ${item.color}`}>
                  {item.icon}
                </div>
                <CardTitle className="text-base">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.desc}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Your privacy matters.</span>{' '}
            Shadow Chat sessions are cryptographically anonymous — no link to your identity is ever stored.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
