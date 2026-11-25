'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CalendarClock, CalendarDays, Home, LogOut, MessageCircle, MoreHorizontal, UserCircle, Users } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { usePolling } from '@/lib/counselor';
import Sheet from './Sheet';

interface Badge { waiting: number; urgent: number; refresh: () => void }
const BadgeCtx = createContext<Badge>({ waiting: 0, urgent: 0, refresh: () => {} });
export const useBadge = () => useContext(BadgeCtx);

const NAV = [
  { href: '/counselor', label: 'Home', icon: Home, exact: true },
  { href: '/counselor/chats', label: 'Chats', icon: MessageCircle },
  { href: '/counselor/sessions', label: 'Sessions', icon: CalendarClock },
  { href: '/counselor/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/counselor/students', label: 'Students', icon: Users },
  { href: '/counselor/profile', label: 'Profile', icon: UserCircle },
];
const MOBILE_TABS = NAV.slice(0, 4);

export default function CounselorShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [more, setMore] = useState(false);

  const allowed = isAuthenticated && user?.role === 'counselor';

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace('/auth/login');
    else if (user?.role !== 'counselor') router.replace('/dashboard');
  }, [loading, isAuthenticated, user, router]);

  const { data, refresh } = usePolling(
    async () => (await api.get('/api/counselors/dashboard/')).data.stats as { waiting_chats: number; urgent_chats: number },
    allowed ? 10000 : null,
  );
  const badge = useMemo(() => ({ waiting: data?.waiting_chats ?? 0, urgent: data?.urgent_chats ?? 0, refresh }), [data, refresh]);

  if (loading || !allowed) {
    return (
      <div className="min-h-dvh-screen flex items-center justify-center bg-night text-white/70" role="status">
        <span className="animate-pulse text-sm">{loading ? 'Loading your workspace…' : 'Taking you to the right place…'}</span>
      </div>
    );
  }

  // A live chat uses the whole screen on phones: no bars, composer sits above the keyboard.
  const immersive = /^\/counselor\/chats\/[^/]+$/.test(pathname);
  const active = (item: (typeof NAV)[number]) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <BadgeCtx.Provider value={badge}>
      <div className="min-h-dvh-screen bg-background lg:flex">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-night px-4 py-6 text-white lg:flex">
          <Link href="/counselor" className="mb-8 px-3 font-display text-xl font-bold">
            Jali<span className="text-marigold">Mind</span>
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 align-middle text-[11px] font-medium text-white/70">Counsellor</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} aria-current={active(item) ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active(item) ? 'bg-white text-night' : 'text-white/75 hover:bg-white/10'}`}>
                <item.icon size={19} />
                <span className="flex-1">{item.label}</span>
                {item.href === '/counselor/chats' && badge.waiting > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge.urgent ? 'bg-hibiscus text-white' : 'bg-marigold text-night'}`}>{badge.waiting}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 pt-4">
            <p className="truncate px-3 text-sm font-medium">{user?.first_name || user?.username}</p>
            <button onClick={logout} className="tap mt-2 flex w-full items-center gap-3 rounded-xl px-3 text-sm text-white/70 hover:bg-white/10">
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          {!immersive && (
            <header className="sticky top-0 z-20 flex items-center justify-between bg-night px-4 py-3 text-white lg:hidden">
              <Link href="/counselor" className="font-display text-lg font-bold">Jali<span className="text-marigold">Mind</span></Link>
              <span className="text-xs text-white/60">Hi, {user?.first_name || user?.username}</span>
            </header>
          )}
          <main className={immersive ? '' : 'mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 lg:px-8 lg:pb-10 lg:pt-8'}>
            {children}
          </main>
        </div>

        {/* Mobile bottom tab bar */}
        {!immersive && (
          <nav aria-label="Main" className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
            <ul className="mx-auto grid max-w-lg grid-cols-5">
              {MOBILE_TABS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active(item) ? 'page' : undefined}
                    className={`relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${active(item) ? 'text-primary' : 'text-muted-foreground'}`}>
                    <span className="relative">
                      <item.icon size={22} strokeWidth={active(item) ? 2.5 : 2} />
                      {item.href === '/counselor/chats' && badge.waiting > 0 && (
                        <span className={`absolute -right-2.5 -top-1.5 min-w-[18px] rounded-full px-1 text-center text-[10px] font-bold leading-[18px] ${badge.urgent ? 'bg-hibiscus text-white' : 'bg-marigold text-night'}`}>
                          {badge.waiting}
                        </span>
                      )}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={() => setMore(true)} className="flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted-foreground">
                  <MoreHorizontal size={22} /> More
                </button>
              </li>
            </ul>
          </nav>
        )}

        <Sheet open={more} onClose={() => setMore(false)} title="More">
          <div className="space-y-2">
            {NAV.slice(4).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMore(false)} className="tap flex items-center gap-3 rounded-xl bg-secondary/60 px-4 py-3 font-semibold">
                <item.icon size={20} className="text-primary" /> {item.label}
              </Link>
            ))}
            <button onClick={logout} className="tap flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-muted-foreground hover:bg-secondary">
              <LogOut size={20} /> Sign out
            </button>
          </div>
        </Sheet>
      </div>
    </BadgeCtx.Provider>
  );
}
