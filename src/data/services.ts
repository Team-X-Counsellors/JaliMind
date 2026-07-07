import { LucideIcon, MessageCircle, Brain, Shield, BookOpen, FileText, Users } from 'lucide-react';

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
    id: 'counselling',
    icon: MessageCircle,
    tag: 'Core Service',
    title: 'Online Counselling Sessions',
    desc: 'One-on-one confidential sessions with certified counsellors and psychologists, accessible from anywhere. Sessions are available via video, voice, or text-based chat to accommodate your comfort level and connectivity.',
    features: ['Flexible scheduling around class timetables', 'Video, voice, or text sessions', 'Certified, verified counsellors', 'Follow-up session notes and resources'],
    color: '#8B4A3C',
    image: '/images/services/online counselling session.jpg',
  },
  {
    id: 'ai-support',
    icon: Brain,
    tag: 'AI-Powered',
    title: 'AI Chat Support',
    desc: 'An always-available AI companion providing immediate emotional support, coping strategies, and mental health resources. Designed specifically for African students, with multilingual support including Swahili, Igbo, Hausa, and Twi.',
    features: ['Available 24/7, no waiting time', 'Swahili, English, Igbo (coming soon)', 'Evidence-based coping strategies', 'Crisis detection and escalation to human counsellors'],
    color: '#4A6741',
    image: '/images/services/AIChatSupport.jpg',
  },
  {
    id: 'anonymous',
    icon: Shield,
    tag: 'Privacy-First',
    title: 'Anonymous Sessions',
    desc: 'Access full counselling support without ever sharing your identity. Our anonymous session feature was built specifically in response to student feedback showing that fear of stigma is the primary barrier to seeking help.',
    features: ['No personal information required', 'Anonymous usernames only', 'Encrypted session data', 'Equal quality of care as standard sessions'],
    color: '#7A5A3C',
    image: '/images/services/anonSession.jpg',
  },
  {
    id: 'resources',
    icon: BookOpen,
    tag: 'Self-Help',
    title: 'Resource Library',
    desc: 'A curated and growing collection of articles, guides, workbooks, and multimedia resources covering academic stress, anxiety, depression, relationships, identity, career decisions, and more.',
    features: ['Categorised by topic and condition', 'Africa-specific mental health content', 'Downloadable PDF workbooks', 'Weekly new content from our counsellors'],
    color: '#C4956A',
    image: '/images/services/resourceLib.jpg',
  },
  {
    id: 'assessment',
    icon: FileText,
    tag: 'Track Progress',
    title: 'Self-Assessment Tools',
    desc: 'Standardised and purpose-built assessment tools to help you understand your mental health baseline, identify areas of concern, and track your progress over time.',
    features: ['Validated mental health screening tools', 'Personalised result interpretation', 'Progress tracking over weeks and months', 'Option to share results directly with your counsellor'],
    color: '#5A7A8A',
    image: '/images/services/selfAssesment.jpg',
  },
  {
    id: 'referral',
    icon: Users,
    tag: 'Connected Care',
    title: 'Referral System',
    desc: 'JaliMind connects students with existing campus resources — academic advisors, career services, student finance offices — through a seamless referral system that removes the friction of asking for help.',
    features: ['Connection to campus guidance departments', 'Academic advisor integration', 'Career services referrals', 'WhatsApp-based follow-up'],
    color: '#6B4A8A',
    image: '/images/services/referralSystem.jpg',
  },
];
