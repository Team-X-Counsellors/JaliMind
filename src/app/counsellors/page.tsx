'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import Image from 'next/image';
import { Star, Filter, Search, MapPin, Award } from 'lucide-react';
import { counsellorsData } from '@/data/counsellors';

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

export default function Counsellors() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const specialties = ['All', 'Anxiety', 'Depression', 'Trauma', 'Identity', 'Relationships', 'Career'];
  const filtered = counsellorsData.filter(c =>
    (filter === 'All' || c.specialty.toLowerCase().includes(filter.toLowerCase())) &&
    (search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(139,74,60,0.25) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Our Team</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 640 }}>Meet the Professionals Behind JaliMind</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.85 }}>Every counsellor is verified, licensed, and trained to provide culturally sensitive care to African university students.</p>
        </div>
      </section>

      {/* FILTERS */}
      <section style={{ background: 'var(--cream)', padding: '40px 5%', borderBottom: '1px solid var(--border)', position: 'sticky', top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {specialties.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${filter === s ? 'var(--terracotta)' : 'var(--border)'}`,
                background: filter === s ? 'var(--terracotta)' : 'white',
                color: filter === s ? 'white' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-body)',
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1.5px solid var(--border)', borderRadius: 8, padding: '10px 16px', minWidth: 240 }}>
            <Search size={16} style={{ color: 'var(--muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search counsellors..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'transparent', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* COUNSELLORS GRID */}
      <section style={{ background: 'var(--warm-white)', padding: '72px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16 }}>No counsellors match your search. Try different filters.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {filtered.map(({ name, role, specialty, country, color, years, rating, languages, sessions, bio, image }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', height: 300, width: '100%', overflow: 'hidden' }}>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <div style={{ padding: '20px 24px 24px' }}>
                    <span style={{ fontSize: 11, color: 'var(--terracotta)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{specialty}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--charcoal)', margin: '6px 0 2px' }}>{name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{role} · {years} years experience</p>
                    <p style={{ fontSize: 14, color: 'var(--charcoal-soft)', lineHeight: 1.75, marginBottom: 16 }}>{bio}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                      {languages.map(l => (
                        <span key={l} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: 'var(--cream)', borderRadius: 12, color: 'var(--charcoal-soft)', border: '1px solid var(--border)' }}>{l}</span>
                      ))}
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: `${color}15`, borderRadius: 12, color, border: `1px solid ${color}40` }}>
                        <Award size={10} style={{ display: 'inline', marginRight: 3 }} />Verified
                      </span>
                    </div>
                    <button onClick={() => setBookingOpen(true)} style={{ width: '100%', background: 'var(--terracotta)', color: 'white', border: 'none', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
                    >Book a Session</button>
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
