import Link from 'next/link';
import Image from 'next/image';
import { Check } from 'lucide-react';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';
import { servicesData } from '@/data/services';

export const metadata = { title: 'Services | JaliMind' };

export default function Services() {
  return (
    <MarketingPage>
      <PageHeader title="Support that fits your day">Pick what feels right. Switch any time.</PageHeader>

      <div className="bg-mist">
        <div className="mx-auto max-w-5xl space-y-6 px-5 py-12 md:space-y-10 md:py-20">
          {servicesData.map((s, i) => {
            const Icon = s.icon;
            return (
              <section key={s.id} id={s.id} className="scroll-mt-20 overflow-hidden rounded-[2rem] bg-white shadow-soft md:grid md:grid-cols-2">
                <div className={`relative aspect-[16/10] md:aspect-auto md:min-h-[320px] ${i % 2 ? 'md:order-2' : ''}`}>
                  <Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-1 text-sm font-semibold text-primary">
                    <Icon size={16} aria-hidden /> {s.tag}
                  </span>
                  <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">{s.title}</h2>
                  <p className="mt-2 text-lg text-muted-foreground">{s.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <Check size={20} className="mt-0.5 shrink-0 text-calm" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mx-auto max-w-5xl px-5 pb-16 text-center">
          <Button asChild variant="cta" size="lg"><Link href="/talk">Talk to someone now</Link></Button>
          <p className="mt-3 text-muted-foreground">or <Link href="/auth/register" className="font-semibold text-primary underline">create a free account</Link></p>
        </div>
      </div>
    </MarketingPage>
  );
}
