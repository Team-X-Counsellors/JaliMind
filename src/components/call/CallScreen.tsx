'use client';
import { useEffect, useState } from 'react';
import { Mic, MicOff, MessageSquare, PhoneOff, Video, VideoOff, WifiOff } from 'lucide-react';
import type { CallPhase, ChatMsg } from '@/lib/webrtc';
import ChatDrawer from './ChatDrawer';
import VideoTile from './VideoTile';

interface Props {
  otherName: string;
  wantsVideo: boolean;
  phase: CallPhase;
  everConnected: boolean;
  connectedAt: number | null;
  signalling: 'connecting' | 'open' | 'closed';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  hasLocalAudio: boolean;
  hasLocalVideo: boolean;
  audioOn: boolean;
  videoOn: boolean;
  remoteMedia: { audio: boolean; video: boolean };
  messages: ChatMsg[];
  unread: number;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onHangup: () => void;
  onSendChat: (t: string) => void;
  onChatOpen: (open: boolean) => void;
}

function useElapsed(since: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!since) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [since]);
  if (!since) return '0:00';
  const s = Math.max(0, Math.floor((now - since) / 1000));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m % 60)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

function CtrlButton({ on = true, label, onClick, children, disabled }: { on?: boolean; label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} aria-pressed={!on} title={label}
      className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-40 ${on ? 'bg-white/15 text-white' : 'bg-white text-night'}`}>
      {children}
    </button>
  );
}

export default function CallScreen(p: Props) {
  const [chatOpen, setChatOpen] = useState(false);
  const elapsed = useElapsed(p.connectedAt);

  const toggleChat = (open: boolean) => { setChatOpen(open); p.onChatOpen(open); };

  const remoteHasVideo = !!p.remoteStream && p.remoteStream.getVideoTracks().length > 0 && p.remoteMedia.video;
  const showRemoteVideo = p.wantsVideo && remoteHasVideo;

  const status =
    p.phase === 'connected' ? elapsed
      : p.phase === 'reconnecting' ? 'Connection unstable. Reconnecting…'
        : p.phase === 'connecting' ? 'Connecting…'
          : p.phase === 'waiting' ? (p.everConnected ? `Waiting for ${p.otherName} to rejoin…` : `Waiting for ${p.otherName} to join…`)
            : 'Joining…';
  const good = p.phase === 'connected';

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-night text-white" style={{ height: '100dvh' }}>
      <div className="relative flex-1 overflow-hidden">
        {/* Remote media. Kept mounted so voice-only calls still play audio through it. */}
        <VideoTile stream={p.remoteStream} label={`${p.otherName}'s video`}
          className={showRemoteVideo ? 'absolute inset-0 h-full w-full object-cover' : 'pointer-events-none absolute h-px w-px opacity-0'} />

        {!showRemoteVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2A2858] to-night px-6 text-center">
            <span className={`flex h-28 w-28 items-center justify-center rounded-full bg-primary font-display text-5xl font-bold ${good ? 'ring-4 ring-lagoon/60' : 'animate-pulse'}`}>
              {p.otherName[0]?.toUpperCase()}
            </span>
            <p className="font-display text-2xl font-bold">{p.otherName}</p>
            <p className="text-white/70" role="status" aria-live="polite">
              {p.phase === 'connected' && p.wantsVideo && !p.remoteMedia.video ? 'Camera is off · ' : ''}{status}
            </p>
          </div>
        )}

        {/* Top status bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-night/80 to-transparent px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
          <p className="flex items-center gap-2 rounded-full bg-night/60 px-3 py-1.5 text-sm font-semibold backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${good ? 'bg-lagoon-light' : 'animate-pulse bg-marigold'}`} aria-hidden />
            {showRemoteVideo || p.phase !== 'connected' ? status : `${p.otherName} · ${elapsed}`}
          </p>
          {!p.remoteMedia.audio && p.phase === 'connected' && (
            <span className="flex items-center gap-1.5 rounded-full bg-night/60 px-3 py-1.5 text-xs backdrop-blur"><MicOff size={14} /> Muted</span>
          )}
        </div>
        {p.signalling === 'closed' && p.phase !== 'connected' && (
          <p role="alert" className="absolute inset-x-4 top-16 flex items-center justify-center gap-2 rounded-xl bg-marigold px-3 py-2 text-sm font-semibold text-night">
            <WifiOff size={16} /> You are offline. Trying to reconnect…
          </p>
        )}

        {/* Self view */}
        {p.wantsVideo && p.localStream && p.hasLocalVideo && (
          <div className="absolute right-3 top-20 h-36 w-24 overflow-hidden rounded-2xl border-2 border-white/30 bg-[#2A2858] shadow-pop sm:h-44 sm:w-32">
            {p.videoOn
              ? <VideoTile stream={p.localStream} muted mirrored label="Your camera" className="h-full w-full object-cover" />
              : <div className="flex h-full items-center justify-center text-white/60"><VideoOff size={26} /></div>}
          </div>
        )}
      </div>

      {/* Controls: 56px targets, thumb-reachable, clear of the home indicator */}
      <div className="pb-safe bg-night px-4 pt-4">
        <div className="mx-auto flex max-w-sm items-center justify-between gap-2 pb-3">
          <CtrlButton on={p.audioOn} label={p.audioOn ? 'Mute microphone' : 'Unmute microphone'} onClick={p.onToggleAudio} disabled={!p.hasLocalAudio}>
            {p.audioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </CtrlButton>
          {(p.wantsVideo || p.hasLocalVideo) && (
            <CtrlButton on={p.videoOn} label={p.videoOn ? 'Turn camera off' : 'Turn camera on'} onClick={p.onToggleVideo} disabled={!p.hasLocalVideo}>
              {p.videoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </CtrlButton>
          )}
          <div className="relative">
            <CtrlButton label="Open chat" onClick={() => toggleChat(true)}><MessageSquare size={24} /></CtrlButton>
            {p.unread > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[20px] rounded-full bg-marigold px-1 text-center text-xs font-bold leading-5 text-night" aria-label={`${p.unread} unread messages`}>{p.unread}</span>
            )}
          </div>
          <button onClick={p.onHangup} aria-label="End call" title="End call"
            className="flex h-14 w-20 items-center justify-center rounded-full bg-hibiscus text-white shadow-pop transition-transform active:scale-95">
            <PhoneOff size={26} />
          </button>
        </div>
      </div>

      <ChatDrawer open={chatOpen} onClose={() => toggleChat(false)} messages={p.messages} onSend={p.onSendChat} />
    </div>
  );
}
