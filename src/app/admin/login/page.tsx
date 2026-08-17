'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.setupRequired) {
          router.push('/admin/setup');
          return;
        }
        throw new Error(data.error || 'Invalid password');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-scene">
      <div className="admin-auth-orbit admin-auth-orbit--one" aria-hidden="true" />
      <div className="admin-auth-orbit admin-auth-orbit--two" aria-hidden="true" />
      <div className="admin-auth-card">
        <Link href="/" className="admin-auth-back">
          <ArrowLeft className="size-3.5" /> Return to Surya.ai
        </Link>
        <div className="admin-auth-heading">
          <span className="admin-auth-mark">S.</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage projects, media, and public details.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-auth-label">Master Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6B6B66]" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-auth-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="admin-auth-submit">
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
