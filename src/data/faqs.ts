export interface FAQ {
  q: string;
  a: string;
}

export const faqsData: FAQ[] = [
  {
    q: 'Is my information kept private?',
    a: 'Absolutely. JaliMind is built with privacy at its core. You can choose to engage fully anonymously. No personal data is shared with your institution or any third party.',
  },
  {
    q: 'Is JaliMind a replacement for campus counsellors?',
    a: 'No — JaliMind is designed to support and extend the reach of existing counselling departments, not replace them. We partner directly with universities.',
  },
  {
    q: 'What languages does the AI support?',
    a: 'Currently English and Swahili, with Igbo, Hausa, Twi, and French planned in our next release phase.',
  },
  {
    q: 'Is JaliMind free for students?',
    a: 'Access to core features is free for students at partner institutions. Premium features may be available through your university subscription.',
  },
];
