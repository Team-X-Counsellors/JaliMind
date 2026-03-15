'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, Users, Shield, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

const studies = [
  {
    tag: 'Academic Stress',
    icon: TrendingUp,
    title: 'Reducing Exam Anxiety at UNILAG',
    subtitle: 'University of Lagos · Nigeria · 2025',
    color: '#8B4A3C',
    summary: 'How JaliMind helped 120 students manage pre-examination anxiety through a structured 6-week support programme, leading to measurable improvements in academic performance and emotional wellbeing.',
    challenge: 'During the 2025 first semester, the University of Lagos guidance department reported a 60% increase in students seeking crisis support in the three weeks before examinations. Most students reported feeling that help came too late.',
    approach: 'JaliMind implemented a proactive 6-week "Exam Ready" programme — combining weekly group sessions with a JaliMind counsellor, daily AI check-ins, and a self-assessment tracker. 120 students enrolled voluntarily.',
    outcomes: [
      { metric: '78%', label: 'of students reported reduced anxiety levels by week 4' },
      { metric: '91%', label: 'completed all 6 sessions — far above typical retention rates' },
      { metric: '34%', label: 'average improvement in self-reported academic confidence' },
      { metric: '0', label: 'crisis escalations during the exam period for enrolled students' },
    ],
    quote: 'I came in expecting tips. I left with a completely different relationship with pressure. The AI check-ins between sessions made all the difference.',
    quoteAuthor: 'Participant, UNILAG 2025',
  },
  {
    tag: 'Peer Support',
    icon: Users,
    title: 'Community Forum Impact in Nairobi',
    subtitle: 'University of Nairobi · Kenya · 2025',
    color: '#4A6741',
    summary: 'Students at the University of Nairobi built peer support networks through the JaliMind community forum that led to a 40% increase in help-seeking behaviour and a significant reduction in reported loneliness.',
    challenge: 'Post-pandemic, many University of Nairobi students reported deep social isolation even after returning to in-person learning. Formal counselling waitlists were 3–4 weeks long. Students needed support faster.',
    approach: 'JaliMind launched its community forum at UoN with Swahili-language threads, moderated by two trained student peer supporters. The AI chatbot was integrated to suggest relevant threads and escalate concerning conversations.',
    outcomes: [
      { metric: '40%', label: 'increase in students actively seeking help, including formal counselling' },
      { metric: '860+', label: 'posts in the first 8 weeks — strong organic engagement' },
      { metric: '67%', label: 'of users said the forum made them feel less alone' },
      { metric: '23', label: 'students escalated to formal counselling via AI referral' },
    ],
    quote: 'Nilikuwa siamini mtu yeyote angeweza kunielewa. Forum ilionyesha kwamba si peke yangu.',
    quoteAuthor: 'Community Member, UoN 2025',
  },
  {
    tag: 'Anonymity & Trust',
    icon: Shield,
    title: 'Anonymous Sessions: Breaking the Stigma',
    subtitle: 'Multi-Campus Pilot · 2025',
    color: '#7A5A3C',
    summary: 'An analysis of how the anonymous session feature enabled first-time counselling access for students who would have otherwise disengaged — across three campuses in Nigeria, Kenya, and Ghana.',
    challenge: 'Survey data from 340 students showed that 68% had never sought counselling despite experiencing significant distress. The primary reason cited was fear of being seen, judged, or identified.',
    approach: 'JaliMind deployed anonymous sessions with zero-knowledge identity protection across UNILAG, UoN, and KNUST. Students could begin sessions with no name, no photo, and no university ID — just a randomly generated username.',
    outcomes: [
      { metric: '68%', label: 'of first-time users chose the anonymous option initially' },
      { metric: '44%', label: 'of anonymous users transitioned to named sessions after 2+ sessions' },
      { metric: '92%', label: 'said anonymity was the reason they felt safe enough to try' },
      { metric: '3x', label: 'more first-generation users vs. non-anonymous sessions' },
    ],
    quote: 'I would never have made that first session. Knowing no one could trace it to me was the only reason I clicked the button.',
    quoteAuthor: 'Anonymous Participant, KNUST 2025',
  },
];

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
          {studies.map(({ tag, title, color }, i) => (
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
      {studies.map((study, i) => i !== active ? null : (
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
            {studies.map(({ tag, title, subtitle, summary, color, icon: Icon }, i) => (
              <Reveal key={i} delay={i * 80}>
                <div onClick={() => setActive(i)} style={{ background: 'white', borderRadius: 12, padding: '28px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; el.style.borderColor = color; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = 'var(--border)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color, display: 'block', marginBottom: 8 }}>{tag}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 6 }}>{title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{subtitle}</p>
                  <p style={{ fontSize: 14, color: 'var(--charcoal-soft)', lineHeight: 1.7, marginBottom: 16 }}>{summary.substring(0, 140)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 600 }}>Read full study <ChevronRight size={14} /></div>
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
