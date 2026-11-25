'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bot, BookOpen, CalendarClock, ClipboardCheck, HeartHandshake, Home, LogOut, Menu,
  MessagesSquare, Network, PanelLeftClose, PanelLeftOpen, Sparkles, Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MORE_GROUP = [
  '/dashboard/more', '/dashboard/circle', '/dashboard/memories', '/dashboard/referrals',
  '/dashboard/assessments', '/dashboard/counselors', '/dashboard/jalibot',
];

const tabs = [
  { href: '/dashboard', label: 'Home', icon: Home, match: (p: string) => p === '/dashboard' },
  { href: '/talk', label: 'Talk', icon: MessagesSquare, match: () => false },
  { href: '/dashboard/appointments', label: 'Sessions', icon: CalendarClock, match: (p: string) => p.startsWith('/dashboard/appointments') },
  { href: '/dashboard/library', label: 'Library', icon: BookOpen, match: (p: string) => p.startsWith('/dashboard/library') },
  { href: '/dashboard/more', label: 'More', icon: Menu, match: (p: string) => MORE_GROUP.some((g) => p.startsWith(g)) },
];

const sideLinks = [
  { href: '/dashboard', label: 'Home', icon: Home, exact: true },
  { href: '/dashboard/counselors', label: 'Counsellors', icon: HeartHandshake },
  { href: '/dashboard/appointments', label: 'Sessions', icon: CalendarClock },
  { href: '/dashboard/jalibot', label: 'JaliBot', icon: Bot },
  { href: '/dashboard/assessments', label: 'Check-ins', icon: ClipboardCheck },
  { href: '/dashboard/library', label: 'Library', icon: BookOpen },
  { href: '/dashboard/circle', label: 'Circle', icon: Users },
  { href: '/dashboard/referrals', label: 'Campus help', icon: Network },
  { href: '/dashboard/memories', label: 'Memories', icon: Sparkles },
];

// Full-screen experiences: no mobile tab bar (room for the keyboard) and a slim navigation rail.
const IMMERSIVE = ['/dashboard/jalibot'];
const NAV_KEY = 'jalimind_nav';

function Sidebar({ rail, overlay, onToggle }: { rail: boolean; overlay: boolean; onToggle: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const initial = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase();
  return (
    <aside
      aria-label="Navigation"
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-night py-5 text-white transition-[width] duration-200 md:flex ${
        rail ? 'w-16 px-2' : 'w-64 px-4'
      } ${overlay && !rail ? 'z-40 shadow-pop' : ''}`}
    >
      <div className={`mb-5 flex items-center ${rail ? 'flex-col gap-3' : 'justify-between px-2'}`}>
        <Link href="/dashboard" className="font-display text-xl font-bold" aria-label="JaliMind home">
          {rail ? <>J<span className="text-marigold">M</span></> : <>Jali<span className="text-marigold">Mind</span></>}
        </Link>
        <button
          onClick={onToggle}
          aria-label={rail ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!rail}
          title={rail ? 'Expand navigation' : 'Collapse navigation'}
          className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
        >
          {rail ? <PanelLeftOpen size={18} aria-hidden /> : <PanelLeftClose size={18} aria-hidden />}
        </button>
      </div>

      <Link
        href="/talk"
        title="Talk to someone"
        aria-label="Talk to someone"
        className={`mb-5 flex items-center justify-center gap-2 bg-marigold font-display font-semibold text-night shadow-pop hover:brightness-95 ${
          rail ? 'mx-auto h-11 w-11 rounded-full' : 'rounded-full px-4 py-3'
        }`}
      >
        <MessagesSquare size={18} aria-hidden /> {!rail && 'Talk to someone'}
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {sideLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={rail ? label : undefined}
              aria-label={rail ? label : undefined}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center rounded-xl text-sm font-medium transition-colors ${
                rail ? 'h-11 justify-center' : 'gap-3 px-3 py-2.5'
              } ${active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={19} aria-hidden /> {!rail && label}
            </Link>
          );
        })}
      </nav>

      <div className={`mt-4 flex border-t border-white/10 pt-4 ${rail ? 'flex-col items-center gap-3' : 'items-center gap-3 px-2'}`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-light font-semibold" title={rail ? user?.first_name || user?.username : undefined}>
          {initial}
        </span>
        {!rail && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.first_name || user?.username}</p>
            <p className="truncate text-xs text-white/60">{user?.email}</p>
          </div>
        )}
        <button onClick={logout} title="Sign out" aria-label="Sign out" className="tap grid place-items-center rounded-full text-white/70 hover:bg-white/10">
          <LogOut size={18} aria-hidden />
        </button>
      </div>
    </aside>
  );
}

function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-safe backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          const talk = href === '/talk';
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`tap flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {talk ? (
                  <span className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-pop">
                    <Icon size={22} aria-hidden />
                  </span>
                ) : (
                  <Icon size={22} aria-hidden strokeWidth={active ? 2.5 : 2} />
                )}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Guard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const staff = user && user.role !== 'student';

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.replace('/auth/login');
    else if (staff) router.replace('/counselor'); // counsellors/admins have their own workspace
  }, [isAuthenticated, loading, staff, router]);

  if (loading || !isAuthenticated || staff) {
    return (
      <div className="grid min-h-dvh-screen place-items-center bg-background text-sm text-muted-foreground" role="status">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersive = IMMERSIVE.some((p) => pathname.startsWith(p));

  // Normal pages remember the person's choice. Immersive pages (JaliBot) start as a slim rail and
  // expand over the content when asked, so the chat keeps its room.
  // (Read in a lazy initialiser: this tree only renders after the auth guard, so there is no hydration mismatch.)
  const [pref, setPref] = useState<'full' | 'rail'>(() =>
    typeof window !== 'undefined' && localStorage.getItem(NAV_KEY) === 'rail' ? 'rail' : 'full');
  const [expandedOn, setExpandedOn] = useState<string | null>(null); // the immersive path where the rail is expanded
  const openOnImmersive = expandedOn === pathname;

  const rail = immersive ? !openOnImmersive : pref === 'rail';
  const toggle = () => {
    if (immersive) { setExpandedOn(openOnImmersive ? null : pathname); return; }
    const next = pref === 'rail' ? 'full' : 'rail';
    setPref(next);
    localStorage.setItem(NAV_KEY, next);
  };

  return (
    <Guard>
      <Sidebar rail={rail} overlay={immersive} onToggle={toggle} />
      {immersive && !rail && (
        <button aria-label="Close navigation" tabIndex={-1} onClick={() => setExpandedOn(null)} className="fixed inset-0 z-30 hidden cursor-default bg-night/30 md:block" />
      )}
      <main className={`min-h-dvh-screen transition-[margin] duration-200 ${immersive || pref === 'rail' ? 'md:ml-16' : 'md:ml-64'} ${immersive ? '' : 'pb-24 md:pb-10'}`}>
        <div className={immersive ? '' : 'mx-auto max-w-3xl px-4 pb-6 pt-6 md:px-8 md:pt-10'}>{children}</div>
      </main>
      {!immersive && <TabBar />}
    </Guard>
  );
}
