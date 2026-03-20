'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { caseStudiesData } from '@/data/caseStudies';

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, ...style }}>{children}</div>
  );
}

export default function CaseStudies() {
  const [active, setActive] = useState(0);

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 75% 30%, rgba(139,74,60,0.2) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Impact Stories</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 660 }}>Real Students. Real Change. Documented.</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.85 }}>These case studies document the early impact of JaliMind across African campuses — measured honestly, reported clearly.</p>
        </div>
      </section>

      {/* STUDY SELECTOR */}
      <section style={{ background: 'var(--cream)', padding: '48px 5%', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {caseStudiesData.map(({ tag, title, color }, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '14px 24px', borderRadius: 10, border: `2px solid ${active === i ? color : 'var(--border)'}`,
              background: active === i ? `${color}10` : 'white',
              cursor: 'pointer', transition: 'all 0.3s', textAlign: 'left', fontFamily: 'var(--font-body)',
            }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: active === i ? color : 'var(--muted)', marginBottom: 4 }}>{tag}</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: active === i ? 'var(--charcoal)' : 'var(--charcoal-soft)' }}>{title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ACTIVE STUDY */}
      {caseStudiesData.map((study, i) => i !== active ? null : (
        <section key={i} style={{ background: 'var(--warm-white)', padding: '80px 5%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'start', marginBottom: 64 }}>
                <div>
                  <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: study.color, background: `${study.color}15`, padding: '4px 14px', borderRadius: 20, marginBottom: 20 }}>{study.tag}</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.25, marginBottom: 12 }}>{study.title}</h2>
                  <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>{study.subtitle}</p>
                  <p style={{ fontSize: 15, color: 'var(--charcoal-soft)', lineHeight: 1.9 }}>{study.summary}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {study.outcomes.map(({ metric, label }, j) => (
                    <div key={j} style={{ background: 'white', borderRadius: 12, padding: '24px 20px', border: `1px solid ${study.color}30`, textAlign: 'center' }}>
                      <div style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: study.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{metric}</div>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, marginBottom: 48 }}>
                {[{ label: 'The Challenge', text: study.challenge }, { label: 'Our Approach', text: study.approach }].map(({ label, text }, j) => (
                  <div key={j} style={{ background: 'white', borderRadius: 12, padding: '28px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 14 }}>{label}</h4>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.85 }}>{text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div style={{ background: `linear-gradient(135deg, ${study.color}15, ${study.color}30)`, borderRadius: 16, padding: '40px 48px', border: `1px solid ${study.color}30` }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic', color: 'var(--charcoal)', lineHeight: 1.75, marginBottom: 20 }}>"{study.quote}"</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: study.color, letterSpacing: 0.5 }}>— {study.quoteAuthor}</p>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ALL STUDIES LIST */}
      <section style={{ background: 'var(--cream)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--charcoal)' }}>All Case Studies</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {caseStudiesData.map(({ tag, title, subtitle, summary, color, thumbnail }, i) => (
              <Reveal key={i} delay={i * 80}>
                <div onClick={() => setActive(i)} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.35s', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; el.style.borderColor = color; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'hidden' }}>
                    <Image src={thumbnail} alt={title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '24px 24px 28px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color, display: 'block', marginBottom: 8 }}>{tag}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{subtitle}</p>
                  <p style={{ fontSize: 14, color: 'var(--charcoal-soft)', lineHeight: 1.7, marginBottom: 16 }}>{summary.substring(0, 140)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 600 }}>Read full study <ChevronRight size={14} /></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
