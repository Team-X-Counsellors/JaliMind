export interface TeamMember {
  name: string;
  role: string;
  country: string;
  color: string;
  bio: string;
  image: string;
}

export const teamData: TeamMember[] = [
  {
    name: 'Kosisochukwu Moronu',
    role: 'Product & Project Manager',
    country: 'Nigeria',
    color: '#8B4A3C',
    bio: 'Driving product vision and team coordination across JaliMind.',
    image: '/images/About/Kosisochukwu.jpg',
  },
  {
    name: 'Joy Mwendi',
    role: 'Documentation & Research',
    country: 'Kenya',
    color: '#4A6741',
    bio: 'Leads research analysis and ensures every insight shapes the platform.',
    image: '/images/About/smily.jpg',
  },
  {
    name: 'Florida Korir',
    role: 'Marketing & Regulatory',
    country: 'Kenya',
    color: '#C4A882',
    bio: 'Navigating compliance and communicating JaliMind\'s mission to the world.',
    image: '/images/About/smily.jpg',
  },
  {
    name: 'Winnie',
    role: 'UI/UX & Frontend Development',
    country: 'Ghana',
    color: '#7A5A3C',
    bio: 'Designing beautiful, accessible interfaces that students actually want to use.',
    image: '/images/About/smily.jpg',
  },
  {
    name: 'Paul',
    role: 'Full-Stack Development',
    country: 'Pan-African',
    color: '#5A7A8A',
    bio: 'Building the technical backbone that makes JaliMind reliable and scalable.',
    image: '/images/About/Paulmwangi.webp',
  },
];
