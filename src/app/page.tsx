import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronDown, MessageCircle, Video, Bot, Building2, BookOpen, Users } from 'lucide-react';
import MarketingPage from '@/components/marketing/MarketingPage';
import CrisisLines from '@/components/marketing/CrisisLines';
import WhatsAppLink from '@/components/marketing/WhatsAppLink';
import { Button } from '@/components/ui/button';
import { counsellorsData } from '@/data/counsellors';
import { faqsData } from '@/data/faqs';
import { getHeroAsset } from '@/data/heroAssets';
import { teamData } from '@/data/team';
import Reveal from '@/components/Reveal';
import styles from './page.module.css';

const checkIns = [
  { name: 'Mood', tool: 'PHQ-9', q: '9 questions' },
  { name: 'Anxiety', tool: 'GAD-7', q: '7 questions' },
  { name: 'Wellbeing', tool: 'WHO-5', q: '5 questions' },
];

const alsoInside = [
  { icon: Building2, title: 'Campus referrals', text: 'Find your guidance office, advisor or clinic and ask in one tap.' },
  { icon: BookOpen, title: 'Resource library', text: 'Short reads on stress, sleep and anxiety.' },
  { icon: Users, title: 'Jali Circle', text: 'Peer support from other students.' },
];

export default function Home() {
  const team = counsellorsData.slice(0, 4);
  const why = getHeroAsset('hero-counselling');

  return (
    <MarketingPage>
      {/* HERO: the action first, then proof of what it feels like */}
      <section className="overflow-hidden bg-night text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-9 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:pb-24 md:pt-16">
          <div>
            <h1 className="text-balance font-display text-[2.7rem] font-bold leading-[1.05] md:text-6xl">
              Talk to someone who gets it.
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/75">
              Free, private support for African university students. No account needed.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="lg"><Link href="/talk">Talk to someone now</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:border-white hover:text-white">
                <Link href="/auth/register">Book a counsellor</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/60">Anonymous. A real counsellor replies.</p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[1.75rem] bg-white p-5 text-night shadow-pop" aria-label="Example of an anonymous chat">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-lagoon" aria-hidden />
              <span className="text-sm font-semibold">BraveBaobab_4821</span>
              <span className="ml-auto text-xs text-muted-foreground">Anonymous</span>
            </div>
            <div className="space-y-3 text-[15px]">
              <p className={`${styles.bubble} ${styles.b1} ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-white`}>
                Exams start Monday and I can&apos;t sleep.
              </p>
              <p className={`${styles.typing} w-fit rounded-2xl bg-lilac px-4 py-3 text-primary`} aria-hidden>
                <span /><span /><span />
              </p>
              <p className={`${styles.bubble} ${styles.b2} max-w-[85%] rounded-2xl rounded-bl-md bg-lilac px-4 py-2.5`}>
                That sounds heavy. What worries you most?
              </p>
              <p className={`${styles.bubble} ${styles.b3} ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-white`}>
                That I&apos;ll let my family down.
              </p>
              <p className={`${styles.bubble} ${styles.b4} max-w-[85%] rounded-2xl rounded-bl-md bg-lilac px-4 py-2.5`}>
                Thank you for telling me. Let&apos;s take it one step at a time.
              </p>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Example conversation. Wipe your chat any time.</p>
          </div>
        </div>
      </section>

      {/* HOW TO TALK: one big, two small */}
      <section className="bg-mist px-5 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-md text-balance font-display text-3xl font-bold md:text-4xl">Choose how you want to talk</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <Link href="/talk" className="group flex flex-col justify-between rounded-[1.75rem] bg-indigo p-7 text-white shadow-pop md:col-span-3 md:row-span-2 md:p-9">
              <div>
                <MessageCircle size={32} className="text-marigold" aria-hidden />
                <h3 className="mt-5 font-display text-3xl font-bold">Chat anonymously</h3>
                <p className="mt-2 max-w-sm text-lg text-white/80">No account. A real counsellor replies. Delete it all when you&apos;re done.</p>
              </div>
              <span className="mt-8 inline-flex min-h-[48px] w-fit items-center rounded-full bg-white px-6 font-semibold text-indigo transition-transform group-hover:scale-[1.03]">
                Start a chat
              </span>
            </Link>
            <Link href="/auth/register" className="rounded-[1.75rem] bg-white p-6 shadow-soft transition-shadow hover:shadow-pop md:col-span-2">
              <Video size={26} className="text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-xl font-bold">Book a session</h3>
              <p className="mt-1 text-muted-foreground">Video, voice or text. Pick a time.</p>
            </Link>
            <Link href="/auth/register" className="rounded-[1.75rem] bg-white p-6 shadow-soft transition-shadow hover:shadow-pop md:col-span-2">
              <Bot size={26} className="text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-xl font-bold">Ask JaliBot</h3>
              <p className="mt-1 text-muted-foreground">A quick AI chat, any hour. Short answers.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CHECK-INS */}
      <section className="bg-lilac px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-14">
          <div>
            <h2 className="text-balance font-display text-3xl font-bold md:text-4xl">Check in with yourself</h2>
            <p className="mt-3 max-w-md text-lg text-muted-foreground">Two minutes. Private. See how you change over time.</p>
            <Button asChild variant="default" size="lg" className="mt-6"><Link href="/auth/register">Take a check-in</Link></Button>
          </div>
          <ul className="space-y-3">
            {checkIns.map((c) => (
              <li key={c.tool} className="flex min-h-[64px] items-center gap-4 rounded-2xl bg-white px-5 py-3 shadow-soft">
                <span className="h-3 w-3 rounded-full bg-lagoon" aria-hidden />
                <span className="font-display text-lg font-semibold">{c.name}</span>
                <span className="ml-auto text-sm text-muted-foreground">{c.tool} · {c.q}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COUNSELLORS */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Meet the counsellors</h2>
              <p className="mt-2 text-muted-foreground">Example profiles from our pilot.</p>
            </div>
            <Link href="/counsellors" className="hidden min-h-[44px] items-center font-semibold text-primary underline underline-offset-4 sm:flex">See all</Link>
          </div>
        </div>
        <ul className="scrollbar-none mx-auto mt-8 flex max-w-6xl snap-x gap-4 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {team.map((c) => (
            <li key={c.name} className="w-[68vw] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-mist md:w-auto md:max-w-none">
              <div className="relative aspect-[4/5]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width: 768px) 68vw, 25vw" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold leading-tight">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.role}</p>
                <p className="mt-1 text-sm font-medium text-primary">{c.specialty}</p>
                <Link href="/auth/register" className="mt-3 flex min-h-[44px] items-center justify-center rounded-full border-2 border-primary text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
                  Book a session
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 px-5 text-center sm:hidden">
          <Link href="/counsellors" className="inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4">See all counsellors</Link>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-mist px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
          {why && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-pop">
              <Image src={why.src} alt={why.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          )}
          <div>
            <h2 className="text-balance font-display text-3xl font-bold md:text-4xl">Built for how students live</h2>
            <ul className="mt-6 space-y-4">
              {[
                'Made for African university students',
                'Private by design. We never share chats with your university.',
                'Crisis lines for Kenya, Nigeria, Ghana and South Africa',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-lg">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lagoon text-white"><Check size={14} aria-hidden /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ALSO INSIDE */}
      <section className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Also inside</h2>
          <ul className="mt-6 divide-y divide-border">
            {alsoInside.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4 py-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac text-primary"><Icon size={22} aria-hidden /></span>
                <div>
                  <p className="font-display text-lg font-semibold">{title}</p>
                  <p className="text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <WhatsAppLink className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4" />
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">The team behind JaliMind</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Students and builders from across Africa, making support easier to reach.</p>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {teamData.map((m, i) => (
              <Reveal key={m.name} delay={i * 90}>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-lilac">
                  <Image src={m.image} alt={m.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                </div>
                <p className="mt-3 font-display font-semibold leading-tight">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                <p className="text-sm text-muted-foreground">{m.country}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-lilac px-5 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Quick answers</h2>
          <div className="mt-6 space-y-3">
            {faqsData.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl bg-white px-5 shadow-soft">
                <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown size={20} className="shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-5 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING: crisis lines + the one action */}
      <section className="bg-night px-5 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <h2 className="text-balance font-display text-3xl font-bold md:text-5xl">Not okay right now?</h2>
            <p className="mt-3 max-w-md text-lg text-white/75">You don&apos;t have to explain yourself. Just start.</p>
            <Button asChild variant="cta" size="lg" className="mt-6"><Link href="/talk">Talk to someone now</Link></Button>
          </div>
          <div>
            <p className="mb-3 font-semibold">In danger? Call a free line:</p>
            <CrisisLines dark />
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
