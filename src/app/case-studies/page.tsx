import Link from 'next/link';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Case studies | JaliMind' };

// Intentionally empty of stories: we only publish case studies from real programmes, with permission.
export default function CaseStudies() {
  return (
    <MarketingPage>
      <PageHeader title="Case studies are coming">We&apos;ll share real results once our campus pilots finish.</PageHeader>
      <section className="bg-mist px-5 py-14 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg text-muted-foreground">Until then, you can try JaliMind yourself. It is free.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg"><Link href="/talk">Talk to someone now</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/services">See what we offer</Link></Button>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
