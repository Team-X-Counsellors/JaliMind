/** JaliBot's face: a calm orb. 'breathe' is a slow idle pulse, 'think' a quicker one while a reply is on its way. */
export default function Orb({ size = 28, mode = 'still', className = '' }: { size?: number; mode?: 'still' | 'breathe' | 'think'; className?: string }) {
  const motion = mode === 'breathe' ? 'animate-orb-breathe' : mode === 'think' ? 'animate-orb-think' : '';
  return <span aria-hidden className={`bg-orb inline-block shrink-0 rounded-full ${motion} ${className}`} style={{ width: size, height: size }} />;
}
