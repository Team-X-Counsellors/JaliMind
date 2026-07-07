import { LucideIcon, TrendingUp, Heart, Users, Shield, MessageCircle } from 'lucide-react';

export interface CommunityCategory {
  label: string;
  count: number;
  color: string;
  icon: LucideIcon;
}

export interface CommunityThread {
  pinned: boolean;
  title: string;
  category: string;
  author: string;
  university: string;
  replies: number;
  likes: number;
  time: string;
  excerpt: string;
}

export const communityCategoriesData: CommunityCategory[] = [
  { label: 'Academic Pressure', count: 142, color: '#8B4A3C', icon: TrendingUp },
  { label: 'Anxiety & Stress', count: 98, color: '#4A6741', icon: Heart },
  { label: 'Relationships', count: 76, color: '#C4956A', icon: Users },
  { label: 'Identity & Culture', count: 54, color: '#5A7A8A', icon: Shield },
  { label: 'Career & Purpose', count: 89, color: '#7A5A3C', icon: MessageCircle },
  { label: 'General Wellbeing', count: 203, color: '#6B4A8A', icon: Heart },
];

export const communityThreadsData: CommunityThread[] = [
  {
    pinned: true,
    title: 'How I managed exam anxiety without medication — my 6-week journey',
    category: 'Academic Pressure',
    author: 'Anonymous Student',
    university: 'UNILAG',
    replies: 34,
    likes: 87,
    time: '2 hours ago',
    excerpt: 'I want to share what worked for me because I know how desperate it can feel when every technique seems to fail...',
  },
  {
    pinned: false,
    title: 'Does anyone else feel like they cannot talk to their parents about mental health?',
    category: 'Identity & Culture',
    author: 'K. Mwangi',
    university: 'University of Nairobi',
    replies: 61,
    likes: 120,
    time: '5 hours ago',
    excerpt: 'My family comes from a background where mental health is not discussed openly. I have tried to explain what I\'m going through but...',
  },
  {
    pinned: false,
    title: 'Practical tips for managing group project stress (especially when teammates disappear)',
    category: 'Academic Pressure',
    author: 'Temi O.',
    university: 'KNUST',
    replies: 28,
    likes: 45,
    time: '1 day ago',
    excerpt: 'Second year engineering student here. Group projects are the bane of my existence and I have learned some things the hard way...',
  },
  {
    pinned: false,
    title: 'Finding community as a first-generation university student',
    category: 'Identity & Culture',
    author: 'Amara D.',
    university: 'UCT',
    replies: 19,
    likes: 63,
    time: '2 days ago',
    excerpt: 'Nobody in my family has ever attended university and I thought I would feel proud. But mostly I just feel like an outsider...',
  },
  {
    pinned: false,
    title: 'Swahili-speaking students: let us create a support thread here',
    category: 'General Wellbeing',
    author: 'Aisha M.',
    university: 'University of Nairobi',
    replies: 47,
    likes: 91,
    time: '3 days ago',
    excerpt: 'Ninaona kwamba wengi wetu tunapambana lakini hatuna mahali pa kuzungumza kwa Kiswahili. Karibu hapa...',
  },
  {
    pinned: false,
    title: 'Resources that actually helped my depression — a curated list',
    category: 'Anxiety & Stress',
    author: 'Anonymous',
    university: 'Makerere',
    replies: 52,
    likes: 134,
    time: '4 days ago',
    excerpt: 'I have been through three counsellors and countless YouTube videos. Here is what genuinely moved the needle for me...',
  },
];
