'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Search, Pin, MessageCircle, Heart, Shield } from 'lucide-react';
import { communityCategoriesData, communityThreadsData } from '@/data/community';

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



export default function Community() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = communityThreadsData.filter(t =>
    (activeCategory === 'All' || t.category === activeCategory) &&
    (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(74,103,65,0.2) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Community</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 640 }}>You Are Not Alone. Join the Conversation.</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.85, marginBottom: 32 }}>A moderated, safe forum for African university students to share experiences, ask questions, and support one another.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '12px 20px', maxWidth: 480 }}>
            <Shield size={16} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>All posts are moderated. You may post anonymously at any time.</span>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--warm-white)', padding: '72px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>

          {/* SIDEBAR */}
          <div style={{ position: 'sticky', top: 92 }}>
            <button style={{ width: '100%', background: 'var(--terracotta)', color: 'white', border: 'none', padding: '13px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)', marginBottom: 28, transition: 'background 0.3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
            ><Plus size={16} /> Start a Thread</button>

            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Browse by Topic</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['All', ...communityCategoriesData.map(c => c.label)].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: 'none',
                  background: activeCategory === cat ? 'var(--terracotta)' : 'transparent',
                  color: activeCategory === cat ? 'white' : 'var(--charcoal-soft)',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => { if (activeCategory !== cat) (e.currentTarget as HTMLElement).style.background = 'var(--cream)'; }}
                onMouseLeave={e => { if (activeCategory !== cat) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >{cat}</button>
              ))}
            </div>

            <div style={{ marginTop: 32, background: 'var(--cream)', borderRadius: 12, padding: '20px', border: '1px solid var(--border)' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>Community Guidelines</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Be kind and respectful', 'No personal attacks or shaming', 'No sharing of private info', 'Report harmful content', 'Support, don\'t diagnose'].map((g, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>·</span>{g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* THREADS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', border: '1.5px solid var(--border)', borderRadius: 8, padding: '11px 16px', marginBottom: 24 }}>
              <Search size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search threads..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'transparent', width: '100%' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((thread, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ background: 'white', borderRadius: 12, padding: '24px', border: `1px solid ${thread.pinned ? 'var(--terracotta)' : 'var(--border)'}`, transition: 'all 0.3s', cursor: 'pointer' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      {thread.pinned && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--terracotta)', background: 'rgba(139,74,60,0.1)', padding: '3px 10px', borderRadius: 12 }}>
                          <Pin size={10} /> Pinned
                        </span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', background: 'var(--cream)', borderRadius: 12, color: 'var(--muted)', border: '1px solid var(--border)' }}>{thread.category}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>{thread.time}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8, lineHeight: 1.4 }}>{thread.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 14 }}>{thread.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{thread.author[0]}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>{thread.author}</span>
                          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>{thread.university}</span>
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MessageCircle size={13} /> {thread.replies}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Heart size={13} /> {thread.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
