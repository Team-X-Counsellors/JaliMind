import axios from 'axios';
import { API_URL } from '@/lib/ws';

/**
 * Anonymous chat client. Deliberately does NOT use the authenticated axios instance in api.ts:
 * no JWT is ever attached, so a logged-in student's identity can't leak into an anonymous chat.
 */
const http = axios.create({ baseURL: API_URL });

export type ShadowTopic = 'general' | 'academic' | 'anxiety' | 'relationships' | 'money' | 'urgent';
export type ShadowStatus = 'waiting' | 'active' | 'closed';

export interface ShadowMessage {
  id: number;
  sender: 'user' | 'counselor' | 'bot';
  content: string;
  created_at: string;
}

export interface CrisisResource { country: string; name: string; phone: string }

export interface StoredSession { session_id: string; token: string; pseudonym: string; expires_at?: string }

export interface SessionSnapshot {
  pseudonym: string;
  status: ShadowStatus;
  crisis_flagged: boolean;
  counselor_joined: boolean;
  messages: ShadowMessage[];
  crisis_resources: CrisisResource[] | null;
}

export const DEFAULT_CRISIS: CrisisResource[] = [
  { country: 'Kenya', name: 'Befrienders Kenya', phone: '+254 722 178 177' },
  { country: 'Nigeria', name: 'SURPIN', phone: '+234 806 210 6493' },
  { country: 'Ghana', name: 'Mental Health Authority', phone: '0800 111 222' },
  { country: 'South Africa', name: 'SADAG', phone: '0800 456 789' },
];

export const TOPICS: { key: ShadowTopic; label: string; hint: string }[] = [
  { key: 'urgent', label: 'I need help now', hint: 'Goes to the front of the line' },
  { key: 'anxiety', label: 'Anxiety or low mood', hint: 'Worry, sadness, feeling stuck' },
  { key: 'academic', label: 'School or exams', hint: 'Pressure, grades, burnout' },
  { key: 'relationships', label: 'Relationships or family', hint: 'Friends, partners, home' },
  { key: 'money', label: 'Money worries', hint: 'Fees, rent, food' },
  { key: 'general', label: 'Just need to talk', hint: 'No topic needed' },
];

const KEY = 'jalimind_shadow_session';

export const storage = {
  get(): StoredSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch { return null; }
  },
  set(s: StoredSession) { localStorage.setItem(KEY, JSON.stringify(s)); },
  clear() { localStorage.removeItem(KEY); },
};

const auth = (token: string) => ({ headers: { 'X-Shadow-Token': token } });

export async function startShadow(topic: ShadowTopic) {
  const { data } = await http.post('/api/shadow/start/', { topic });
  return data as StoredSession & { status: ShadowStatus; crisis_resources: CrisisResource[] };
}

export async function getShadow(id: string, token: string, after?: number) {
  const { data } = await http.get(`/api/shadow/session/${id}/`, {
    ...auth(token),
    params: after ? { after } : undefined,
  });
  return data as SessionSnapshot;
}

export async function sendShadow(id: string, token: string, content: string) {
  const { data } = await http.post(`/api/shadow/session/${id}/message/`, { content }, auth(token));
  return data as ShadowMessage;
}

export async function deleteShadow(id: string, token: string) {
  await http.delete(`/api/shadow/session/${id}/`, auth(token));
}

export function httpStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}
