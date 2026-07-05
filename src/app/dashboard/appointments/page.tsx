'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Appointment {
  id: string;
  counselor_name: string;
  scheduled_at: string;
  status: string;
  session_type: string;
  duration_minutes: number;
  meeting_link?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  confirmed: 'bg-accent/20 text-accent-foreground',
  in_progress: 'bg-primary/20 text-primary',
  completed: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-destructive/20 text-destructive',
  no_show: 'bg-destructive/10 text-destructive/70',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/appointments/')
      .then(({ data }) => setAppointments(data.results ?? data))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter((a) => !['pending', 'confirmed'].includes(a.status));

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const AppointmentCard = ({ a }: { a: Appointment }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{a.counselor_name || 'Counselor'}</CardTitle>
          <Badge className={`text-xs capitalize ${STATUS_COLORS[a.status] ?? ''}`}>{a.status.replace('_', ' ')}</Badge>
        </div>
        <CardDescription>{fmtDate(a.scheduled_at)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground capitalize">
          {a.session_type} · {a.duration_minutes} min
        </p>
        {a.meeting_link && a.status === 'confirmed' && (
          <a href={a.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 block">
            Join session →
          </a>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display">Appointments</h2>
        <p className="text-muted-foreground text-sm">Your upcoming and past counseling sessions</p>
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading appointments…</p>}

      {!loading && (
        <>
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments. <a href="/dashboard/counselors" className="text-primary hover:underline">Book one now</a>.</p>
            ) : upcoming.map((a) => <AppointmentCard key={a.id} a={a} />)}
          </section>

          {past.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Past</h3>
              {past.map((a) => <AppointmentCard key={a.id} a={a} />)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
