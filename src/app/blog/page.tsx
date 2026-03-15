'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, ChevronRight, Search, ArrowRight } from 'lucide-react';
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

const posts = [
  { tag: 'Mental Health', title: 'Understanding Exam Anxiety and How to Manage It', excerpt: 'Exam season is one of the most mentally demanding periods for university students. Here is what the research says about exam anxiety and what actually works to manage it.', author: 'Dr. Amara Osei', date: 'January 2026', readTime: '5 min', featured: true, color: '#8B4A3C' },
  { tag: 'Platform', title: 'How Anonymous Counselling is Transforming African Campuses', excerpt: 'Anonymity is not a loophole — it is a lifeline. We explore why anonymous access to counselling is changing who gets help across Nigerian, Kenyan, and Ghanaian universities.', author: 'JaliMind Team', date: 'February 2026', readTime: '7 min', featured: false, color: '#4A6741' },
  { tag: 'Wellbeing', title: 'Building Emotional Resilience as a University Student', excerpt: 'Resilience is not the absence of struggle. It is the capacity to move through difficulty without losing yourself. Here are four evidence-based strategies to build it deliberately.', author: 'Mr. David Kamau', date: 'February 2026', readTime: '4 min', featured: false, color: '#C4956A' },
  { tag: 'Culture', title: 'Talking to African Parents About Mental Health: A Practical Guide', excerpt: 'The conversation is hard. But it is possible. Based on real experiences shared by students in our community, here is how to begin a mental health conversation at home.', author: 'Ms. Fatima Al-Hassan', date: 'January 2026', readTime: '6 min', featured: false, color: '#7A5A3C' },
  { tag: 'AI & Technology', title: 'What Our AI Chatbot Can and Cannot Do for Your Mental Health', excerpt: 'Artificial intelligence can play a meaningful supportive role in mental health — but it has real limits. We explain exactly what JaliMind\'s AI is designed to do and where it steps back.', author: 'JaliMind Team', date: 'December 2025', readTime: '8 min', featured: false, color: '#5A7A8A' },
  { tag: 'Relationships', title: 'Navigating Romantic Relationships at University Without Losing Yourself', excerpt: 'University relationships can be wonderful and overwhelming in equal measure. Here is how to build connections that add to your life rather than consuming it.', author: 'Ms. Ama Asante', date: 'December 2025', readTime: '5 min', featured: false, color: '#6B4A8A' },
  { tag: 'Academic Life', title: 'The Hidden Cost of People-Pleasing in Group Projects', excerpt: 'Always saying yes, never setting limits, doing others\' work to keep the peace — people-pleasing in academic settings has real mental health consequences. Let us talk about it.', author: 'Mr. David Kamau', date: 'November 2025', readTime: '4 min', featured: false, color: '#8B7355' },
];

const tags = ['All', 'Mental Health', 'Platform', 'Wellbeing', 'Culture', 'AI & Technology', 'Relationships', 'Academic Life'];

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [featured, ...rest] = posts;

  const filtered = rest.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 40% 60%, rgba(74,103,65,0.2) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>The JaliMind Blog</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 660, margin: '0 auto 24px' }}>Insights, Guidance, and Stories</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.85 }}>Mental health perspectives from our counsellors, researchers, and the students we serve.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '12px 20px', maxWidth: 420, margin: '0 auto' }}>
            <Search size={16} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', color: 'white', background: 'transparent', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      <section style={{ background: 'var(--cream)', padding: '72px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div style={{ height: 320, background: `linear-gradient(135deg, ${featured.color}50, ${featured.color}90)`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
                <div style={{ textAlign: 'center', color: 'white', opacity: 0.4 }}>
                  <div style={{ fontSize: 80 }}>&#9776;</div>
                </div>
              </div>
              <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'white', background: featured.color, padding: '3px 12px', borderRadius: 20 }}>Featured</span>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--terracotta)', background: 'rgba(139,74,60,0.1)', padding: '3px 12px', borderRadius: 20 }}>{featured.tag}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 700, color: 'var(--charcoal)', marginBottom: 16, lineHeight: 1.35 }}>{featured.title}</h2>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24 }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{featured.author[0]}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>{featured.author}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{featured.date} · {featured.readTime} read</p>
                    </div>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--terracotta)', color: 'white', border: 'none', padding: '11px 22px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
                  >Read Article <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TAG FILTER */}
      <section style={{ background: 'var(--cream)', padding: '0 5% 32px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'nowrap', minWidth: 'max-content' }}>
          {tags.map(t => (
            <button key={t} onClick={() => setActiveTag(t)} style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${activeTag === t ? 'var(--terracotta)' : 'var(--border)'}`,
              background: activeTag === t ? 'var(--terracotta)' : 'white',
              color: activeTag === t ? 'white' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>
      </section>

      {/* POSTS GRID */}
      <section style={{ background: 'var(--warm-white)', padding: '40px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}><p style={{ fontSize: 16 }}>No articles match your search.</p></div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
            {filtered.map((post, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                >
                  <div style={{ height: 160, background: `linear-gradient(135deg, ${post.color}30, ${post.color}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: post.color, opacity: 0.4 }}>&#9776;</span>
                  </div>
                  <div style={{ padding: '22px 22px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 10 }}>{post.tag}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 10, lineHeight: 1.4, flex: 1 }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>{post.excerpt.substring(0, 120)}...</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>{post.author}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <Clock size={11} style={{ color: 'var(--muted)' }} />
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.date} · {post.readTime}</span>
                        </div>
                      </div>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--terracotta)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Read <ChevronRight size={14} />
                      </button>
                    </div>
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
