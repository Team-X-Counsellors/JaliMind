import Link from 'next/link';
import Image from 'next/image';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';
import { counsellorsData } from '@/data/counsellors';

export const metadata = { title: 'Counsellors | JaliMind' };

export default function Counsellors() {
  return (
    <MarketingPage>
      <PageHeader title="Meet our counsellors">Video, voice or text. You choose.</PageHeader>

      <div className="bg-mist px-5 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-8 rounded-2xl bg-lilac px-5 py-3 text-muted-foreground">
            These are example profiles from our pilot. Sign in to see counsellors you can book today.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {counsellorsData.map((c) => (
              <li key={c.name} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image src={c.image} alt={c.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top" />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-xl font-bold">{c.name}</h2>
                  <p className="text-muted-foreground">{c.role} · {c.country}</p>
                  <p className="mt-2 font-semibold text-primary">{c.specialty}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Speaks {c.languages.join(', ')}</p>
                  <Button asChild variant="soft" className="mt-4 w-full"><Link href="/auth/register">Book a session</Link></Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MarketingPage>
  );
}
