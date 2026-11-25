/**
 * "Jali" is the Swahili word for a carved lattice screen: privacy that still lets light through.
 * That is the idea behind the product, so it is also the one decorative motif we use:
 * a quiet lattice of overlapping circles, only ever on dark surfaces.
 */
const svg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="white" stroke-width="1.2">
     <circle cx="0" cy="0" r="32"/><circle cx="64" cy="0" r="32"/><circle cx="0" cy="64" r="32"/><circle cx="64" cy="64" r="32"/>
   </svg>`
);

export default function JaliPattern({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.07] ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundSize: '64px 64px' }}
    />
  );
}
