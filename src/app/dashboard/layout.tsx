'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '⌂', exact: true },
  { href: '/dashboard/jalibot', label: 'JaliBot AI', icon: '✦' },
  { href: '/dashboard/shadow', label: 'Shadow Chat', icon: '◎' },
  { href: '/dashboard/appointments', label: 'Appointments', icon: '◷' },
  { href: '/dashboard/library', label: 'Library', icon: '⊟' },
  { href: '/dashboard/circle', label: 'Circle', icon: '◈' },
  { href: '/dashboard/memories', label: 'Memories', icon: '◆' },
  { href: '/dashboard/counselors', label: 'Counselors', icon: '✜' },
];

function DashboardNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || user.username[0].toUpperCase()
    : '?';

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-card border-r border-border px-4 py-6 fixed left-0 top-0 z-30">
      <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2">
        <span className="text-xl font-bold text-primary font-display">JaliMind</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      <div className="flex items-center gap-3 px-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.first_name || user?.username}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="Sign out" className="shrink-0 h-8 w-8 text-muted-foreground">
          ⏏
        </Button>
      </div>
    </aside>
  );
}

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardGuard>
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 md:ml-60 min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </DashboardGuard>
  );
}
