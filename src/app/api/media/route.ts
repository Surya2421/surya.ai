import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { deleteMediaEntry, getAllMedia, type MediaItem } from '@/lib/media';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';

export async function GET() {
  if (!(await getAdminSession()))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSupabaseAdminConfigured) return NextResponse.json({ media: getAllMedia() });
  const client = getSupabaseAdmin();
  if (!client) return NextResponse.json({ media: [] });
  const { data, error } = await client
    .from('project_media')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const media: MediaItem[] = (data || []).map((item) => ({
    id: item.id,
    filename: item.filename,
    url: item.public_url,
    mediaType: item.media_type,
    mimeType: item.mime_type,
    sizeBytes: item.size_bytes,
    associatedProjectSlug: item.project_slug || undefined,
    createdAt: item.created_at,
  }));
  return NextResponse.json({ media });
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    if (!isSupabaseAdminConfigured)
      return deleteMediaEntry(id)
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    const client = getSupabaseAdmin();
    if (!client) throw new Error('Supabase admin client unavailable');
    const { data, error } = await client
      .from('project_media')
      .select('storage_path')
      .eq('id', id)
      .single();
    if (error || !data)
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    const removed = await client.storage.from('project-media').remove([data.storage_path]);
    if (removed.error) throw new Error(removed.error.message);
    const deleted = await client.from('project_media').delete().eq('id', id);
    if (deleted.error) throw new Error(deleted.error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete media' },
      { status: 500 }
    );
  }
}
