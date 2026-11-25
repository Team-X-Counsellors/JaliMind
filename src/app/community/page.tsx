import Link from 'next/link';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';
import { communityCategoriesData } from '@/data/community';

export const metadata = { title: 'Community | JaliMind' };

export default function Community() {
  return (
    <MarketingPage>
      <PageHeader title="Student to student support">
        Jali Circle is where students share and listen. You are not the only one.
      </PageHeader>

      <section className="bg-mist px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Topics in the Circle</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {communityCategoriesData.map((c) => (
              <li key={c.label} className="flex min-h-[44px] items-center rounded-full bg-white px-5 font-semibold shadow-soft">
                {c.label}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-muted-foreground">Create a free account to read and post.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg"><Link href="/auth/register">Join the Circle</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/auth/login">Sign in</Link></Button>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
