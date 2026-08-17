import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession, isAdminInitialized } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    if (!isAdminInitialized()) {
      return NextResponse.json(
        { error: 'Admin setup required', setupRequired: true },
        { status: 400 }
      );
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
