import { redirect } from 'next/navigation';

// Anonymous chat now lives at the public /talk route (works without an account).
export default function ShadowRedirect() {
  redirect('/talk');
}
