'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { usePeerCall } from '@/lib/webrtc';
import { fmtWhen } from '@/lib/counselor';
import CallMessage from '@/components/call/CallMessage';
import CallScreen from '@/components/call/CallScreen';
import PreJoin from '@/components/call/PreJoin';

interface ApptInfo {
  id: string; student_name: string; counselor_name: string | null; scheduled_at: string;
  duration_minutes: number; status: string; session_type: string;
}
type Load = { state: 'loading' } | { state: 'ok'; appt: ApptInfo } | { state: 'forbidden' } | { state: 'error' };

export default function CallPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [load, setLoad] = useState<Load>({ state: 'loading' });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/auth/login'); return; }
    // Appointments are scoped to their two participants, so a 404 here means "not yours".
    api.get(`/api/appointments/${id}/`)
      .then(({ data }) => setLoad({ state: 'ok', appt: data }))
      .catch((e) => setLoad({ state: (e?.response?.status === 404 || e?.response?.status === 403) ? 'forbidden' : 'error' }));
  }, [id, authLoading, isAuthenticated, router]);

  const appt = load.state === 'ok' ? load.appt : null;
  const isCounselor = user?.role === 'counselor';
  const otherName = (isCounselor ? appt?.student_name : appt?.counselor_name) || (isCounselor ? 'your student' : 'your counsellor');
  const wantsVideo = appt?.session_type === 'video';
  const call = usePeerCall(id, wantsVideo);

  const home = isCounselor ? '/counselor' : '/dashboard/appointments';
  const afterCall = isCounselor ? `/counselor/sessions?complete=${id}` : '/dashboard/appointments';

  if (authLoading || load.state === 'loading') return <CallMessage tone="loading" title="Getting your session ready…" />;
  if (load.state === 'forbidden') {
    return <CallMessage tone="blocked" title="This call is not for this account"
      body="Only the student and counsellor who booked this session can join. If you booked it, check you are signed in with the right account."
      actions={[{ label: 'Go back', href: home, primary: true }]} />;
  }
  if (load.state === 'error' || !appt) {
    return <CallMessage tone="offline" title="We could not load this session" body="Check your internet connection and try again."
      actions={[{ label: 'Try again', onClick: () => window.location.reload(), primary: true }, { label: 'Go back', href: home }]} />;
  }
  if (appt.session_type !== 'video' && appt.session_type !== 'voice') {
    return <CallMessage tone="text" title="This is a text session" body="There is no call for this booking. Your counsellor will message you in the chat."
      actions={[{ label: 'Go back', href: home, primary: true }]} />;
  }
  if (appt.status === 'pending') {
    return <CallMessage tone="early" title="Not confirmed yet"
      body={isCounselor ? 'Confirm this booking first, then you can open the call.' : 'Your counsellor has not confirmed this session yet. You will be able to join once they do.'}
      actions={[{ label: 'Go back', href: isCounselor ? '/counselor/sessions' : home, primary: true }]} />;
  }
  if (['cancelled', 'completed', 'no_show'].includes(appt.status)) {
    return <CallMessage tone="over" title={appt.status === 'cancelled' ? 'This session was cancelled' : 'This session is over'}
      actions={[{ label: 'Go back', href: home, primary: true }]} />;
  }

  if (call.phase === 'ended') {
    return <CallMessage tone="ended" title="Call ended"
      body={call.endedBy === 'peer' ? `${otherName} ended the call.` : isCounselor ? 'Add your session notes while it is fresh.' : 'Thank you for showing up for yourself today.'}
      actions={[
        { label: isCounselor ? 'Add notes and complete session' : 'Back to my appointments', href: afterCall, primary: true },
        { label: 'Rejoin the call', onClick: () => window.location.reload() },
      ]} />;
  }
  if (call.phase === 'error' && call.error) {
    const early = call.error.code === 'outside_window';
    return <CallMessage tone={early ? 'early' : 'offline'} title={early ? 'Too early to join' : 'Could not connect'} body={call.error.message}
      actions={[{ label: early ? 'Check again' : 'Try again', onClick: () => window.location.reload(), primary: true }, { label: 'Go back', href: home }]} />;
  }

  if (call.phase === 'idle') {
    return (
      <PreJoin
        otherName={otherName} when={fmtWhen(appt.scheduled_at)} wantsVideo={wantsVideo}
        stream={call.localStream} hasVideo={call.hasLocalVideo} hasAudio={call.hasLocalAudio}
        audioOn={call.audioOn} videoOn={call.videoOn} issue={call.mediaIssue}
        onEnable={call.startMedia} onToggleAudio={call.toggleAudio} onToggleVideo={call.toggleVideo} onJoin={call.join}
      />
    );
  }

  return (
    <CallScreen
      otherName={otherName} wantsVideo={wantsVideo} phase={call.phase} everConnected={call.everConnected}
      connectedAt={call.connectedAt} signalling={call.signalling} localStream={call.localStream} remoteStream={call.remoteStream}
      hasLocalAudio={call.hasLocalAudio} hasLocalVideo={call.hasLocalVideo} audioOn={call.audioOn} videoOn={call.videoOn}
      remoteMedia={call.remoteMedia} messages={call.messages} unread={call.unread}
      onToggleAudio={call.toggleAudio} onToggleVideo={call.toggleVideo} onHangup={call.hangup}
      onSendChat={call.sendChat} onChatOpen={call.setChatOpen}
    />
  );
}
