'use client';
import { useRef, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageCircle, Building, Users } from 'lucide-react';

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

export default function Contact() {
  const [formType, setFormType] = useState<'student' | 'institution' | 'media'>('student');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', university: '', message: '', subject: '' });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 40%, rgba(74,103,65,0.2) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Get In Touch</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24, maxWidth: 600 }}>We Would Love to Hear From You</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.85 }}>Whether you are a student seeking help, a university looking to partner, or a journalist covering mental health — we are here.</p>
        </div>
      </section>

      <section style={{ background: 'var(--warm-white)', padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 72, alignItems: 'start' }}>

          {/* LEFT */}
          <Reveal>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 32 }}>Contact Information</h2>
            {[
              { icon: Mail, label: 'General Enquiries', value: 'hello@jalimind.org' },
              { icon: Mail, label: 'University Partnerships', value: 'partners@jalimind.org' },
              { icon: Phone, label: 'Student Support Line', value: '+254 700 000 000' },
              { icon: Phone, label: '24/7 Crisis Line', value: '+254 722 178 177' },
              { icon: MapPin, label: 'Registered Office', value: 'Nairobi, Kenya & Lagos, Nigeria' },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '18px 20px', background: 'var(--cream)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--charcoal)' }}>{value}</p>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, background: 'var(--terracotta)', borderRadius: 12, padding: '24px 28px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Crisis Support</p>
              <p style={{ fontSize: 15, color: 'white', lineHeight: 1.7 }}>If you or someone you know is in immediate danger, please contact emergency services. JaliMind crisis support is available 24/7.</p>
            </div>
          </Reveal>

          {/* FORM */}
          <Reveal delay={120}>
            <div style={{ background: 'white', borderRadius: 20, padding: '40px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>Send Us a Message</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>We typically respond within 24 hours on working days.</p>

              {/* ENQUIRY TYPE */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 28, padding: '6px', background: 'var(--cream)', borderRadius: 10 }}>
                {[
                  { key: 'student', label: 'Student', icon: Users },
                  { key: 'institution', label: 'Institution', icon: Building },
                  { key: 'media', label: 'Media', icon: MessageCircle },
                ].map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setFormType(key as any)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 7, border: 'none',
                    background: formType === key ? 'white' : 'transparent',
                    boxShadow: formType === key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    color: formType === key ? 'var(--terracotta)' : 'var(--muted)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.25s',
                    fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Icon size={14} />{label}
                  </button>
                ))}
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,103,65,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Send size={28} style={{ color: 'var(--sage)' }} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 12 }}>Message Sent</h4>
                  <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75 }}>Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', university: '', message: '', subject: '' }); }} style={{ marginTop: 24, background: 'none', border: '1.5px solid var(--border)', color: 'var(--charcoal)', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Send Another Message</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                    { key: 'email', label: 'Email Address', placeholder: 'your@email.com', type: 'email' },
                    ...(formType !== 'media' ? [{ key: 'university', label: 'University / Organisation', placeholder: 'Your institution', type: 'text' }] : [{ key: 'subject', label: 'Subject', placeholder: 'What is this regarding?', type: 'text' }]),
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>{label}</label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none', transition: 'border-color 0.3s' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="How can we help you?"
                      rows={5}
                      style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none', resize: 'vertical', transition: 'border-color 0.3s' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--terracotta)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                  <button onClick={handleSubmit} style={{ background: 'var(--terracotta)', color: 'white', border: 'none', padding: '15px', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'var(--font-body)', transition: 'background 0.3s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
                  ><Send size={16} /> Send Message</button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
