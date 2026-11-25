import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/** Frame for every public page: sticky nav, content, footer. */
export default function MarketingPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

/** Short night-coloured page title band. */
export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="bg-night text-white">
      <div className="mx-auto max-w-5xl px-5 pb-12 pt-10 md:pb-16 md:pt-16">
        <h1 className="max-w-2xl text-balance font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {children && <p className="mt-3 max-w-xl text-lg text-white/70">{children}</p>}
      </div>
    </section>
  );
}
