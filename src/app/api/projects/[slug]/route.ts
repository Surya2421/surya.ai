import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { deleteProjectData, getProjectData, saveProjectData } from '@/lib/projects';
import { ProjectSchema } from '@/types/project';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const project = await getProjectData(slug, Boolean(await getAdminSession()));
    return project
      ? NextResponse.json({ project })
      : NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    console.error('Project read failed:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { slug } = await params;
    const parsed = ProjectSchema.safeParse({ ...(await req.json()), slug });
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    return NextResponse.json({ success: true, project: await saveProjectData(parsed.data) });
  } catch (error) {
    console.error('Project update failed:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const success = await deleteProjectData((await params).slug);
    return success
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    console.error('Project delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
