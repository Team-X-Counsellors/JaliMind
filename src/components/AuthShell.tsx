import Link from 'next/link';

/** Shared frame for sign in / sign up: night header on top, form sheet rising over it. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh-screen flex flex-col bg-night">
      <header className="px-6 pb-10 pt-8 text-white">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Jali<span className="text-marigold">Mind</span>
        </Link>
        <h1 className="mt-8 text-3xl font-bold text-balance sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-sm text-white/70">{subtitle}</p>
      </header>
      <main className="mx-auto -mt-4 w-full max-w-md flex-1 rounded-t-[2rem] bg-background px-6 pb-10 pt-8 shadow-pop sm:mb-10 sm:rounded-[2rem]">
        {children}
      </main>
    </div>
  );
}
