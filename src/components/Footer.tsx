import Link from 'next/link';
import CrisisLines from '@/components/marketing/CrisisLines';
import WhatsAppLink from '@/components/marketing/WhatsAppLink';

const links = [
  { href: '/services', label: 'Services' },
  { href: '/counsellors', label: 'Counsellors' },
  { href: '/community', label: 'Community' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl font-bold">Jali<span className="text-marigold">Mind</span></p>
            <p className="mt-2 max-w-xs text-white/70">Private, free support for African university students.</p>
            <nav aria-label="Footer" className="mt-5 flex flex-wrap gap-x-5">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="flex min-h-[44px] items-center text-[15px] text-white/80 hover:text-marigold">
                  {l.label}
                </Link>
              ))}
            </nav>
            <WhatsAppLink className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-marigold underline underline-offset-4" />
          </div>

          <div className="rounded-3xl bg-white/5 p-5">
            <p className="font-display text-lg font-semibold">In danger right now? Call.</p>
            <p className="mb-3 mt-1 text-sm text-white/60">Free crisis lines. JaliMind is not an emergency service.</p>
            <CrisisLines dark />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-white/10 pt-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} JaliMind</p>
          <div className="flex flex-wrap gap-x-5">
            {[['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/accessibility', 'Accessibility']].map(([href, label]) => (
              <Link key={href} href={href} className="flex min-h-[44px] items-center hover:text-white">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
