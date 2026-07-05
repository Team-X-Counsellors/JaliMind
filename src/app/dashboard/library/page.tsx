'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  tags: string[];
  language: string;
  content_url: string;
  view_count: number;
}

const TYPE_ICONS: Record<string, string> = {
  article: '⊟', video: '▶', audio: '◉', workbook: '⊞', infographic: '⊠',
};

export default function LibraryPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/library/')
      .then(({ data }) => {
        const items = data.results ?? data;
        setResources(items);
        setFiltered(items);
      })
      .catch(() => setError('Failed to load resources.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(resources.filter((r) =>
      r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q) || r.tags?.some((t) => t.toLowerCase().includes(q))
    ));
  }, [search, resources]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold font-display">Jali Library</h2>
        <p className="text-muted-foreground text-sm">Curated mental health & guidance resources</p>
      </div>

      <Input
        placeholder="Search resources…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading && <p className="text-muted-foreground text-sm">Loading resources…</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && filtered.length === 0 && !error && (
        <p className="text-muted-foreground text-sm">No resources found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <a key={r.id} href={r.content_url} target="_blank" rel="noopener noreferrer">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xl">{TYPE_ICONS[r.resource_type] ?? '⊟'}</span>
                  <Badge variant="outline" className="text-xs capitalize">{r.resource_type}</Badge>
                </div>
                <CardTitle className="text-base mt-2">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">{r.description}</CardDescription>
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {r.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
