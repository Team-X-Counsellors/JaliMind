'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import {
  ArrowRight, CheckCircle, Users, MessageCircle, Shield,
  BookOpen, Star, ChevronDown, Award, Heart, Globe,
  Brain, Headphones, FileText, ChevronRight, Quote
} from 'lucide-react';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

const services = [
  { icon: MessageCircle, title: 'Online Counselling Sessions', desc: 'One-on-one confidential sessions with certified counsellors and psychologists, accessible from anywhere on campus.', href: '/services#counselling' },
  { icon: Brain, title: 'AI Chat Support', desc: 'An always-available AI companion providing immediate emotional support and coping strategies, available in multiple African languages.', href: '/services#ai-support' },
  { icon: Shield, title: 'Anonymous Sessions', desc: 'Seek help without fear. Our anonymous session option ensures your identity remains fully protected throughout your journey.', href: '/services#anonymous' },
  { icon: BookOpen, title: 'Resource Library', desc: 'A curated collection of articles, guides, and self-help materials covering mental health, academic pressure, and personal growth.', href: '/services#resources' },
  { icon: FileText, title: 'Self-Assessment Tools', desc: 'Structured tools to help you understand your mental health baseline and track progress over time.', href: '/services#assessment' },
  { icon: Users, title: 'Community Forum', desc: 'A moderated, safe space for students to connect, share experiences, and support one another across campuses.', href: '/community' },
];

const counsellors = [
  { name: 'Dr. Amara Osei', role: 'Clinical Psychologist', specialty: 'Academic Stress & Anxiety', country: 'Ghana', color: '#C4A882' },
  { name: 'Ms. Fatima Al-Hassan', role: 'Licensed Counsellor', specialty: 'Identity & Cultural Transitions', country: 'Nigeria', color: '#8B7355' },
  { name: 'Mr. David Kamau', role: 'Student Wellness Advisor', specialty: 'Depression & Resilience', country: 'Kenya', color: '#A09070' },
  { name: 'Dr. Nadia Bouali', role: 'Psychotherapist', specialty: 'Trauma & Recovery', country: 'Morocco', color: '#B89878' },
];

const testimonials = [
  { name: 'Chisom A.', university: 'University of Lagos', text: 'JaliMind helped me address my anxiety during exam season without anyone knowing. The anonymous option changed everything for me.' },
  { name: 'Aisha M.', university: 'University of Nairobi', text: 'I finally found a platform that understands the unique pressures African students face. The AI support in Swahili was incredible.' },
  { name: 'Kwame T.', university: 'KNUST, Ghana', text: 'The community forum connected me with students going through exactly what I was facing. I no longer feel alone in this.' },
];

const faqs = [
  { q: 'Is my information kept private?', a: 'Absolutely. JaliMind is built with privacy at its core. You can choose to engage fully anonymously. No personal data is shared with your institution or any third party.' },
  { q: 'Is JaliMind a replacement for campus counsellors?', a: 'No — JaliMind is designed to support and extend the reach of existing counselling departments, not replace them. We partner directly with universities.' },
  { q: 'What languages does the AI support?', a: 'Currently English and Swahili, with Igbo, Hausa, Twi, and French planned in our next release phase.' },
  { q: 'Is JaliMind free for students?', a: 'Access to core features is free for students at partner institutions. Premium features may be available through your university subscription.' },
];

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 35%, #6B3228 70%, #8B4A3C 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139,74,60,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74,103,65,0.2) 0%, transparent 40%)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #4A3020 0%, #6B4A38 50%, #8B6050 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.1)' }}>
              <Users size={80} /><p style={{ fontSize: 11, marginTop: 8, letterSpacing: 1, fontFamily: 'var(--font-body)' }}>HERO IMAGE PLACEHOLDER</p>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #2C1810 0%, transparent 60%)' }} />
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 5% 80px', position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ maxWidth: 580 }}>
            <div >
              <div />

            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(42px, 5.5vw, 68px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, animation: 'fadeInUp 0.9s ease 0.1s both' }}>
              Your Mind Matters.<br /><span style={{ color: '#C4956A' }}>Healing Starts</span><br />Here.
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, marginBottom: 36, animation: 'fadeInUp 0.9s ease 0.25s both', maxWidth: 480 }}>
              Confidential guidance and counselling designed for university students across Africa. Talk, learn, or find community — JaliMind is built for you.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeInUp 0.9s ease 0.4s both' }}>
              <Link href="/services" style={{ background: 'white', color: 'var(--terracotta-dark)', padding: '15px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
              >Explore Services <ArrowRight size={16} /></Link>
              <button onClick={() => setBookingOpen(true)} style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', color: 'white', padding: '15px 32px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'white'; el.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.4)'; el.style.background = 'transparent'; }}
              >Book a Session</button>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 48, animation: 'fadeInUp 0.9s ease 0.55s both', flexWrap: 'wrap' }}>
              {[{ val: '100%', label: 'Confidential' }, { val: 'Free', label: 'For Students' }, { val: '4+', label: 'Languages' }].map((s, i) => (
                <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.25)', paddingLeft: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#C4956A', fontFamily: 'var(--font-display)' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', animation: 'bounce 2s infinite' }}>
          <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
          <ChevronDown size={16} />
        </div>
        <style>{`
          @keyframes fadeInDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(8px);} }
          @media (max-width: 768px) {
            section > div > div:last-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ABOUT STRIP */}
      <section style={{ background: 'var(--cream)', padding: '96px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 72, alignItems: 'center' }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 16 }}>Who We Are</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.25, color: 'var(--charcoal)', marginBottom: 24 }}>Empowering Counsellors.<br />Supporting Students.</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 20 }}>JaliMind is not here to replace the vital work of campus counsellors and psychologists. We exist to amplify their impact — giving them better tools, and giving students better access.</p>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 32 }}>Built by a pan-African team who understand the unique pressures students in higher institutions face, JaliMind addresses the gap where 75% of young Africans with mental health needs go untreated.</p>
            <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--terracotta)', fontWeight: 600, fontSize: 15, borderBottom: '2px solid var(--terracotta)', paddingBottom: 2, transition: 'gap 0.3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = '14px'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = '8px'}
            >Learn more about our mission <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--sand) 0%, #D4C5B0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ textAlign: 'center', color: 'rgba(139,74,60,0.25)' }}><Users size={56} /><p style={{ fontSize: 11, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Team Photo</p></div>
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'white', borderRadius: 10, padding: '16px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={20} style={{ color: 'white' }} /></div>
                <div><p style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>WHO Recognised Gap</p><p style={{ fontSize: 12, color: 'var(--muted)' }}>75% of youth receive no mental health treatment</p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--terracotta)', padding: '72px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {[{ value: '75%', label: 'of African youth with mental health needs go untreated', icon: Heart }, { value: '4+', label: 'Universities targeted in our first phase rollout', icon: Award }, { value: '24/7', label: 'AI-powered support available around the clock', icon: Brain }, { value: '5', label: 'African countries in our expansion roadmap', icon: Globe }].map(({ value, label, icon: Icon }, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon size={24} style={{ color: 'white' }} /></div>
                <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 10, lineHeight: 1.6 }}>{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 12 }}>What We Offer</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--charcoal)', marginBottom: 16 }}>Services Designed for Student Life</h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>Every feature is built around what students actually need — not what fits a Western mental health template.</p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {services.map(({ icon: Icon, title, desc, href }, i) => (
              <Reveal key={i} delay={i * 80}>
                <Link href={href} style={{ display: 'block', background: 'var(--cream)', borderRadius: 12, padding: '32px 28px', border: '1px solid var(--border)', transition: 'all 0.35s', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'; el.style.borderColor = 'var(--terracotta)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon size={24} style={{ color: 'white' }} /></div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>{desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, color: 'var(--terracotta)', fontSize: 14, fontWeight: 600 }}>Learn more <ChevronRight size={16} /></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY JALIMIND */}
      <section style={{ background: 'var(--cream)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', background: 'linear-gradient(160deg, #4A3020 0%, #7A5040 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)' }}><Headphones size={56} /><p style={{ fontSize: 11, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Counselling Image</p></div>
              </div>
              <div style={{ position: 'absolute', top: 32, right: -20, background: 'var(--terracotta)', color: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 16px 40px rgba(139,74,60,0.35)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'var(--font-display)' }}>100%</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Confidential<br />Always</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 16 }}>Why JaliMind</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, lineHeight: 1.3, color: 'var(--charcoal)', marginBottom: 28 }}>Why Choose a Top African Counselling Platform?</h2>
            {[
              { title: 'Built for African Students', desc: 'We understand cultural context, academic systems, and the social pressures unique to university students across Africa.' },
              { title: 'Certified Professional Staff', desc: 'Every counsellor on JaliMind is verified, licensed, and trained in culturally sensitive mental health care.' },
              { title: 'Anonymous & Safe by Design', desc: 'Your privacy is non-negotiable. Access support without ever sharing identifying information.' },
              { title: 'WhatsApp Integration', desc: 'Access support through the platforms you already use — no new app to install.' },
            ].map(({ title, desc }, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}><CheckCircle size={14} style={{ color: 'white' }} /></div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--charcoal)', marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setBookingOpen(true)} style={{ marginTop: 16, background: 'var(--terracotta)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--terracotta-dark)'; el.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--terracotta)'; el.style.transform = 'translateY(0)'; }}
            >Book Free Consultation <ArrowRight size={16} /></button>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: 'var(--charcoal)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta-light)', display: 'block', marginBottom: 12 }}>Student Voices</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'white' }}>What Students Are Saying</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {testimonials.map(({ name, university, text }, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '32px 28px', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--terracotta)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <Quote size={28} style={{ color: 'var(--terracotta)', marginBottom: 20 }} />
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, marginBottom: 24 }}>{text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{name[0]}</span></div>
                    <div><p style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>{name}</p><p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{university}</p></div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: '#F5A623', fill: '#F5A623' }} />)}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COUNSELLORS */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 12 }}>Our Team</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--charcoal)' }}>Meet Our Counsellors</h2>
              </div>
              <Link href="/counsellors" style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--terracotta)', paddingBottom: 2 }}>View All <ArrowRight size={14} /></Link>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {counsellors.map(({ name, role, specialty, country, color }, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 220, background: `linear-gradient(160deg, ${color}40 0%, ${color}80 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>{name[0]}</span></div>
                  </div>
                  <div style={{ padding: '20px 20px 24px', background: 'var(--cream)' }}>
                    <span style={{ fontSize: 11, color: 'var(--terracotta)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{country}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', margin: '6px 0 4px' }}>{name}</h4>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{role}</p>
                    <p style={{ fontSize: 12, color: 'var(--terracotta)', fontWeight: 600 }}>{specialty}</p>
                    <button onClick={() => setBookingOpen(true)} style={{ marginTop: 16, width: '100%', background: 'none', border: '1.5px solid var(--terracotta)', color: 'var(--terracotta)', padding: '10px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--terracotta)'; el.style.color = 'white'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'none'; el.style.color = 'var(--terracotta)'; }}
                    >Book a Session</button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'linear-gradient(135deg, var(--terracotta-dark) 0%, var(--terracotta) 60%, var(--terracotta-light) 100%)', padding: '80px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23ffffff' fill-opacity='0.08'/%3E%3C/svg%3E")` }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white', marginBottom: 16 }}>Claim Your Free Consultation<br />and Begin Healing Today</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.8 }}>You deserve support. Take the first step — no commitment, no pressure, and completely confidential.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setBookingOpen(true)} style={{ background: 'white', color: 'var(--terracotta-dark)', border: 'none', padding: '16px 36px', borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
              >Book Free Consultation</button>
              <Link href="/services" style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white', padding: '16px 36px', borderRadius: 6, fontSize: 16, fontWeight: 600, transition: 'all 0.3s', display: 'inline-block' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >Explore Services</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ background: 'var(--cream)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
              <div><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 12 }}>Impact</span><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--charcoal)' }}>Explore Recent Case Studies</h2></div>
              <Link href="/case-studies" style={{ color: 'var(--terracotta)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--terracotta)', paddingBottom: 2 }}>View All <ArrowRight size={14} /></Link>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { title: 'Reducing Exam Anxiety at UNILAG', tag: 'Academic Stress', desc: 'How JaliMind helped 120 students manage pre-examination anxiety through a structured 6-week support programme.', color: '#8B4A3C' },
              { title: 'Community Forum Impact in Nairobi', tag: 'Peer Support', desc: 'Students at the University of Nairobi built peer support networks that led to a 40% increase in help-seeking behaviour.', color: '#4A6741' },
              { title: 'Anonymous Sessions: Breaking the Stigma', tag: 'Anonymity & Trust', desc: 'An analysis of how the anonymous session feature enabled first-time counselling access for students who would have otherwise disengaged.', color: '#7A5A3C' },
            ].map(({ title, tag, desc, color }, i) => (
              <Reveal key={i} delay={i * 100}>
                <Link href="/case-studies" style={{ display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 180, background: `linear-gradient(135deg, ${color}60, ${color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={40} style={{ color: 'white', opacity: 0.6 }} /></div>
                  <div style={{ padding: '24px 24px 28px', background: 'white' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--terracotta)' }}>{tag}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', margin: '10px 0 10px' }}>{title}</h4>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--terracotta)', fontSize: 13, fontWeight: 600 }}>Read case study <ChevronRight size={14} /></div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 80, alignItems: 'start' }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 16 }}>FAQ</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: 24 }}>Questions Students Often Ask</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>We believe transparency builds trust. Here are the questions we hear most from students before they take the first step.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--terracotta)', color: 'white', padding: '14px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, transition: 'background 0.3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
            >Ask Us Anything <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={100}>
            <div>
              {faqs.map(({ q, a }, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--charcoal)', paddingRight: 16 }}>{q}</span>
                    <ChevronDown size={18} style={{ color: 'var(--terracotta)', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                  </button>
                  <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.85, paddingBottom: 20 }}>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section style={{ background: 'var(--cream)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 64, alignItems: 'center' }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 16 }}>Get Started</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: 20 }}>Book an Appointment</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 24 }}>Schedule a session at your convenience. All counsellors are available in video, voice, or text format.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Choose your preferred counsellor or session type', 'Select a time that fits your schedule', 'Begin your confidential session'].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{i + 1}</span></div>
                  <p style={{ fontSize: 14, color: 'var(--charcoal)' }}>{step}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: 'white', borderRadius: 16, padding: '40px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>Request a Session</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Booking will be available soon. Leave your details to be notified at launch.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['Full Name', 'University / Institution', 'Email Address'].map(label => (
                  <div key={label}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>{label}</label>
                    <input type="text" placeholder={`Enter your ${label.toLowerCase()}`} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s' }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--terracotta)'}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}
                <button onClick={() => setBookingOpen(true)} style={{ background: 'var(--terracotta)', color: 'white', border: 'none', padding: '14px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8, transition: 'background 0.3s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
                >Book Appointment</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BLOG */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 12 }}>Insights</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--charcoal)' }}>Latest from the Blog</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {[
              { title: 'Understanding Exam Anxiety and How to Manage It', tag: 'Mental Health', date: 'January 2026', readTime: '5 min read' },
              { title: 'How Anonymous Counselling is Transforming African Campuses', tag: 'Platform', date: 'February 2026', readTime: '7 min read' },
              { title: 'Building Emotional Resilience as a University Student', tag: 'Wellbeing', date: 'February 2026', readTime: '4 min read' },
            ].map(({ title, tag, date, readTime }, i) => (
              <Reveal key={i} delay={i * 100}>
                <Link href="/blog" style={{ display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 180, background: `linear-gradient(135deg, var(--sand), var(--cream))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={36} style={{ color: 'var(--terracotta)', opacity: 0.5 }} /></div>
                  <div style={{ padding: '24px 24px 28px', background: 'white' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--terracotta)' }}>{tag}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', margin: '10px 0 12px', lineHeight: 1.4 }}>{title}</h4>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{date}</span>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{readTime}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid var(--terracotta)', color: 'var(--terracotta)', padding: '13px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, transition: 'all 0.3s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--terracotta)'; el.style.color = 'white'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--terracotta)'; }}
            >View All Articles <ArrowRight size={15} /></Link>
          </Reveal>
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ background: 'var(--sand)', padding: '56px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 32 }}>Targeting Partnerships With</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {['University of Lagos', 'University of Nairobi', 'KNUST Ghana', 'University of Cape Town', 'Makerere University'].map((name, i) => (
              <div key={i} style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 6, background: 'white', fontSize: 13, fontWeight: 600, color: 'var(--muted)', transition: 'all 0.3s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--terracotta)'; el.style.color = 'var(--terracotta)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--muted)'; }}
              >{name}</div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
