'use client';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import Link from 'next/link';
import { ArrowRight, Smartphone, Globe, Headphones } from 'lucide-react';
import { servicesData } from '@/data/services';

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

export default function Services() {
  const [bookingOpen, setBookingOpen] = useState(false);
  return (
    <>
      <Navbar />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(74,103,65,0.2) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>What We Offer</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 720, margin: '0 auto 24px' }}>Services Designed Around Real Student Needs</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto', lineHeight: 1.85 }}>Every feature was shaped by direct feedback from African university students. Not assumptions — evidence.</p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 64 }}>
          {servicesData.map(({ id, tag, title, desc, features, color, image }, i) => (
            <Reveal key={id} delay={i * 50}>
              <div id={id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center', paddingBottom: 64, borderBottom: '1px solid var(--border)' }}>
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color, display: 'block', marginBottom: 12 }}>{tag}</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 700, color: 'var(--charcoal)', marginBottom: 18, lineHeight: 1.3 }}>{title}</h2>
                  <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 28 }}>{desc}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                        </div>
                        <span style={{ fontSize: 14, color: 'var(--charcoal-soft)', lineHeight: 1.6 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setBookingOpen(true)} style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, background: color, color: 'white', border: 'none', padding: '13px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >Get Started <ArrowRight size={15} /></button>
                </div>
                <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                  <div style={{ borderRadius: 16, aspectRatio: '4/3', position: 'relative', overflow: 'hidden', border: `1px solid ${color}30` }}>
                    <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ADDITIONAL: WHATSAPP + MULTILINGUAL */}
      <section style={{ background: 'var(--cream)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
          {[
            { icon: Smartphone, title: 'WhatsApp Integration', desc: 'Connect with JaliMind directly through WhatsApp — no new app needed. Start a session, access resources, or reach crisis support right from where you already chat.', color: '#25D366' },
            { icon: Globe, title: 'Multilingual Support', desc: 'JaliMind is being built to speak your language — literally. English and Swahili are live, with Igbo, Hausa, Twi, and French in development.', color: 'var(--terracotta)' },
            { icon: Headphones, title: '24/7 Crisis Line', desc: 'Mental health crises do not follow office hours. Our crisis support line is always available, connecting you to a trained professional immediately.', color: '#D4403A' },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{ background: 'white', borderRadius: 12, padding: '32px 28px', border: '1px solid var(--border)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
