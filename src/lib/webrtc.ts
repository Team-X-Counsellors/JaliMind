'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LiveSocket, openLiveSocket, wsUrl } from '@/lib/ws';

/*
 * 1:1 WebRTC call over the Django Channels signalling socket (/ws/call/<appointment>/).
 * Audio/video go peer-to-peer; the server only relays the handshake.
 *
 * Roles: whoever is already in the room creates the offer when the server says 'peer-joined'.
 * The joiner just answers. ICE restarts are offered by the original offerer ('restart: true'),
 * which tells the answerer to reuse its connection instead of building a new one.
 *
 * PRODUCTION NOTE: STUN alone fails for roughly 10-15% of users behind strict campus or mobile
 * carrier NATs. The backend adds a TURN server to `ice_servers` when CALL_TURN_URL /
 * CALL_TURN_USERNAME / CALL_TURN_CREDENTIAL are set. Set them before launch.
 */

export type CallPhase = 'idle' | 'joining' | 'waiting' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'error';
export type CallErrorCode = 'outside_window' | 'connect_failed';
export interface ChatMsg { id: number; mine: boolean; text: string; at: number }
export interface MediaIssue { kind: 'denied' | 'none' | 'error'; wanted: 'video' | 'audio' }

const FALLBACK_ICE: RTCIceServer[] = [{ urls: ['stun:stun.l.google.com:19302'] }];

export const ERROR_COPY: Record<CallErrorCode, string> = {
  outside_window: 'This session opens 10 minutes before the start time. Come back then and tap Join.',
  connect_failed: 'We could not connect to the call. Check your internet connection and try again.',
};

export function usePeerCall(appointmentId: string, wantsVideo: boolean) {
  const [phase, setPhase] = useState<CallPhase>('idle');
  const [error, setError] = useState<{ code: CallErrorCode; message: string } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [remoteMedia, setRemoteMedia] = useState({ audio: true, video: true });
  const [peerPresent, setPeerPresent] = useState(false);
  const [everConnected, setEverConnected] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [endedBy, setEndedBy] = useState<'self' | 'peer' | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [unread, setUnread] = useState(0);
  const [mediaIssue, setMediaIssue] = useState<MediaIssue | null>(null);
  const [signalling, setSignalling] = useState<'connecting' | 'open' | 'closed'>('connecting');

  const localRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sockRef = useRef<LiveSocket | null>(null);
  const iceRef = useRef<RTCIceServer[]>(FALLBACK_ICE);
  const pendingRef = useRef<RTCIceCandidateInit[]>([]);
  const offererRef = useRef(false);
  const joinedRef = useRef(false);
  const endedRef = useRef(false);
  const chatOpenRef = useRef(false);
  const msgId = useRef(0);
  const failTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dropTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);
  const audioRef = useRef(true);
  const videoRef = useRef(true);

  const send = useCallback((data: unknown) => sockRef.current?.send(data), []);

  const stopLocal = useCallback(() => {
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    setLocalStream(null);
  }, []);

  const closePc = useCallback(() => {
    const pc = pcRef.current;
    pcRef.current = null;
    pendingRef.current = [];
    if (pc) {
      pc.onicecandidate = null; pc.ontrack = null; pc.onconnectionstatechange = null;
      try { pc.close(); } catch { /* already closed */ }
    }
    setRemoteStream(null);
  }, []);

  // ---------- local media (only ever started by an explicit user tap) ----------
  const startMedia = useCallback(async (video: boolean) => {
    stopLocal();
    setMediaIssue(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaIssue({ kind: 'none', wanted: video ? 'video' : 'audio' });
      return null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: video ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      });
      localRef.current = stream;
      audioRef.current = stream.getAudioTracks().length > 0;
      videoRef.current = stream.getVideoTracks().length > 0;
      setAudioOn(audioRef.current);
      setVideoOn(videoRef.current);
      setLocalStream(stream);
      return stream;
    } catch (err) {
      const name = (err as DOMException)?.name;
      const kind = name === 'NotAllowedError' || name === 'SecurityError' ? 'denied'
        : name === 'NotFoundError' || name === 'OverconstrainedError' || name === 'NotReadableError' ? 'none' : 'error';
      setMediaIssue({ kind, wanted: video ? 'video' : 'audio' });
      return null;
    }
  }, [stopLocal]);

  // ---------- peer connection ----------
  const createPc = useCallback((asOfferer: boolean) => {
    const pc = new RTCPeerConnection({ iceServers: iceRef.current });
    pcRef.current = pc;
    offererRef.current = asOfferer;

    pc.onicecandidate = (e) => { if (e.candidate) send({ type: 'candidate', candidate: e.candidate.toJSON() }); };
    pc.ontrack = (e) => {
      const stream = e.streams[0] ?? new MediaStream([e.track]);
      setRemoteStream(stream);
    };
    pc.onconnectionstatechange = () => {
      if (pcRef.current !== pc) return;
      const s = pc.connectionState;
      if (s === 'connected') {
        clearTimeout(dropTimer.current);
        setPhase('connected');
        setEverConnected(true);
        setConnectedAt((prev) => prev ?? Date.now());
      } else if (s === 'connecting') {
        setPhase((p) => (p === 'connected' ? 'reconnecting' : 'connecting'));
      } else if (s === 'disconnected' || s === 'failed') {
        setPhase('reconnecting');
        clearTimeout(dropTimer.current);
        // Brief 'disconnected' blips often heal alone; only the offerer restarts, after a grace period.
        dropTimer.current = setTimeout(() => { if (offererRef.current && pcRef.current === pc) void startOffer(true); }, s === 'failed' ? 0 : 5000);
      }
    };

    const local = localRef.current;
    const have = new Set<string>();
    local?.getTracks().forEach((t) => { pc.addTrack(t, local); have.add(t.kind); });
    if (asOfferer) {
      // Without our own camera/mic we still need m-lines to be able to RECEIVE theirs.
      const kinds: ('audio' | 'video')[] = wantsVideo ? ['audio', 'video'] : ['audio'];
      kinds.forEach((kind) => {
        if (!have.has(kind)) pc.addTransceiver(kind, { direction: 'recvonly' });
      });
    }
    return pc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send, wantsVideo]);

  async function flush(pc: RTCPeerConnection) {
    const list = pendingRef.current;
    pendingRef.current = [];
    for (const c of list) { try { await pc.addIceCandidate(c); } catch { /* stale candidate */ } }
  }

  async function startOffer(restart = false) {
    let pc = pcRef.current;
    if (!restart || !pc) { closePc(); pc = createPc(true); }
    offererRef.current = true;
    try {
      const offer = await pc.createOffer(restart ? { iceRestart: true } : undefined);
      await pc.setLocalDescription(offer);
      send({ type: 'offer', sdp: pc.localDescription?.sdp, restart });
      setPhase((p) => (p === 'connected' ? 'reconnecting' : 'connecting'));
    } catch { /* connection torn down mid-negotiation; the next peer-joined retries */ }
  }

  async function handleOffer(sdp: string, restart: boolean) {
    let pc = pcRef.current;
    if (!(restart && pc)) { closePc(); pc = createPc(false); }
    offererRef.current = false;
    try {
      await pc.setRemoteDescription({ type: 'offer', sdp });
      await flush(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      send({ type: 'answer', sdp: pc.localDescription?.sdp });
      setPhase((p) => (p === 'connected' ? p : 'connecting'));
    } catch { /* ignore; offerer will retry on reconnect */ }
  }

  async function handleAnswer(sdp: string) {
    const pc = pcRef.current;
    if (!pc || pc.signalingState !== 'have-local-offer') return;
    try { await pc.setRemoteDescription({ type: 'answer', sdp }); await flush(pc); } catch { /* ignore */ }
  }

  async function handleCandidate(candidate: RTCIceCandidateInit) {
    const pc = pcRef.current;
    if (pc?.remoteDescription) { try { await pc.addIceCandidate(candidate); } catch { /* stale */ } }
    else pendingRef.current.push(candidate); // arrives before the offer/answer is applied: hold it
  }

  const finish = useCallback((by: 'self' | 'peer' | null) => {
    endedRef.current = true;
    clearTimeout(failTimer.current);
    clearTimeout(dropTimer.current);
    closePc();
    stopLocal();
    sockRef.current?.close();
    sockRef.current = null;
    wakeLock.current?.release().catch(() => {});
    wakeLock.current = null;
    if (by) { setEndedBy(by); setPhase('ended'); }
  }, [closePc, stopLocal]);

  function onMessage(m: Record<string, unknown> & { type?: string }) {
    switch (m.type) {
      case 'joined':
        joinedRef.current = true;
        clearTimeout(failTimer.current);
        if (Array.isArray(m.ice_servers) && m.ice_servers.length) iceRef.current = m.ice_servers as RTCIceServer[];
        setPhase((p) => (p === 'joining' ? 'waiting' : p));
        send({ type: 'media-state', audio: audioRef.current, video: videoRef.current });
        break;
      case 'peer-joined':
        setPeerPresent(true);
        void startOffer(false);
        send({ type: 'media-state', audio: audioRef.current, video: videoRef.current });
        break;
      case 'offer': setPeerPresent(true); void handleOffer(String(m.sdp), !!m.restart); break;
      case 'answer': void handleAnswer(String(m.sdp)); break;
      case 'candidate': void handleCandidate(m.candidate as RTCIceCandidateInit); break;
      case 'peer-left':
        setPeerPresent(false);
        closePc();
        setRemoteMedia({ audio: true, video: true });
        setPhase('waiting');
        break;
      case 'hangup': finish('peer'); break;
      case 'media-state': setRemoteMedia({ audio: m.audio !== false, video: m.video !== false }); break;
      case 'chat':
        msgId.current += 1;
        setMessages((l) => [...l, { id: msgId.current, mine: false, text: String(m.text ?? ''), at: Date.now() }]);
        if (!chatOpenRef.current) setUnread((n) => n + 1);
        break;
      case 'error':
        if (m.code === 'outside_window') {
          endedRef.current = true;
          sockRef.current?.close();
          setError({ code: 'outside_window', message: ERROR_COPY.outside_window });
          setPhase('error');
        }
        break;
    }
  }

  const join = useCallback(() => {
    if (sockRef.current) return;
    endedRef.current = false;
    joinedRef.current = false;
    setError(null);
    setPhase('joining');
    sockRef.current = openLiveSocket({
      url: () => wsUrl(`/ws/call/${appointmentId}/`, { jwt: localStorage.getItem('access_token') ?? '' }),
      onStatus: (s) => {
        setSignalling(s);
        if (s === 'closed' && !joinedRef.current && !endedRef.current && !failTimer.current) {
          // Never got a 'joined': likely offline or rejected. Give reconnect a few seconds, then say so.
          failTimer.current = setTimeout(() => {
            if (joinedRef.current || endedRef.current) return;
            endedRef.current = true;
            sockRef.current?.close();
            setError({ code: 'connect_failed', message: ERROR_COPY.connect_failed });
            setPhase('error');
          }, 8000);
        }
      },
      onMessage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // Keep the screen awake during a call (best effort; not supported everywhere).
  useEffect(() => {
    if (phase !== 'connected' || wakeLock.current) return;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock?.request('screen').then((l) => { wakeLock.current = l; }).catch(() => {});
  }, [phase]);

  // Leaving the page must free the camera and mic.
  useEffect(() => () => { finish(null); }, [finish]);

  const toggleAudio = useCallback(() => {
    const tracks = localRef.current?.getAudioTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach((t) => { t.enabled = next; });
    audioRef.current = next;
    setAudioOn(next);
    send({ type: 'media-state', audio: next, video: videoRef.current });
  }, [send]);

  const toggleVideo = useCallback(() => {
    const tracks = localRef.current?.getVideoTracks() ?? [];
    if (!tracks.length) return;
    const next = !tracks[0].enabled;
    tracks.forEach((t) => { t.enabled = next; });
    videoRef.current = next;
    setVideoOn(next);
    send({ type: 'media-state', audio: audioRef.current, video: next });
  }, [send]);

  const hangup = useCallback(() => { send({ type: 'hangup' }); finish('self'); }, [send, finish]);

  const sendChat = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    send({ type: 'chat', text: t });
    msgId.current += 1;
    setMessages((l) => [...l, { id: msgId.current, mine: true, text: t, at: Date.now() }]);
  }, [send]);

  const setChatOpen = useCallback((open: boolean) => {
    chatOpenRef.current = open;
    if (open) setUnread(0);
  }, []);

  return {
    phase, error, localStream, remoteStream, audioOn, videoOn, remoteMedia, peerPresent, everConnected,
    connectedAt, endedBy, messages, unread, mediaIssue, signalling,
    hasLocalVideo: !!localStream && localStream.getVideoTracks().length > 0,
    hasLocalAudio: !!localStream && localStream.getAudioTracks().length > 0,
    startMedia, stopPreview: stopLocal, join, toggleAudio, toggleVideo, hangup, sendChat, setChatOpen,
  };
}
