'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Search,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import type { MediaItem } from '@/lib/media';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setMedia(data.media || []);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/media/upload', { method: 'POST', body });
        if (!response.ok) throw new Error((await response.json()).error || 'Upload failed');
      }
      await refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  const copy = async (item: MediaItem) => {
    await navigator.clipboard.writeText(
      item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`
    );
    setCopied(item.id);
    setTimeout(() => setCopied(null), 1600);
  };
  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete “${item.filename}”?`)) return;
    await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    });
    refresh();
  };
  const filtered = useMemo(
    () =>
      media.filter(
        (item) =>
          (filter === 'all' || item.mediaType === filter) &&
          (!query || item.filename.toLowerCase().includes(query.toLowerCase()))
      ),
    [media, filter, query]
  );
  return (
    <div className="admin-page admin-list-page admin-assets-page">
      <header className="admin-list-header">
        <div>
          <span>Asset inventory</span>
          <h1>Media library.</h1>
          <p>Upload, inspect, copy, and remove project images or video from one workspace.</p>
        </div>
        <label>
          <Upload />
          {uploading ? 'Uploading…' : 'Upload media'}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={upload}
            disabled={uploading}
          />
        </label>
      </header>
      <section className="admin-list-toolbar">
        <div>
          {['all', 'image', 'video'].map((item) => (
            <button
              key={item}
              className={filter === item ? 'is-active' : ''}
              onClick={() => setFilter(item)}
            >
              {item === 'all' ? 'All media' : `${item}s`}
            </button>
          ))}
        </div>
        <label>
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search filenames"
          />
        </label>
      </section>
      <div className="admin-list-meta">
        <span>{String(filtered.length).padStart(2, '0')} assets visible</span>
        <span>Supabase Storage when configured</span>
      </div>
      {loading ? (
        <div className="admin-list-empty">
          <i />
          <p>Loading assets…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-list-empty">
          <ImageIcon />
          <h2>No assets in this state.</h2>
          <p>Upload the first image or video using the control above.</p>
        </div>
      ) : (
        <section className="admin-assets-grid">
          {filtered.map((item) => (
            <article key={item.id}>
              <div className="admin-asset-preview">
                {item.mediaType === 'image' ? (
                  <img src={item.url} alt={item.filename} />
                ) : (
                  <>
                    <Video />
                    <span>Video asset</span>
                  </>
                )}
              </div>
              <div className="admin-asset-info">
                <div>
                  <h2 title={item.filename}>{item.filename}</h2>
                  <p>
                    {item.mediaType} / {Math.max(1, Math.round(item.sizeBytes / 1024))} KB
                  </p>
                </div>
                <div>
                  <button onClick={() => copy(item)}>
                    {copied === item.id ? <Check /> : <Copy />}
                    {copied === item.id ? 'Copied' : 'Copy URL'}
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer">
                    <ExternalLink />
                  </a>
                  <button onClick={() => remove(item)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
