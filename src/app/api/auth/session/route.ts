import { NextResponse } from 'next/server';
import { getAdminSession, isAdminInitialized } from '@/lib/auth/session';

export async function GET() {
  const initialized = isAdminInitialized();
  const session = await getAdminSession();

  return NextResponse.json({
    initialized,
    authenticated: Boolean(session),
  });
}
