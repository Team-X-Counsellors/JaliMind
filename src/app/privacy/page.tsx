import LegalPage from '@/components/marketing/LegalPage';

export const metadata = { title: 'Privacy | JaliMind' };

// Written to match how the product actually works today. Keep it in step with the code.
const sections = [
  {
    title: 'Anonymous chat',
    content: 'No account, name or email is needed. Your chat is tied only to a random nickname and a secret key kept in your browser. A counsellor sees the nickname and what you write, nothing else. You can delete the whole chat at any time. Chats also expire on their own after 24 hours and are then deleted. Chats are protected in transit (HTTPS) but are not end-to-end encrypted, because a counsellor has to be able to read them to reply.',
  },
  {
    title: 'If you make an account',
    content: 'We keep your name, email and university, and your phone number if you add one. If you sign in with Google, we receive your name, email and Google account ID. We never see or store your Google password. Your appointments, JaliBot chats and check-in results are saved to your account so you can come back to them.',
  },
  {
    title: 'Who can see what',
    content: 'Your counsellor sees your name and the notes of sessions you booked with them. Check-in results are private unless you choose to share one with a counsellor, and you can take that back. We do not share your chats or results with your university.',
  },
  {
    title: 'JaliBot and Google Gemini',
    content: 'JaliBot is an AI. What you type to JaliBot is sent to Google\'s Gemini service to write a reply. JaliBot can remember short facts about you to help later chats. You can delete those memories in the app. Please do not share anything with JaliBot you would not want processed by Google.',
  },
  {
    title: 'Safety exceptions',
    content: 'If you write words that suggest you may harm yourself, we flag the chat so a counsellor sees it first and we show you crisis lines. We do this to keep you safe.',
  },
  {
    title: 'Cookies and storage',
    content: 'We use one essential cookie to keep you signed in and store sign-in keys in your browser. We use no advertising or tracking cookies.',
  },
  {
    title: 'What we never do',
    content: 'We do not sell your data and we do not use it for advertising.',
  },
  {
    title: 'Your rights',
    content: 'You can ask to see, correct or delete your data at any time by emailing us. We will confirm once your account data is deleted.',
  },
  {
    title: 'Changes',
    content: 'If we change this policy in a way that matters, we will tell account holders by email before it takes effect.',
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Your privacy"
      updated="November 2026"
      intro="Short version: anonymous chat needs no account, you can delete it any time, and we never sell your data. Details below."
      sections={sections}
      contact={{ label: 'Privacy questions or deletion requests', email: 'privacy@jalimind.org' }}
    />
  );
}
