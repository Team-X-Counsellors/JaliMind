'use client';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { errorText } from '@/lib/counselor';

interface Profile {
  bio: string; specialties: string[]; languages: string[]; years_experience: number;
  is_available: boolean; accepts_anonymous: boolean; rating: string; total_sessions: number;
}

const toList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [p, setP] = useState<Profile | null>(null);
  const [specialties, setSpecialties] = useState('');
  const [languages, setLanguages] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    api.get('/api/counselors/me/').then(({ data }) => {
      setP(data); setSpecialties((data.specialties ?? []).join(', ')); setLanguages((data.languages ?? []).join(', '));
    }).catch((e) => setMsg({ ok: false, text: errorText(e, 'Could not load your profile.') }));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p) return;
    setSaving(true); setMsg(null);
    try {
      const { data } = await api.patch('/api/counselors/me/', {
        bio: p.bio, years_experience: p.years_experience, accepts_anonymous: p.accepts_anonymous,
        specialties: toList(specialties), languages: toList(languages),
      });
      setP(data);
      setMsg({ ok: true, text: 'Saved.' });
    } catch (err) { setMsg({ ok: false, text: errorText(err) }); } finally { setSaving(false); }
  };

  if (!p) return <p className="py-16 text-center text-muted-foreground" role="status">{msg?.text ?? 'Loading…'}</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-night font-display text-2xl font-bold text-marigold">{(user?.first_name || user?.username || '?')[0].toUpperCase()}</span>
        <div>
          <h1 className="font-display text-2xl font-bold">{user?.first_name} {user?.last_name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email} · {p.total_sessions} sessions · rated {Number(p.rating) ? p.rating : 'n/a'}</p>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft sm:p-5">
        <label className="block text-sm font-medium">About you (students see this)
          <textarea value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} rows={5} className="mt-1.5 w-full rounded-xl border-2 border-input bg-card p-3 text-base" />
        </label>
        <label className="block text-sm font-medium">Specialties <span className="font-normal text-muted-foreground">(separate with commas)</span>
          <input value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="Anxiety, Academic stress" className="mt-1.5 h-12 w-full rounded-xl border-2 border-input bg-card px-4 text-base" />
        </label>
        <label className="block text-sm font-medium">Languages <span className="font-normal text-muted-foreground">(codes, e.g. en, sw, fr)</span>
          <input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="en, sw" className="mt-1.5 h-12 w-full rounded-xl border-2 border-input bg-card px-4 text-base" />
        </label>
        <label className="block text-sm font-medium">Years of experience
          <input type="number" min={0} max={60} value={p.years_experience} onChange={(e) => setP({ ...p, years_experience: Number(e.target.value) })} className="mt-1.5 h-12 w-full rounded-xl border-2 border-input bg-card px-4 text-base" />
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={p.accepts_anonymous} onChange={(e) => setP({ ...p, accepts_anonymous: e.target.checked })} className="mt-1 h-5 w-5 accent-[#8B4A3C]" />
          <span><b>I take anonymous chats.</b><span className="block text-muted-foreground">Students can reach you through the anonymous chat queue.</span></span>
        </label>
        {msg && <p role={msg.ok ? 'status' : 'alert'} className={`text-sm font-medium ${msg.ok ? 'text-[#0F6F63]' : 'text-destructive'}`}>{msg.text}</p>}
        <Button type="submit" variant="cta" className="w-full" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</Button>
      </form>

      <Button variant="outline" className="w-full" onClick={logout}><LogOut size={18} /> Sign out</Button>
    </div>
  );
}
