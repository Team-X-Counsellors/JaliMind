'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Memory {
  id: string;
  content: string;
  category: string;
  created_at: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  academic: 'Academic',
  emotional: 'Emotional',
  family: 'Family',
  career: 'Career',
  other: 'Other',
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/jalibot/memories/')
      .then(({ data }) => setMemories(data))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    setMemories((m) => m.filter((mem) => mem.id !== id));
    try {
      await api.delete(`/api/jalibot/memories/${id}/`);
    } catch {
      // if deletion failed, refetch to restore accurate state
      const { data } = await api.get('/api/jalibot/memories/');
      setMemories(data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display">Memories</h2>
        <p className="text-muted-foreground text-sm mt-1">
          JaliBot quietly remembers a few things you&apos;ve shared to make future conversations more
          relevant. You&apos;re always in control — delete anything below.
        </p>
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading memories…</p>}

      {!loading && memories.length === 0 && (
        <p className="text-muted-foreground text-sm">JaliBot hasn&apos;t remembered anything about you yet.</p>
      )}

      <div className="space-y-3">
        {memories.map((mem) => (
          <Card key={mem.id}>
            <CardContent className="pt-4 flex items-start justify-between gap-3">
              <div>
                <Badge variant="secondary" className="text-xs mb-2">
                  {CATEGORY_LABEL[mem.category] || mem.category}
                </Badge>
                <p className="text-sm">{mem.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(mem.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(mem.id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
