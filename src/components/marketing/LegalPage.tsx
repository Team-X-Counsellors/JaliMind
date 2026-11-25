import MarketingPage, { PageHeader } from '@/components/marketing/MarketingPage';

export interface LegalSection { title: string; content: string }

/** Plain, readable layout for privacy / terms / accessibility. Numbered only when order matters. */
export default function LegalPage({
  title, updated, intro, sections, contact, numbered = false,
}: {
  title: string; updated: string; intro: string; sections: LegalSection[];
  contact: { label: string; email: string }; numbered?: boolean;
}) {
  return (
    <MarketingPage>
      <PageHeader title={title}>Last updated: {updated}</PageHeader>
      <article className="bg-mist px-5 py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="rounded-2xl bg-white p-5 text-lg shadow-soft">{intro}</p>
          {sections.map((s, i) => (
            <section key={s.title} className="mt-10">
              <h2 className="font-display text-xl font-bold md:text-2xl">{numbered ? `${i + 1}. ` : ''}{s.title}</h2>
              <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{s.content}</p>
            </section>
          ))}
          <div className="mt-12 rounded-2xl bg-lilac p-5">
            <p className="font-display font-semibold">{contact.label}</p>
            <a href={`mailto:${contact.email}`} className="mt-1 inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4">
              {contact.email}
            </a>
          </div>
        </div>
      </article>
    </MarketingPage>
  );
}
