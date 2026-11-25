import CounselorShell from '@/components/counselor/CounselorShell';

export const metadata = { title: 'Counsellor workspace · JaliMind' };

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  return <CounselorShell>{children}</CounselorShell>;
}
