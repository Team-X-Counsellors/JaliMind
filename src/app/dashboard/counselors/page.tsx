'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Counselor {
  id: string;
  user: { first_name: string; last_name: string; email: string };
  bio: string;
  specialties: string[];
  languages: string[];
  rating: string;
  total_sessions: number;
  is_available: boolean;
  accepts_anonymous: boolean;
}

interface BookingForm {
  counselorId: string;
  scheduled_at: string;
  session_type: string;
  notes: string;
}

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingForm | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/api/counselors/')
      .then(({ data }) => setCounselors(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  const openBook = (id: string) =>
    setBooking({ counselorId: id, scheduled_at: '', session_type: 'video', notes: '' });

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setSubmitting(true);
    try {
      await api.post(`/api/counselors/${booking.counselorId}/book/`, {
        scheduled_at: booking.scheduled_at,
        session_type: booking.session_type,
        notes: booking.notes,
      });
      setSuccess('Appointment booked! Check your appointments page.');
      setBooking(null);
    } catch {
      alert('Booking failed. Please choose a different time.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display">Find a Counselor</h2>
        <p className="text-muted-foreground text-sm">Connect with certified student counselors</p>
      </div>

      {success && (
        <div className="rounded-md bg-accent/10 border border-accent/30 px-4 py-3 text-sm text-accent-foreground">
          {success}
        </div>
      )}

      {loading && <p className="text-muted-foreground text-sm">Loading counselors…</p>}

      <div className="grid grid-cols-1 gap-4">
        {counselors.map((c) => {
          const name = `${c.user.first_name} ${c.user.last_name}`.trim() || 'Counselor';
          const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          return (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{name}</CardTitle>
                      {c.is_available && <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">Available</Badge>}
                      {c.accepts_anonymous && <Badge variant="outline" className="text-xs">Anon OK</Badge>}
                    </div>
                    <CardDescription className="mt-1">{c.bio}</CardDescription>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">★ {parseFloat(c.rating).toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">{c.total_sessions} sessions</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {c.specialties.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>
                )}
                {c.languages?.length > 0 && (
                  <p className="text-xs text-muted-foreground">Speaks: {c.languages.join(', ')}</p>
                )}
                <Button size="sm" onClick={() => openBook(c.id)} disabled={!c.is_available}>
                  {c.is_available ? 'Book session' : 'Unavailable'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {!loading && counselors.length === 0 && (
          <p className="text-muted-foreground text-sm">No counselors available at this time.</p>
        )}
      </div>

      {booking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-display">Book a session</CardTitle>
              <CardDescription>Choose your preferred date, time and format</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitBooking} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Date & time</label>
                  <input
                    type="datetime-local"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={booking.scheduled_at}
                    onChange={(e) => setBooking({ ...booking, scheduled_at: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Session type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={booking.session_type}
                    onChange={(e) => setBooking({ ...booking, session_type: e.target.value })}
                  >
                    <option value="video">Video</option>
                    <option value="text">Text / Chat</option>
                    <option value="voice">Voice</option>
                    <option value="anonymous">Anonymous</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Notes (optional)</label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none min-h-[80px]"
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    placeholder="Anything you'd like the counselor to know beforehand"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setBooking(null)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Booking…' : 'Confirm booking'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
