'use client';
import { X, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 0.25s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--warm-white)',
        borderRadius: 16,
        padding: 'clamp(32px, 5vw, 48px)',
        maxWidth: 480, width: '100%',
        textAlign: 'center',
        position: 'relative',
        animation: 'slideUp 0.3s ease',
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close modal" style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)',
          width: 44, height: 44, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
          minWidth: '44px',
          minHeight: '44px',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--sand)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
        ><X size={18} /></button>

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--sand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Clock size={32} style={{ color: 'var(--terracotta)' }} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28, fontWeight: 700,
          color: 'var(--charcoal)',
          marginBottom: 12,
        }}>Appointment Booking</h2>

        <div style={{
          display: 'inline-block',
          background: 'var(--terracotta)',
          color: 'white',
          fontSize: 11, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          padding: '4px 14px', borderRadius: 20,
          marginBottom: 20,
        }}>Coming Soon</div>

        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
          Our online appointment booking system is currently under development. In the meantime, please reach out to us directly to schedule your first session.
        </p>

        <div style={{
          background: 'var(--cream)',
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Contact us directly:</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--terracotta)' }}>hello@jalimind.org</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--terracotta)' }}>+254 700 000 000</p>
        </div>

        <button onClick={onClose} style={{
          width: '100%',
          background: 'var(--terracotta)',
          color: 'white',
          border: 'none',
          padding: '16px 32px',
          borderRadius: 6,
          fontSize: 15, fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.3s',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta-dark)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--terracotta)'}
        >Got it, Close</button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
