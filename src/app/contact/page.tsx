import { Mail } from 'lucide-react';
import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';
import CrisisLines from '@/components/marketing/CrisisLines';
import WhatsAppLink from '@/components/marketing/WhatsAppLink';

export const metadata = { title: 'Contact | JaliMind' };

const EMAIL = 'hello@jalimind.org';
const topics = [
  { title: 'I\'m a student', text: 'Questions about using JaliMind.', subject: 'Student question' },
  { title: 'I represent a university', text: 'Partnerships and campus counselling teams.', subject: 'University partnership' },
  { title: 'I\'m press or media', text: 'Interviews and information.', subject: 'Media enquiry' },
];

export default function Contact() {
  return (
    <MarketingPage>
      <PageHeader title="Get in touch">We read every message.</PageHeader>

      <section className="bg-mist px-5 py-12 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <ul className="space-y-3">
              {topics.map((t) => (
                <li key={t.subject}>
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}`}
                    className="flex min-h-[72px] items-center gap-4 rounded-2xl bg-white px-5 py-3 shadow-soft transition-shadow hover:shadow-pop"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac text-primary"><Mail size={20} aria-hidden /></span>
                    <span>
                      <span className="block font-display font-semibold">{t.title}</span>
                      <span className="block text-sm text-muted-foreground">{t.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-muted-foreground">Or write to <a className="font-semibold text-primary underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
            <WhatsAppLink className="mt-1 inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4" />
          </div>

          <div className="rounded-3xl bg-night p-6 text-white">
            <h2 className="font-display text-xl font-bold">Need help right now?</h2>
            <p className="mb-4 mt-1 text-white/70">Email isn&apos;t fast enough in a crisis. Call a free line.</p>
            <CrisisLines dark />
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
