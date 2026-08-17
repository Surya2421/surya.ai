import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';
import { getProjectsData, saveProjectData } from '@/lib/projects';
import { ProjectSchema } from '@/types/project';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    let projects = await getProjectsData(Boolean(session));
    const status = req.nextUrl.searchParams.get('status');
    const featured = req.nextUrl.searchParams.get('featured');
    if (status && status !== 'all')
      projects = projects.filter(
        (project) => project.status === status || project.publishState === status
      );
    if (featured === 'true') projects = projects.filter((project) => project.featured);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Project read failed:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await getAdminSession()))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const parsed = ProjectSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    const project = await saveProjectData(parsed.data);
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('Project create failed:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
