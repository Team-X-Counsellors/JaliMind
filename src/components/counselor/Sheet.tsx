'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/** Bottom sheet on phones, centred card on desktop. Esc / backdrop closes; focus moves inside. */
export default function Sheet({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 bg-night/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="pb-safe relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-card p-5 shadow-pop outline-none sm:max-w-md sm:rounded-[1.75rem]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="tap flex items-center justify-center rounded-full text-muted-foreground hover:bg-secondary">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
