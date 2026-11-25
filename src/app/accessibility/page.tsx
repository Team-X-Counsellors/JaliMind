import LegalPage from '@/components/marketing/LegalPage';

export const metadata = { title: 'Accessibility | JaliMind' };

// Only commitments we can stand behind today. Update as testing is done.
const sections = [
  { title: 'Our goal', content: 'We aim to meet WCAG 2.1 Level AA. We are still testing, and we have not yet had an independent audit.' },
  { title: 'What we do', content: 'Text and buttons use strong colour contrast. Form fields have labels. Tap targets are large for phones. You can use the main pages with a keyboard. We respect your device setting for reduced motion.' },
  { title: 'Low data and older phones', content: 'Pages are built to stay light so they work on slower connections. Tell us if something loads too slowly for you.' },
  { title: 'Languages', content: 'The site is in English. JaliBot replies in English, Swahili, French, Hausa, Igbo or Twi, in the language you write. Counsellor profiles list the languages they speak.' },
  { title: 'Known gaps', content: 'We have not yet tested every page with screen readers, and the video call screen needs more testing. We are working on both.' },
  { title: 'Tell us', content: 'If something blocks you, or you need information in another format, email us. We aim to reply within 5 working days.' },
];

export default function Accessibility() {
  return (
    <LegalPage
      title="Accessibility"
      updated="November 2026"
      intro="Everyone should be able to get help here. This is where we are and what we are still fixing."
      sections={sections}
      contact={{ label: 'Report an accessibility problem', email: 'access@jalimind.org' }}
    />
  );
}
