'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Privacy() {
  const sections = [
    { title: 'Information We Collect', content: 'JaliMind collects only the minimum information necessary to provide our services. For anonymous sessions, we collect no personally identifiable information whatsoever. For named accounts, we collect your name, email address, and university affiliation. We do not collect sensitive medical or diagnostic information.' },
    { title: 'How We Use Your Information', content: 'Your information is used solely to provide and improve JaliMind services, match you with appropriate counsellors, and send you relevant platform updates. We do not use your data for advertising, and we do not sell, rent, or share your data with third parties under any circumstances.' },
    { title: 'Anonymity and Confidentiality', content: 'Anonymous sessions are completely separate from any identifiable accounts. Anonymous session data is encrypted end-to-end and cannot be linked to any individual by JaliMind staff, counsellors, or system administrators. Your university cannot access any session data — named or anonymous — under any circumstances.' },
    { title: 'Data Storage and Security', content: 'All data is stored on encrypted servers within Africa where possible. We employ industry-standard security practices including TLS encryption in transit, AES-256 encryption at rest, and strict access controls. Our systems are regularly audited by independent security professionals.' },
    { title: 'Data Retention', content: 'Named account data is retained for as long as your account is active and for up to 12 months after account deletion, for administrative purposes. Anonymous session data is retained for a maximum of 90 days for service improvement purposes, after which it is permanently deleted.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can request a copy of all data JaliMind holds about you. You can also request permanent deletion of your account and all associated data. To exercise these rights, contact privacy@jalimind.org.' },
    { title: 'Cookies', content: 'JaliMind uses only essential cookies required for the platform to function. We do not use tracking cookies, advertising cookies, or third-party analytics that share data with other companies. You can disable cookies in your browser, though this may affect some platform features.' },
    { title: 'Changes to This Policy', content: 'We will notify all registered users of material changes to this privacy policy via email, with at least 30 days notice before changes take effect. Your continued use of JaliMind after the effective date constitutes acceptance of the updated policy.' },
  ];

  return (
    <>
      <Navbar />

      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>Privacy Policy</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Last updated: January 2026</p>
        </div>
      </section>

      <section style={{ background: 'var(--warm-white)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 48, padding: '24px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)', borderLeft: '4px solid var(--terracotta)' }}>
            JaliMind is built on a foundation of trust. Your mental health journey is deeply personal, and we treat your data with the highest level of care, discretion, and respect. This policy explains exactly how we handle your information.
          </p>
          {sections.map(({ title, content }, i) => (
            <div key={i} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 16 }}>{i + 1}. {title}</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9 }}>{content}</p>
            </div>
          ))}
          <div style={{ marginTop: 48, padding: '24px 28px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 10 }}>Questions About This Policy</h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>If you have any questions about this privacy policy or how JaliMind handles your data, please contact our Data Protection Officer at <strong style={{ color: 'var(--terracotta)' }}>privacy@jalimind.org</strong>.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
