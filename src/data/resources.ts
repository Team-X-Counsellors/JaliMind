export interface Resource {
  type: 'article' | 'workbook' | 'video';
  title: string;
  category: string;
  readTime: string;
  desc: string;
  color: string;
  image?: string;
}

export const resourcesData: Resource[] = [
  {
    type: 'article',
    title: 'Understanding Anxiety: A Guide for African University Students',
    category: 'Anxiety & Stress',
    readTime: '8 min',
    desc: 'A comprehensive overview of anxiety in academic settings, including African-specific cultural factors that influence how anxiety presents and how it is discussed.',
    color: '#8B4A3C',
    image: '/images/resources/understaningAnxiety.jpg',
  },
  {
    type: 'workbook',
    title: 'Exam Season Survival Workbook',
    category: 'Academic Performance',
    readTime: 'PDF · 24 pages',
    desc: 'Practical exercises, schedules, and self-check-ins to help you manage the emotional weight of examination periods without burning out.',
    color: '#4A6741',
    image: '/images/resources/workbook.jpg',
  },
  {
    type: 'video',
    title: 'Breathing Techniques for Immediate Anxiety Relief',
    category: 'Anxiety & Stress',
    readTime: '12 min video',
    desc: 'A guided video session demonstrating four evidence-based breathing techniques you can use anywhere — in a lecture hall, a bathroom, or before an exam.',
    color: '#C4956A',
    image: '/images/resources/breathing.jpg',
  },
  {
    type: 'article',
    title: 'When Sadness Becomes Depression: Knowing the Difference',
    category: 'Depression',
    readTime: '10 min',
    desc: 'An accessible, stigma-free explanation of how depression develops, what it feels like for students, and the first steps to take if you think you might be struggling.',
    color: '#7A5A3C',
    image: '/images/resources/sadness.jpg',
  },
  {
    type: 'workbook',
    title: 'The Identity Workbook: Navigating Culture, Family & Self',
    category: 'Identity',
    readTime: 'PDF · 18 pages',
    desc: 'Specifically designed for African students who feel torn between family expectations, cultural identity, and their own emerging sense of self at university.',
    color: '#5A7A8A',
    image: '/images/resources/identity.jpg',
  },
  {
    type: 'article',
    title: 'Healthy Boundaries in Friendships and Romantic Relationships',
    category: 'Relationships',
    readTime: '6 min',
    desc: 'Practical guidance on recognising unhealthy relationship patterns and building the communication skills to set boundaries with care and confidence.',
    color: '#6B4A8A',
    image: '/images/resources/relationships.jpg',
  },
  {
    type: 'video',
    title: 'A Guided Meditation for Student Overwhelm',
    category: 'Self-Care',
    readTime: '18 min video',
    desc: 'A guided body-scan meditation designed for students who feel overwhelmed — especially effective before sleep or during particularly difficult academic periods.',
    color: '#4A6741',
    image: '/images/resources/meditation.jpg',
  },
  {
    type: 'article',
    title: 'Crisis Support: What to Do When You Are Not Okay',
    category: 'Crisis Support',
    readTime: '5 min',
    desc: 'A clear, calm guide covering exactly what to do and who to contact if you or a friend is experiencing a mental health crisis on campus.',
    color: '#D4403A',
    image: '/images/resources/crisisSupport.jpg',
  },
  {
    type: 'workbook',
    title: 'Sleep Hygiene for Students: A 7-Day Reset Plan',
    category: 'Self-Care',
    readTime: 'PDF · 12 pages',
    desc: 'Poor sleep dramatically worsens anxiety and depression. This seven-day workbook walks you through building sustainable sleep habits while managing a full student schedule.',
    color: '#8B7355',
    image: '/images/resources/sleepHygiene.jpg',
  },
];
