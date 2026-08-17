import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { duplicateProjectData } from '@/lib/projects';

interface RouteParams {
  params: Promise<{ slug: string }>;
}
export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const project = await duplicateProjectData((await params).slug);
    return project
      ? NextResponse.json({ success: true, project })
      : NextResponse.json({ error: 'Original project not found' }, { status: 404 });
  } catch (error) {
    console.error('Project duplication failed:', error);
    return NextResponse.json({ error: 'Failed to duplicate project' }, { status: 500 });
  }
}
