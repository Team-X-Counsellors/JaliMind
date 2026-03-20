import { LucideIcon, TrendingUp, Users, Shield } from 'lucide-react';

export interface CaseStudyOutcome {
  metric: string;
  label: string;
}

export interface CaseStudy {
  tag: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  thumbnail: string;
  summary: string;
  challenge: string;
  approach: string;
  outcomes: CaseStudyOutcome[];
  quote: string;
  quoteAuthor: string;
}

export const caseStudiesData: CaseStudy[] = [
  {
    tag: 'Academic Stress',
    icon: TrendingUp,
    title: 'Reducing Exam Anxiety at UNILAG',
    subtitle: 'University of Lagos · Nigeria · 2025',
    color: '#8B4A3C',
    thumbnail: '/images/caseStudy/examAnxiety.jpg',
    summary: 'How JaliMind helped 120 students manage pre-examination anxiety through a structured 6-week support programme, leading to measurable improvements in academic performance and emotional wellbeing.',
    challenge: 'During the 2025 first semester, the University of Lagos guidance department reported a 60% increase in students seeking crisis support in the three weeks before examinations. Most students reported feeling that help came too late.',
    approach: 'JaliMind implemented a proactive 6-week "Exam Ready" programme — combining weekly group sessions with a JaliMind counsellor, daily AI check-ins, and a self-assessment tracker. 120 students enrolled voluntarily.',
    outcomes: [
      { metric: '78%', label: 'of students reported reduced anxiety levels by week 4' },
      { metric: '91%', label: 'completed all 6 sessions — far above typical retention rates' },
      { metric: '34%', label: 'average improvement in self-reported academic confidence' },
      { metric: '0', label: 'crisis escalations during the exam period for enrolled students' },
    ],
    quote: 'I came in expecting tips. I left with a completely different relationship with pressure. The AI check-ins between sessions made all the difference.',
    quoteAuthor: 'Participant, UNILAG 2025',
  },
  {
    tag: 'Peer Support',
    icon: Users,
    title: 'Community Forum Impact in Nairobi',
    subtitle: 'University of Nairobi · Kenya · 2025',
    color: '#4A6741',
    thumbnail: '/images/caseStudy/peerSupport.jpg',
    summary: 'Students at the University of Nairobi built peer support networks through the JaliMind community forum that led to a 40% increase in help-seeking behaviour and a significant reduction in reported loneliness.',
    challenge: 'Post-pandemic, many University of Nairobi students reported deep social isolation even after returning to in-person learning. Formal counselling waitlists were 3–4 weeks long. Students needed support faster.',
    approach: 'JaliMind launched its community forum at UoN with Swahili-language threads, moderated by two trained student peer supporters. The AI chatbot was integrated to suggest relevant threads and escalate concerning conversations.',
    outcomes: [
      { metric: '40%', label: 'increase in students actively seeking help, including formal counselling' },
      { metric: '860+', label: 'posts in the first 8 weeks — strong organic engagement' },
      { metric: '67%', label: 'of users said the forum made them feel less alone' },
      { metric: '23', label: 'students escalated to formal counselling via AI referral' },
    ],
    quote: 'Nilikuwa siamini mtu yeyote angeweza kunielewa. Forum ilionyesha kwamba si peke yangu.',
    quoteAuthor: 'Community Member, UoN 2025',
  },
  {
    tag: 'Anonymity & Trust',
    icon: Shield,
    title: 'Anonymous Sessions: Breaking the Stigma',
    subtitle: 'Multi-Campus Pilot · 2025',
    color: '#7A5A3C',
    thumbnail: '/images/caseStudy/TrustandAnonimity.jpg',
    summary: 'An analysis of how the anonymous session feature enabled first-time counselling access for students who would have otherwise disengaged — across three campuses in Nigeria, Kenya, and Ghana.',
    challenge: 'Survey data from 340 students showed that 68% had never sought counselling despite experiencing significant distress. The primary reason cited was fear of being seen, judged, or identified.',
    approach: 'JaliMind deployed anonymous sessions with zero-knowledge identity protection across UNILAG, UoN, and KNUST. Students could begin sessions with no name, no photo, and no university ID — just a randomly generated username.',
    outcomes: [
      { metric: '68%', label: 'of first-time users chose the anonymous option initially' },
      { metric: '44%', label: 'of anonymous users transitioned to named sessions after 2+ sessions' },
      { metric: '92%', label: 'said anonymity was the reason they felt safe enough to try' },
      { metric: '3x', label: 'more first-generation users vs. non-anonymous sessions' },
    ],
    quote: 'I would never have made that first session. Knowing no one could trace it to me was the only reason I clicked the button.',
    quoteAuthor: 'Anonymous Participant, KNUST 2025',
  },
];
