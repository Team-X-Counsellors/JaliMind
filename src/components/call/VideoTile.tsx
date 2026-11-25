'use client';
import { useEffect, useRef } from 'react';

/** <video> bound to a MediaStream. Remote audio also plays through this element. */
export default function VideoTile({
  stream, muted = false, mirrored = false, className = '', label,
}: { stream: MediaStream | null; muted?: boolean; mirrored?: boolean; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.srcObject !== stream) el.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      aria-label={label}
      className={`${mirrored ? '-scale-x-100' : ''} ${className}`}
    />
  );
}
