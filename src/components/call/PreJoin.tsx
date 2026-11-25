'use client';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Camera, Lock, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaIssue } from '@/lib/webrtc';
import VideoTile from './VideoTile';

interface Props {
  otherName: string;
  when: string;
  wantsVideo: boolean;
  stream: MediaStream | null;
  hasVideo: boolean;
  hasAudio: boolean;
  audioOn: boolean;
  videoOn: boolean;
  issue: MediaIssue | null;
  onEnable: (video: boolean) => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onJoin: () => void;
}

/**
 * Arriving here means the person tapped "Join call", so we ask the browser for the camera and
 * microphone straight away (Chrome shows its own Allow/Block prompt). If they block it or want to
 * listen only, the buttons below let them retry or skip.
 */
export default function PreJoin(p: Props) {
  const [skipMedia, setNoMedia] = useState(false);
  const asked = useRef(false);
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    p.onEnable(p.wantsVideo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const noMedia = skipMedia && !p.stream; // a live stream always wins over an earlier "skip"
  const ready = !!p.stream || noMedia;
  const kind = p.wantsVideo ? 'camera and microphone' : 'microphone';

  return (
    <div className="min-h-dvh-screen flex flex-col bg-night text-white">
      <header className="px-5 pt-6">
        <p className="font-display text-lg font-bold">Jali<span className="text-marigold">Mind</span></p>
        <h1 className="mt-5 font-display text-3xl font-bold text-balance">Ready to join {p.otherName}?</h1>
        <p className="mt-1 text-white/70">{p.wantsVideo ? 'Video' : 'Voice'} session · {p.when}</p>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-5">
        <div className="relative aspect-[3/4] max-h-[46dvh] w-full overflow-hidden rounded-3xl bg-[#2A2858] sm:aspect-video">
          {p.stream && p.hasVideo && p.videoOn ? (
            <VideoTile stream={p.stream} muted mirrored label="Your camera preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
              {p.wantsVideo ? <VideoOff size={40} /> : <Mic size={40} />}
              <p className="px-6 text-center text-sm">{p.stream ? (p.wantsVideo ? 'Camera is off' : 'Microphone is on') : `Your ${kind} are off`}</p>
            </div>
          )}
          {p.stream && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-3">
              {p.hasAudio && (
                <button onClick={p.onToggleAudio} aria-pressed={!p.audioOn} aria-label={p.audioOn ? 'Mute microphone' : 'Unmute microphone'}
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${p.audioOn ? 'bg-white/20' : 'bg-white text-night'}`}>
                  {p.audioOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              )}
              {p.hasVideo && (
                <button onClick={p.onToggleVideo} aria-pressed={!p.videoOn} aria-label={p.videoOn ? 'Turn camera off' : 'Turn camera on'}
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${p.videoOn ? 'bg-white/20' : 'bg-white text-night'}`}>
                  {p.videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
              )}
            </div>
          )}
        </div>

        {!p.stream && !p.issue && !noMedia && (
          <p role="status" className="mt-4 rounded-2xl bg-white/10 p-4 text-center text-sm text-white/85">
            Your browser will ask to use your {kind}. Choose <strong>Allow</strong> so {p.otherName} can {p.wantsVideo ? 'see and hear' : 'hear'} you.
          </p>
        )}

        {p.issue && (
          <div role="alert" className="mt-4 rounded-2xl bg-hibiscus/20 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={17} /> {
              p.issue.kind === 'denied' ? `Your browser blocked the ${p.issue.wanted === 'video' ? 'camera or microphone' : 'microphone'}`
                : p.issue.kind === 'none' ? `We could not use your ${p.issue.wanted === 'video' ? 'camera or microphone' : 'microphone'}` : 'Something went wrong starting your devices'}
            </p>
            <p className="mt-1 text-white/80">
              {p.issue.kind === 'denied'
                ? 'Tap the lock icon next to the web address, allow camera and microphone, then try again.'
                : p.issue.kind === 'none'
                  ? 'No device was found, or another app is using it. Close other apps that use the camera and try again.'
                  : 'Try again, or join with voice only.'}
            </p>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-6">
          {!ready && (
            <>
              <Button size="lg" variant="cta" className="w-full" onClick={() => p.onEnable(p.wantsVideo)}>
                <Camera size={20} /> {p.issue ? 'Try again' : p.wantsVideo ? 'Turn on camera and mic' : 'Turn on microphone'}
              </Button>
              {p.wantsVideo && p.issue && (
                <Button size="lg" variant="soft" className="w-full" onClick={() => p.onEnable(false)}>Join with voice only</Button>
              )}
              <button onClick={() => setNoMedia(true)} className="tap w-full text-sm text-white/70 underline">
                Join without {p.wantsVideo ? 'camera or mic' : 'microphone'} (you can listen only)
              </button>
            </>
          )}
          {ready && (
            <Button size="lg" variant="cta" className="w-full" onClick={p.onJoin}>
              {noMedia ? 'Join and listen only' : 'Join call'}
            </Button>
          )}
          <p className="flex items-center justify-center gap-1.5 pb-safe text-center text-xs text-white/55">
            <Lock size={13} /> Direct between you and {p.otherName}. Nothing is recorded.
          </p>
        </div>
      </main>
    </div>
  );
}
