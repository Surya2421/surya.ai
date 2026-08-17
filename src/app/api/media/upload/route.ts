import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminSession } from '@/lib/auth/session';
import { saveMediaEntry, type MediaItem } from '@/lib/media';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectSlug = (formData.get('projectSlug') as string | null)
      ?.replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase();
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isImage && !isVideo)
      return NextResponse.json({ error: 'Only images and videos are allowed' }, { status: 400 });
    const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const folder = projectSlug || 'general';
    const bytes = Buffer.from(await file.arrayBuffer());

    if (isSupabaseAdminConfigured) {
      const client = getSupabaseAdmin();
      if (!client) throw new Error('Supabase admin client unavailable');
      const storagePath = `${folder}/${cleanName}`;
      const uploaded = await client.storage
        .from('project-media')
        .upload(storagePath, bytes, { contentType: file.type, upsert: false });
      if (uploaded.error) throw new Error(uploaded.error.message);
      const publicUrl = client.storage.from('project-media').getPublicUrl(storagePath)
        .data.publicUrl;
      const inserted = await client
        .from('project_media')
        .insert({
          project_slug: projectSlug || null,
          filename: file.name,
          storage_path: storagePath,
          public_url: publicUrl,
          media_type: isVideo ? 'video' : 'image',
          mime_type: file.type,
          size_bytes: file.size,
        })
        .select('*')
        .single();
      if (inserted.error) {
        await client.storage.from('project-media').remove([storagePath]);
        throw new Error(inserted.error.message);
      }
      return NextResponse.json({
        success: true,
        media: {
          id: inserted.data.id,
          filename: inserted.data.filename,
          url: inserted.data.public_url,
          mediaType: inserted.data.media_type,
          mimeType: inserted.data.mime_type,
          sizeBytes: inserted.data.size_bytes,
          associatedProjectSlug: inserted.data.project_slug || undefined,
          createdAt: inserted.data.created_at,
        } satisfies MediaItem,
      });
    }

    const targetDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
    writeFileSync(join(targetDir, cleanName), bytes);
    const media: MediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      filename: file.name,
      url: `/uploads/${folder}/${cleanName}`,
      mediaType: isVideo ? 'video' : 'image',
      mimeType: file.type,
      sizeBytes: file.size,
      associatedProjectSlug: projectSlug || undefined,
      createdAt: new Date().toISOString(),
    };
    saveMediaEntry(media);
    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error('Media upload failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload media' },
      { status: 500 }
    );
  }
}
