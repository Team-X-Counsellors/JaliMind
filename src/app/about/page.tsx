'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, Target, Eye, Heart, Globe, Users, CheckCircle } from 'lucide-react';

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, ...style }}>{children}</div>
  );
}

const team = [
  { name: 'Kosisochukwu Moronu', role: 'Product & Project Manager', country: 'Nigeria', color: '#8B4A3C', bio: 'Driving product vision and team coordination across JaliMind.' },
  { name: 'Joy Mwendi', role: 'Documentation & Research', country: 'Kenya', color: '#4A6741', bio: 'Leads research analysis and ensures every insight shapes the platform.' },
  { name: 'Florida Korir', role: 'Marketing & Regulatory', country: 'Kenya', color: '#C4A882', bio: 'Navigating compliance and communicating JaliMind\'s mission to the world.' },
  { name: 'Winnie', role: 'UI/UX & Frontend Development', country: 'Ghana', color: '#7A5A3C', bio: 'Designing beautiful, accessible interfaces that students actually want to use.' },
  { name: 'Paul', role: 'Full-Stack Development', country: 'Pan-African', color: '#5A7A8A', bio: 'Building the technical backbone that makes JaliMind reliable and scalable.' },
];

export default function About() {
  return (
    <>
      <Navbar />

      {/* PAGE HEADER */}
      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(139,74,60,0.2) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>About JaliMind</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 700 }}>We Are Not Replacing Counsellors. We Are Empowering Them.</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 560, lineHeight: 1.85 }}>JaliMind was born from a simple observation: millions of African university students need mental health support, but most never receive it.</p>
        </div>
      </section>

      {/* MISSION, VISION, VALUES */}
      <section style={{ background: 'var(--cream)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {[
            { icon: Target, title: 'Our Mission', color: 'var(--terracotta)', desc: 'To make mental health support accessible, confidential, and culturally relevant for every university student across Africa.' },
            { icon: Eye, title: 'Our Vision', color: 'var(--sage)', desc: 'A generation of African students equipped with the emotional resilience, self-awareness, and community support to thrive academically and personally.' },
            { icon: Heart, title: 'Our Values', color: '#C4956A', desc: 'Dignity, confidentiality, cultural inclusivity, collaboration with institutions, and evidence-based approaches to student wellness.' },
          ].map(({ icon: Icon, title, color, desc }, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: 'white', borderRadius: 16, padding: '40px 32px', border: '1px solid var(--border)', height: '100%' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Icon size={28} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 14 }}>{title}</h3>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.85 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 72, alignItems: 'center' }}>
          <Reveal>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 16 }}>Our Story</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: 24 }}>Built by Students, for Students</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 20 }}>JaliMind started as a project proposal by a small pan-African team — students and professionals from Nigeria, Kenya, and Ghana — who experienced firsthand how inaccessible mental health support can be on African campuses.</p>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 20 }}>The World Health Organization (2021) reports that approximately 75% of people with mental health conditions in Africa receive no treatment at all. University students are particularly vulnerable — navigating academic pressure, identity challenges, and limited financial resources simultaneously.</p>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 32 }}>JaliMind was built to change that. We began by gathering feedback from students through surveys, listening carefully, and building features that reflect real needs — starting with anonymity, because our research showed that fear of stigma is the primary barrier to seeking help.</p>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[{ val: '2025', label: 'Founded' }, { val: '5', label: 'Team Members' }, { val: '3', label: 'Countries' }].map(({ val, label }, i) => (
                <div key={i} style={{ borderLeft: '3px solid var(--terracotta)', paddingLeft: 16 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--terracotta)', fontFamily: 'var(--font-display)' }}>{val}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1/1', background: 'linear-gradient(135deg, var(--sand), #D4C5B0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ textAlign: 'center', color: 'rgba(139,74,60,0.25)' }}><Globe size={64} /><p style={{ fontSize: 11, marginTop: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Pan-Africa Map</p></div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, var(--terracotta) 0%, transparent 100%)', height: '50%', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
                <p style={{ color: 'white', fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>Nigeria · Kenya · Ghana<br /><span style={{ fontSize: 12, opacity: 0.8 }}>And growing across the continent</span></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ background: 'var(--cream)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 12 }}>The People</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'var(--charcoal)' }}>Meet the JaliMind Team</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {team.map(({ name, role, country, color, bio }, i) => (
              <Reveal key={i} delay={i * 80}>
                <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 160, background: `linear-gradient(160deg, ${color}30, ${color}60)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>{name[0]}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px 20px 24px' }}>
                    <span style={{ fontSize: 11, color: 'var(--terracotta)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{country}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', margin: '6px 0 4px' }}>{name}</h4>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{role}</p>
                    <p style={{ fontSize: 13, color: 'var(--charcoal-soft)', lineHeight: 1.7 }}>{bio}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS CTA */}
      <section style={{ background: 'var(--terracotta)', padding: '80px 5%', textAlign: 'center' }}>
        <Reveal>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: 'white', marginBottom: 16 }}>Partner With JaliMind</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.8 }}>We are seeking partnerships with universities that have active guidance and counselling departments. Let us build this together.</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--terracotta-dark)', padding: '15px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, transition: 'all 0.3s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
          >Get In Touch <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
