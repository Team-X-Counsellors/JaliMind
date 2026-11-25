'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/counsellors', label: 'Counsellors' },
  { href: '/community', label: 'Community' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  // The drawer is "open" only for the page it was opened on, so navigating closes it
  // without needing an effect to reset state.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-marigold focus:px-4 focus:py-2 focus:text-night">
        Skip to content
      </a>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5" aria-label="Main">
        <Link href="/" className="tap flex items-center font-display text-xl font-bold tracking-tight">
          Jali<span className="text-marigold">Mind</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-[15px] font-medium transition-colors hover:text-marigold ${pathname === l.href ? 'text-marigold' : 'text-white/85'}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/auth/login" className="text-[15px] font-medium text-white/85 transition-colors hover:text-marigold">Sign in</Link>
          <Button asChild variant="cta" size="sm"><Link href="/talk">Talk now</Link></Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button asChild variant="cta" size="sm"><Link href="/talk">Talk now</Link></Button>
          <button
            onClick={() => setOpenedOn(open ? null : pathname)}
            className="tap flex items-center justify-center rounded-full"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-night px-5 pb-safe md:hidden">
          <ul className="mt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-[60px] items-center border-b border-white/10 font-display text-2xl font-semibold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="flex min-h-[60px] items-center border-b border-white/10 font-display text-2xl font-semibold">Contact</Link>
            </li>
          </ul>
          <div className="mt-auto space-y-3 py-6">
            <Button asChild variant="cta" size="lg" className="w-full"><Link href="/talk">Talk to someone now</Link></Button>
            <Button asChild size="lg" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:border-white hover:text-white">
              <Link href="/auth/register">Create free account</Link>
            </Button>
            <Link href="/auth/login" className="flex min-h-[48px] items-center justify-center text-base font-semibold text-white/85">Sign in</Link>
          </div>
        </div>
      )}
    </header>
  );
}
