import Image from 'next/image';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { teamData } from '@/data/team';
import { getHeroAsset } from '@/data/heroAssets';

export const metadata = { title: 'About | JaliMind' };

export default function About() {
  const map = getHeroAsset('about-map');
  return (
    <MarketingPage>
      <PageHeader title="Support that fits African campuses">
        We add to campus counsellors. We don&apos;t replace them.
      </PageHeader>

      <section className="bg-mist px-5 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Why we built this</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Many students never ask for help. Fear of stigma gets in the way. So we made help you can reach privately, in your pocket.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">What we value</h2>
            <ul className="mt-3 space-y-2 text-lg text-muted-foreground">
              <li>Dignity and privacy first</li>
              <li>Real people, not just bots</li>
              <li>Working with campus services</li>
            </ul>
          </div>
        </div>
        {map && (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-[2rem] shadow-soft">
            <Image src={map.src} alt={map.alt} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
          </div>
        )}
      </section>

      <section className="bg-white px-5 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">The team</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {teamData.map((m) => (
              <li key={m.name}>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-lilac">
                  <Image src={m.image} alt={m.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                </div>
                <p className="mt-3 font-display font-semibold leading-tight">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <p className="text-sm text-muted-foreground">{m.country}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MarketingPage>
  );
}
