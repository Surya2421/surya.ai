import { NextRequest, NextResponse } from 'next/server';
import { isAdminInitialized, setAdminPassword, createAdminSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    if (isAdminInitialized()) {
      return NextResponse.json({ error: 'Admin is already set up' }, { status: 400 });
    }

    const { password } = await req.json();
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const success = setAdminPassword(password);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save admin password' }, { status: 500 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true, message: 'Admin setup completed successfully' });
  } catch (err) {
    console.error('Setup API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ initialized: isAdminInitialized() });
}
