import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mediaType: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
  associatedProjectSlug?: string;
  createdAt: string;
}

const MEDIA_REGISTRY_PATH = join(process.cwd(), 'data', 'media.json');

export function getAllMedia(): MediaItem[] {
  if (!existsSync(MEDIA_REGISTRY_PATH)) return [];
  try {
    return JSON.parse(readFileSync(MEDIA_REGISTRY_PATH, 'utf8'));
  } catch {
    return [];
  }
}

export function saveMediaEntry(item: MediaItem): MediaItem {
  const items = getAllMedia();
  const updated = [item, ...items.filter((i) => i.id !== item.id)];
  writeFileSync(MEDIA_REGISTRY_PATH, JSON.stringify(updated, null, 2), 'utf8');
  return item;
}

export function deleteMediaEntry(id: string): boolean {
  const items = getAllMedia();
  const target = items.find((i) => i.id === id);
  if (!target) return false;

  // Attempt disk file removal if local
  if (target.url.startsWith('/uploads/')) {
    const localPath = join(process.cwd(), 'public', target.url);
    if (existsSync(localPath)) {
      try {
        unlinkSync(localPath);
      } catch (err) {
        console.error('Failed deleting media file from disk:', err);
      }
    }
  }

  const filtered = items.filter((i) => i.id !== id);
  writeFileSync(MEDIA_REGISTRY_PATH, JSON.stringify(filtered, null, 2), 'utf8');
  return true;
}
