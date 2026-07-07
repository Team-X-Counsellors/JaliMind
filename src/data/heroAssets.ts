export interface HeroAsset {
  id: string;
  src: string;
  alt: string;
  section: 'hero' | 'aboutStory';
}

export const heroAssets: HeroAsset[] = [
  {
    id: 'hero-students',
    src: '/images/hero/universityStudents.webp',
    alt: 'University students on campus',
    section: 'hero',
  },
  {
    id: 'hero-team-collaboration',
    src: '/images/hero/counselling.png',
    alt: 'The JaliMind team collaborating',
    section: 'hero',
  },
  {
    id: 'hero-counselling',
    src: '/images/hero/topAfricanCOunsellingPlatform.jpg',
    alt: 'Counselor listening to student',
    section: 'hero',
  },
  {
    id: 'about-map',
    src: '/images/about/PanAfricanMap.jpg',
    alt: 'Pan-Africa map showing JaliMind presence in Nigeria, Kenya, and Ghana',
    section: 'aboutStory',
  },
];

export const getHeroAsset = (id: string) => heroAssets.find(asset => asset.id === id);
