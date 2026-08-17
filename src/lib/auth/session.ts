import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SECRET_KEY =
  process.env.ADMIN_SESSION_SECRET || 'surya-ai-admin-secret-key-32-chars-minimum-hash';
const key = new TextEncoder().encode(SECRET_KEY);
const ADMIN_CONFIG_PATH = join(process.cwd(), 'data', 'admin.json');

export interface SessionPayload {
  role: 'admin';
  iat?: number;
  exp?: number;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function isAdminInitialized(): boolean {
  if (process.env.ADMIN_PASSWORD_HASH) return true;
  if (existsSync(ADMIN_CONFIG_PATH)) {
    try {
      const data = JSON.parse(readFileSync(ADMIN_CONFIG_PATH, 'utf8'));
      return Boolean(data.passwordHash);
    } catch {
      return false;
    }
  }
  return false;
}

export function getAdminPasswordHash(): string | null {
  if (process.env.ADMIN_PASSWORD_HASH) return process.env.ADMIN_PASSWORD_HASH;
  if (existsSync(ADMIN_CONFIG_PATH)) {
    try {
      const data = JSON.parse(readFileSync(ADMIN_CONFIG_PATH, 'utf8'));
      return data.passwordHash || null;
    } catch {
      return null;
    }
  }
  return null;
}

export function setAdminPassword(password: string): boolean {
  const hash = bcrypt.hashSync(password, 10);
  try {
    writeFileSync(
      ADMIN_CONFIG_PATH,
      JSON.stringify({ passwordHash: hash, updatedAt: new Date().toISOString() }, null, 2),
      'utf8'
    );
    return true;
  } catch (err) {
    console.error('Failed to write admin config:', err);
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const hash = getAdminPasswordHash();
  if (!hash) return false;
  return bcrypt.compareSync(password, hash);
}

export async function createAdminSession(): Promise<void> {
  const token = await encrypt({ role: 'admin' });
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return decrypt(token);
}
