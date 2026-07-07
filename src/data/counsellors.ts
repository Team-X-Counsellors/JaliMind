export interface Counsellor {
  name: string;
  role: string;
  specialty: string;
  country: string;
  color: string;
  years: number;
  rating: number;
  languages: string[];
  sessions: number;
  bio: string;
  image: string;
}

export const counsellorsData: Counsellor[] = [
  {
    name: 'Dr. Amara Osei',
    role: 'Clinical Psychologist',
    specialty: 'Academic Stress & Anxiety',
    country: 'Ghana',
    color: '#C4A882',
    years: 8,
    rating: 4.9,
    languages: ['English', 'Twi'],
    sessions: 430,
    bio: 'Dr. Osei specialises in helping students navigate exam anxiety, performance pressure, and academic burnout with a culturally sensitive, strengths-based approach.',
    image: '/images/counsellors/counsellor1.jpg',
  },
  {
    name: 'Ms. Alicia Lucy',
    role: 'Licensed Counsellor',
    specialty: 'Identity & Cultural Transitions',
    country: 'Nigeria',
    color: '#8B7355',
    years: 6,
    rating: 4.8,
    languages: ['English', 'Hausa'],
    sessions: 310,
    bio: 'Fatima works with students experiencing cultural identity challenges, religious conflicts, and the transitions that come with leaving home for university.',
    image: '/images/counsellors/counsellor2.jpg',
  },
  {
    name: 'Mr. David Kamau',
    role: 'Student Wellness Advisor',
    specialty: 'Depression & Resilience',
    country: 'Kenya',
    color: '#A09070',
    years: 5,
    rating: 4.9,
    languages: ['English', 'Swahili'],
    sessions: 280,
    bio: 'David brings a community-centred approach to depression and emotional resilience, drawing on both Western therapeutic models and African communal healing traditions.',
    image: '/images/counsellors/counsellor3.jpg',
  },
  {
    name: 'Dr. Nadia Bouali',
    role: 'Psychotherapist',
    specialty: 'Trauma & Recovery',
    country: 'Morocco',
    color: '#B89878',
    years: 10,
    rating: 5.0,
    languages: ['English', 'French', 'Arabic'],
    sessions: 520,
    bio: 'A trauma-informed therapist with a decade of experience supporting students through grief, abuse recovery, and post-traumatic stress in academic environments.',
    image: '/images/counsellors/counsellor4.jpg',
  },
  {
    name: 'Ms. Ama Asante',
    role: 'Counselling Psychologist',
    specialty: 'Relationships & Communication',
    country: 'Ghana',
    color: '#8B9870',
    years: 4,
    rating: 4.7,
    languages: ['English', 'Twi'],
    sessions: 190,
    bio: 'Ama helps students develop healthier relationships — romantic, familial, and peer — through communication skills training and attachment-based therapy.',
    image: '/images/counsellors/counsellor5.jpg',
  },
  {
    name: 'Mr. Emeka Okafor',
    role: 'Career & Mental Health Counsellor',
    specialty: 'Career Anxiety & Purpose',
    country: 'Nigeria',
    color: '#706890',
    years: 7,
    rating: 4.8,
    languages: ['English', 'Igbo'],
    sessions: 360,
    bio: 'Emeka integrates career counselling with mental health support, helping students who feel lost, pressured to choose certain paths, or anxious about their futures.',
    image: '/images/counsellors/counsellor7.jpg',
  },
];
