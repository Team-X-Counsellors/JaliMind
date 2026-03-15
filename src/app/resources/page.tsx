'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Download, BookOpen, Play, FileText, Search, Clock, ExternalLink } from 'lucide-react';

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

const categories = ['All', 'Anxiety & Stress', 'Depression', 'Academic Performance', 'Relationships', 'Identity', 'Self-Care', 'Crisis Support'];

const resources = [
  { type: 'article', title: 'Understanding Anxiety: A Guide for African University Students', category: 'Anxiety & Stress', readTime: '8 min', desc: 'A comprehensive overview of anxiety in academic settings, including African-specific cultural factors that influence how anxiety presents and how it is discussed.', color: '#8B4A3C' },
  { type: 'workbook', title: 'Exam Season Survival Workbook', category: 'Academic Performance', readTime: 'PDF · 24 pages', desc: 'Practical exercises, schedules, and self-check-ins to help you manage the emotional weight of examination periods without burning out.', color: '#4A6741' },
  { type: 'video', title: 'Breathing Techniques for Immediate Anxiety Relief', category: 'Anxiety & Stress', readTime: '12 min video', desc: 'A guided video session demonstrating four evidence-based breathing techniques you can use anywhere — in a lecture hall, a bathroom, or before an exam.', color: '#C4956A' },
  { type: 'article', title: 'When Sadness Becomes Depression: Knowing the Difference', category: 'Depression', readTime: '10 min', desc: 'An accessible, stigma-free explanation of how depression develops, what it feels like for students, and the first steps to take if you think you might be struggling.', color: '#7A5A3C' },
  { type: 'workbook', title: 'The Identity Workbook: Navigating Culture, Family & Self', category: 'Identity', readTime: 'PDF · 18 pages', desc: 'Specifically designed for African students who feel torn between family expectations, cultural identity, and their own emerging sense of self at university.', color: '#5A7A8A' },
  { type: 'article', title: 'Healthy Boundaries in Friendships and Romantic Relationships', category: 'Relationships', readTime: '6 min', desc: 'Practical guidance on recognising unhealthy relationship patterns and building the communication skills to set boundaries with care and confidence.', color: '#6B4A8A' },
  { type: 'video', title: 'A Guided Meditation for Student Overwhelm', category: 'Self-Care', readTime: '18 min video', desc: 'A guided body-scan meditation designed for students who feel overwhelmed — especially effective before sleep or during particularly difficult academic periods.', color: '#4A6741' },
  { type: 'article', title: 'Crisis Support: What to Do When You Are Not Okay', category: 'Crisis Support', readTime: '5 min', desc: 'A clear, calm guide covering exactly what to do and who to contact if you or a friend is experiencing a mental health crisis on campus.', color: '#D4403A' },
  { type: 'workbook', title: 'Sleep Hygiene for Students: A 7-Day Reset Plan', category: 'Self-Care', readTime: 'PDF · 12 pages', desc: 'Poor sleep dramatically worsens anxiety and depression. This seven-day workbook walks you through building sustainable sleep habits while managing a full student schedule.', color: '#8B7355' },
];

const typeIcon = { article: BookOpen, workbook: Download, video: Play };
const typeLabel = { article: 'Article', workbook: 'Workbook', video: 'Video' };
const typeColor = { article: '#4A6741', workbook: '#8B4A3C', video: '#C4956A' };

export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = resources.filter(r =>
    (activeCategory === 'All' || r.category === activeCategory) &&
    (search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 60%, rgba(74,103,65,0.25) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Resource Library</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 680 }}>Everything You Need to Understand and Support Your Mental Health</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.85, marginBottom: 32 }}>Articles, workbooks, and guided videos — curated for African university students.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '12px 20px', maxWidth: 480 }}>
            <Search size={16} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-body)', color: 'white', background: 'transparent', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section style={{ background: 'var(--cream)', padding: '32px 5%', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'nowrap', minWidth: 'max-content' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${activeCategory === cat ? 'var(--terracotta)' : 'var(--border)'}`,
              background: activeCategory === cat ? 'var(--terracotta)' : 'white',
              color: activeCategory === cat ? 'white' : 'var(--muted)',
              cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            }}>{cat}</button>
          ))}
        </div>
      </section>

      {/* RESOURCES GRID */}
      <section style={{ background: 'var(--warm-white)', padding: '72px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16 }}>No resources match your search. Try a different term or category.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map((r, i) => {
              const Icon = typeIcon[r.type as keyof typeof typeIcon];
              return (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.35s', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.09)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: 120, background: `linear-gradient(135deg, ${r.color}30, ${r.color}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <Icon size={40} style={{ color: r.color, opacity: 0.7 }} />
                      <div style={{ position: 'absolute', top: 12, left: 12, background: typeColor[r.type as keyof typeof typeColor], color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 12 }}>
                        {typeLabel[r.type as keyof typeof typeLabel]}
                      </div>
                    </div>
                    <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 8 }}>{r.category}</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 10, lineHeight: 1.4, flex: 1 }}>{r.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>{r.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 12 }}>
                          <Clock size={12} />{r.readTime}
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--terracotta)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {r.type === 'workbook' ? <><Download size={14} /> Download</> : r.type === 'video' ? <><Play size={14} /> Watch</> : <><ExternalLink size={14} /> Read</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
