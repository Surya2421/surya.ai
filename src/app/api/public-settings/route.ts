import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/settings';

export async function GET() {
  return NextResponse.json({ settings: await getSiteSettings() });
}
