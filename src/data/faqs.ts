export interface FAQ {
  q: string;
  a: string;
}

export const faqsData: FAQ[] = [
  {
    q: 'Is it really private?',
    a: 'Anonymous chat needs no account, and you can wipe the chat at any time. We never share your chats with your university.',
  },
  {
    q: 'Who replies in anonymous chat?',
    a: 'A real counsellor, not a bot. If you write about harming yourself, your chat moves to the front of the queue.',
  },
  {
    q: 'Does it replace my campus counsellor?',
    a: 'No. JaliMind adds to campus support. We can point you to the right office on your campus.',
  },
  {
    q: 'Which languages work?',
    a: 'JaliBot replies in the language you write: English, Swahili, French, Hausa, Igbo or Twi. Counsellor profiles list the languages they speak.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, for students. No card needed.',
  },
];
