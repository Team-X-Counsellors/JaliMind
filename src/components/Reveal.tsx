'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Fades and lifts its child in once, when it scrolls into view. Content stays visible without JS
 *  and for reduced-motion users (the global reduced-motion rule shortens the transition). */
export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const [state, setState] = useState<'shown' | 'hidden' | 'in'>('shown');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95) return; // already on screen: leave as is
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState('hidden');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setState('in'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={`${className} transition duration-500 ease-out ${state === 'hidden' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
      style={{ transitionDelay: state === 'in' ? `${delay}ms` : '0ms' }}
    >
      {children}
    </li>
  );
}
