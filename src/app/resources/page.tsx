import Link from 'next/link';
import Image from 'next/image';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';
import { resourcesData } from '@/data/resources';

export const metadata = { title: 'Resources | JaliMind' };

export default function Resources() {
  return (
    <MarketingPage>
      <PageHeader title="Short reads. Real help.">
        Topics from the JaliMind library. Workbooks and videos are coming soon.
      </PageHeader>

      <section className="bg-mist px-5 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resourcesData.map((r) => {
              const soon = r.type !== 'article';
              return (
                <li key={r.title} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                  {r.image && (
                    <div className="relative aspect-[16/9]">
                      <Image src={r.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className={`object-cover ${soon ? 'opacity-70 saturate-50' : ''}`} />
                    </div>
                  )}
                  <div className="p-5">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${soon ? 'bg-accent/30 text-night' : 'bg-lilac text-primary'}`}>
                      {soon ? `${r.type === 'video' ? 'Video' : 'Workbook'} · coming soon` : 'Article'}
                    </span>
                    <h2 className="mt-3 font-display text-lg font-bold leading-snug">{r.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{r.category}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 text-center">
            <Button asChild variant="cta" size="lg"><Link href="/auth/register">Open the library</Link></Button>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
