import Link from 'next/link';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Blog | JaliMind' };

// No fake posts: the blog goes live when there are real articles to read.
export default function Blog() {
  return (
    <MarketingPage>
      <PageHeader title="The blog is coming">Honest, short articles from counsellors.</PageHeader>
      <section className="bg-mist px-5 py-14 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-lg text-muted-foreground">For now, the library has short reads on stress, sleep and anxiety.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="default" size="lg"><Link href="/resources">Browse resources</Link></Button>
            <Button asChild variant="outline" size="lg"><Link href="/">Back home</Link></Button>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
