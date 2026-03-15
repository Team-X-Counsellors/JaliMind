'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Accessibility() {
  return (
    <>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Commitment</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>Accessibility Statement</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Last updated: January 2026</p>
        </div>
      </section>
      <section style={{ background: 'var(--warm-white)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 48, padding: '24px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)', borderLeft: '4px solid var(--sage)' }}>
            JaliMind is committed to ensuring that our platform is accessible to all students, including those with disabilities. Accessibility is not an afterthought — it is built into our design process from the start.
          </p>
          {[
            { title: 'Our Standards', content: 'JaliMind aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible to people with disabilities, and we use them as our benchmark.' },
            { title: 'What We Are Doing', content: 'We design all JaliMind interfaces with colour contrast ratios that meet or exceed WCAG AA standards. All images include descriptive alternative text. Our platform is navigable by keyboard alone, and we test screen reader compatibility with NVDA, VoiceOver, and TalkBack. Form inputs are clearly labelled, and error messages are descriptive.' },
            { title: 'Low Bandwidth Accessibility', content: 'Understanding that many African university students access JaliMind on slower connections and older devices, we have optimised our platform to load efficiently on 3G connections and function well on low-specification devices.' },
            { title: 'Language Accessibility', content: 'We are actively developing multilingual support to ensure students can access services in their first language. Swahili is currently live, with Igbo, Hausa, Twi, and French in development. We prioritise clarity and plain language in all written content.' },
            { title: 'Known Limitations', content: 'We are aware that some features of our community forum, including rich text formatting options, may present accessibility challenges for certain screen readers. We are actively working on improvements to these areas.' },
            { title: 'Feedback and Assistance', content: 'If you encounter any accessibility barriers while using JaliMind, or if you require information in an alternative format, please contact us. We are committed to responding to accessibility feedback within 5 working days.' },
          ].map(({ title, content }, i) => (
            <div key={i} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 14 }}>{title}</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9 }}>{content}</p>
            </div>
          ))}
          <div style={{ marginTop: 48, padding: '24px 28px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 10 }}>Report an Accessibility Issue</h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>Contact our accessibility team at <strong style={{ color: 'var(--terracotta)' }}>access@jalimind.org</strong> or use our contact form.</p>
            <Link href="/contact" style={{ display: 'inline-block', background: 'var(--terracotta)', color: 'white', padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600, transition: 'background 0.3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
            >Contact Us</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
