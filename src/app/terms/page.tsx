'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing or using JaliMind, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform. JaliMind reserves the right to update these terms with reasonable notice to users.' },
    { title: 'Eligibility', content: 'JaliMind services are intended for university students in higher education institutions across Africa, as well as licensed counsellors and institutional partners. Users must be at least 16 years of age. Users under 18 are encouraged to use the platform with the awareness of a trusted adult where possible.' },
    { title: 'Nature of Services', content: 'JaliMind provides a platform connecting students with counselling resources, AI-assisted support, and peer community features. JaliMind is not a medical provider, hospital, or emergency service. Our services are intended as a complement to — not a replacement for — in-person mental health care.' },
    { title: 'Emergency Situations', content: 'JaliMind services are not designed for crisis intervention. If you or someone else is in immediate danger, please contact your local emergency services immediately. JaliMind provides crisis line contact information on the platform, but we are not staffed to provide emergency response.' },
    { title: 'User Conduct', content: 'Users agree to engage with the JaliMind platform and community in good faith, with respect for other users. Prohibited conduct includes harassment, sharing of harmful content, impersonating other users or counsellors, attempting to extract personal information from other users, and misuse of anonymous session features.' },
    { title: 'Counsellor Standards', content: 'All counsellors on JaliMind are independently licensed professionals. JaliMind verifies credentials but does not directly employ counsellors. Users acknowledge that counselling sessions involve professional judgement that may differ from user expectations, and that counsellors may refer users to additional services at their discretion.' },
    { title: 'Intellectual Property', content: 'All content created by JaliMind — including articles, workbooks, platform design, and branding — is the property of JaliMind. User-generated content in the community forum remains the property of the user, but by posting, users grant JaliMind a non-exclusive licence to display and moderate that content.' },
    { title: 'Limitation of Liability', content: 'JaliMind provides its platform on an "as is" basis. To the extent permitted by law, JaliMind is not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to any user for any claim shall not exceed the amount paid by that user for services in the preceding 12 months.' },
  ];

  return (
    <>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4A2820 50%, #6B3228 100%)', padding: '160px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 56px)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>Terms of Service</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Last updated: January 2026</p>
        </div>
      </section>
      <section style={{ background: 'var(--warm-white)', padding: '80px 5%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 48, padding: '24px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)', borderLeft: '4px solid var(--terracotta)' }}>
            Please read these terms carefully before using JaliMind. By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          {sections.map(({ title, content }, i) => (
            <div key={i} style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 16 }}>{i + 1}. {title}</h2>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.9 }}>{content}</p>
            </div>
          ))}
          <div style={{ marginTop: 48, padding: '24px 28px', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 10 }}>Contact</h3>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8 }}>Questions about these terms? Contact us at <strong style={{ color: 'var(--terracotta)' }}>legal@jalimind.org</strong>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
