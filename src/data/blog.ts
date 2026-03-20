export interface BlogPost {
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  color: string;
  image: string;
}

export const blogPostsData: BlogPost[] = [
  {
    tag: 'Mental Health',
    title: 'Understanding Exam Anxiety and How to Manage It',
    excerpt:
      'Exam season is one of the most mentally demanding periods for university students. Here is what the research says about exam anxiety and what actually works to manage it.',
    author: 'Dr. Amara Osei',
    date: 'January 2026',
    readTime: '5 min',
    featured: true,
    color: '#8B4A3C',
    image: '/images/blog/examAnxiety.jpg',
  },
  {
    tag: 'Platform',
    title: 'How Anonymous Counselling is Transforming African Campuses',
    excerpt:
      'Anonymity is not a loophole — it is a lifeline. We explore why anonymous access to counselling is changing who gets help across Nigerian, Kenyan, and Ghanaian universities.',
    author: 'JaliMind Team',
    date: 'February 2026',
    readTime: '7 min',
    featured: false,
    color: '#4A6741',
    image: '/images/blog/anonCounselling.jpg',
  },
  {
    tag: 'Wellbeing',
    title: 'Building Emotional Resilience as a University Student',
    excerpt:
      'Resilience is not the absence of struggle. It is the capacity to move through difficulty without losing yourself. Here are four evidence-based strategies to build it deliberately.',
    author: 'Mr. David Kamau',
    date: 'February 2026',
    readTime: '4 min',
    featured: false,
    color: '#C4956A',
    image: '/images/blog/emotionalResilience.jpg',
  },
  {
    tag: 'Culture',
    title: 'Talking to African Parents About Mental Health: A Practical Guide',
    excerpt:
      'The conversation is hard. But it is possible. Based on real experiences shared by students in our community, here is how to begin a mental health conversation at home.',
    author: 'Ms. Fatima Al-Hassan',
    date: 'January 2026',
    readTime: '6 min',
    featured: false,
    color: '#7A5A3C',
    image: '/images/blog/africanParents.jpg',
  },
  {
    tag: 'AI & Technology',
    title: 'What Our AI Chatbot Can and Cannot Do for Your Mental Health',
    excerpt:
      'Artificial intelligence can play a meaningful supportive role in mental health — but it has real limits. We explain exactly what JaliMind\'s AI is designed to do and where it steps back.',
    author: 'JaliMind Team',
    date: 'December 2025',
    readTime: '8 min',
    featured: false,
    color: '#5A7A8A',
    image: '/images/blog/whatOurChatbotCanDo.webp',
  },
  {
    tag: 'Relationships',
    title: 'Navigating Romantic Relationships at University Without Losing Yourself',
    excerpt:
      'University relationships can be wonderful and overwhelming in equal measure. Here is how to build connections that add to your life rather than consuming it.',
    author: 'Ms. Ama Asante',
    date: 'December 2025',
    readTime: '5 min',
    featured: false,
    color: '#6B4A8A',
    image: '/images/blog/relationship.jpg',
  },
  {
    tag: 'Academic Life',
    title: 'The Hidden Cost of People-Pleasing in Group Projects',
    excerpt:
      'Always saying yes, never setting limits, doing others\' work to keep the peace — people-pleasing in academic settings has real mental health consequences. Let us talk about it.',
    author: 'Mr. David Kamau',
    date: 'November 2025',
    readTime: '4 min',
    featured: false,
    color: '#8B7355',
    image: '/images/blog/pleasingPeople.jpg',
  },
];
