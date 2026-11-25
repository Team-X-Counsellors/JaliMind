// Single source for hotlines shown on the marketing site. Same numbers JaliBot and anonymous chat use.
export interface CrisisLine {
  country: string;
  name: string;
  phone: string;
}

export const crisisLines: CrisisLine[] = [
  { country: 'Kenya', name: 'Befrienders Kenya', phone: '+254 722 178 177' },
  { country: 'Nigeria', name: 'SURPIN', phone: '+234 806 210 6493' },
  { country: 'Ghana', name: 'Mental Health Authority', phone: '0800 111 222' },
  { country: 'South Africa', name: 'SADAG', phone: '0800 456 789' },
];

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
