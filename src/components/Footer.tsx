import Link from 'next/link';
import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--charcoal)', color: 'white', paddingTop: 72 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(32px, 5vw, 48px)',
          paddingBottom: 'clamp(40px, 5vw, 56px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'var(--terracotta)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.3"/>
                  <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2z" fill="white"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'white' }}>JaliMind</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 24 }}>
              Empowering university students across Africa with accessible, confidential guidance and mental health support.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" aria-label={['Twitter', 'LinkedIn', 'Instagram', 'Facebook'][i]} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'all 0.3s',
                  minWidth: '44px',
                  minHeight: '44px',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--terracotta)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                ><Icon size={15} /></a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontFamily: 'var(--font-body)' }}>Quick Links</h4>
            {[
              { href: '/about', label: 'About JaliMind' },
              { href: '/services', label: 'Our Services' },
              { href: '/counsellors', label: 'Meet Counsellors' },
              { href: '/community', label: 'Community Forum' },
              { href: '/case-studies', label: 'Case Studies' },
              { href: '/blog', label: 'Blog' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 14,
                marginBottom: 16, transition: 'color 0.3s',
                minHeight: '44px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta-light)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >{l.label}</Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontFamily: 'var(--font-body)' }}>Services</h4>
            {[
              { href: '/services#counselling', label: 'Online Counselling' },
              { href: '/services#ai-support', label: 'AI Chat Support' },
              { href: '/services#anonymous', label: 'Anonymous Sessions' },
              { href: '/services#resources', label: 'Resource Library' },
              { href: '/services#assessment', label: 'Self-Assessment Tools' },
              { href: '/services#referral', label: 'Referral System' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 14,
                marginBottom: 16, transition: 'color 0.3s',
                minHeight: '44px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta-light)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 20, fontFamily: 'var(--font-body)' }}>Contact</h4>
            {[
              { icon: Mail, text: 'hello@jalimind.org' },
              { icon: Phone, text: '+254 700 000 000' },
              { icon: MapPin, text: 'Nairobi, Kenya & Lagos, Nigeria' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                <Icon size={16} style={{ color: 'var(--terracotta-light)', marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Crisis Support — Available 24/7</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--terracotta-light)' }}>+254 722 178 177</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '28px 0',
          flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            &copy; {new Date().getFullYear()} JaliMind. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 24px)' }}>
            {['/privacy', '/terms', '/accessibility'].map((href, i) => (
              <Link key={i} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s', minHeight: '44px', display: 'flex', alignItems: 'center', padding: '0 8px' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >{['Privacy Policy', 'Terms of Service', 'Accessibility'][i]}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
