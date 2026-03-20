'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/counsellors', label: 'Counsellors' },
    { href: '/community', label: 'Community' },
    { href: '/resources', label: 'Resources' },
    { href: '/case-studies', label: 'Case Studies' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(253,250,246,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 5%',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 72,
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22, fontWeight: 700,
              color: scrolled ? 'var(--terracotta-dark)' : 'white',
              letterSpacing: '-0.3px',
              transition: 'color 0.4s',
            }}>JaliMind</span>
          </Link>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 500,
                color: scrolled ? 'var(--charcoal)' : 'rgba(255,255,255,0.9)',
                transition: 'color 0.3s',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--terracotta)')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? 'var(--charcoal)' : 'rgba(255,255,255,0.9)')}
              >{l.label}</Link>
            ))}
            <Link href="/contact" style={{
              background: 'var(--terracotta)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: 4,
              fontSize: 14, fontWeight: 600,
              transition: 'background 0.3s, transform 0.2s',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >Get Started</Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: scrolled ? 'var(--charcoal)' : 'white',
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hamburger"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: 72, left: 0, right: 0, zIndex: 99,
        background: 'var(--warm-white)',
        borderBottom: '1px solid var(--border)',
        transform: open ? 'translateY(0)' : 'translateY(-120%)',
        transition: 'transform 0.35s ease',
        padding: '20px 5%',
      }} className="mobile-menu">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: 15, fontWeight: 500, color: 'var(--charcoal)',
              minHeight: '44px',
            }}>
            {l.label}
          </Link>
        ))}
        <Link href="/contact" onClick={() => setOpen(false)} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          background: 'var(--terracotta)', color: 'white',
          padding: '16px 28px', borderRadius: 4,
          fontSize: 14, fontWeight: 600,
          minHeight: '48px',
        }}>Get Started</Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (max-width: 480px) {
          .hamburger { min-width: 48px; min-height: 48px; }
        }
      `}</style>
    </>
  );
}
