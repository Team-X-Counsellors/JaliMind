import LegalPage from '@/components/marketing/LegalPage';

export const metadata = { title: 'Terms | JaliMind' };

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

export default function Terms() {
  return (
    <LegalPage
      title="Terms of service"
      updated="November 2026"
      intro="Please read these terms before using JaliMind. By using the platform, you agree to them."
      sections={sections}
      numbered
      contact={{ label: 'Questions about these terms?', email: 'legal@jalimind.org' }}
    />
  );
}
