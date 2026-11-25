import { LucideIcon, MessageCircle, Brain, Shield, BookOpen, FileText, Users } from 'lucide-react';

// Copy here may only describe features that exist in the product today.
export interface Service {
  id: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
  features: string[];
  color: string;
  image: string;
}

export const servicesData: Service[] = [
  {
    id: 'anonymous',
    icon: Shield,
    tag: 'No account needed',
    title: 'Chat anonymously',
    desc: 'A real counsellor replies. You stay a random nickname. Wipe the chat whenever you like.',
    features: ['No name or email', 'Urgent chats go to the front', 'Delete everything in one tap'],
    color: '#8B4A3C',
    image: '/images/services/anonSession.jpg',
  },
  {
    id: 'counselling',
    icon: MessageCircle,
    tag: 'Video, voice or text',
    title: 'Book a counsellor',
    desc: 'Pick a time that fits your timetable. Join the call right here, with no extra app.',
    features: ['Video, voice or text', 'Times around your classes', 'Verified counsellors'],
    color: '#4A6741',
    image: '/images/services/online counselling session.jpg',
  },
  {
    id: 'ai-support',
    icon: Brain,
    tag: 'AI companion',
    title: 'JaliBot',
    desc: 'A quick chat for the moments between sessions. Short answers, one step at a time.',
    features: ['English, Swahili, French, Hausa, Igbo, Twi', 'Spots crisis words and points to help', 'Always says it is an AI'],
    color: '#A85B4A',
    image: '/images/services/AIChatSupport.jpg',
  },
  {
    id: 'assessment',
    icon: FileText,
    tag: 'Check in',
    title: 'Self check-ins',
    desc: 'Trusted questionnaires for mood, anxiety and wellbeing. See how you change over time.',
    features: ['PHQ-9, GAD-7 and WHO-5', 'Results in about 2 minutes', 'Share with a counsellor only if you choose'],
    color: '#E89A00',
    image: '/images/services/selfAssesment.jpg',
  },
  {
    id: 'referral',
    icon: Users,
    tag: 'On your campus',
    title: 'Campus referrals',
    desc: 'Find the right office at your university and ask for a referral in one tap.',
    features: ['Guidance office, advisor, careers, finance, clinic', 'Counsellors can refer you too'],
    color: '#6B3228',
    image: '/images/services/referralSystem.jpg',
  },
  {
    id: 'resources',
    icon: BookOpen,
    tag: 'Self-help',
    title: 'Resource library',
    desc: 'Short reads on stress, sleep, anxiety and relationships. Workbooks are coming soon.',
    features: ['Browse by topic', 'Search in seconds', 'Workbooks coming soon'],
    color: '#3B2118',
    image: '/images/services/resourceLib.jpg',
  },
];
