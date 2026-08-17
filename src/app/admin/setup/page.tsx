'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/setup')
      .then((res) => res.json())
      .then((data) => (data.initialized ? router.replace('/admin/login') : setChecking(false)))
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to setup admin');
      router.push('/admin');
      router.refresh();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="admin-auth-scene">
        <div className="admin-auth-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-auth-scene">
      <div className="admin-auth-orbit admin-auth-orbit--one" aria-hidden="true" />
      <div className="admin-auth-orbit admin-auth-orbit--two" aria-hidden="true" />
      <div className="admin-auth-card">
        <div className="admin-auth-heading">
          <span className="admin-auth-mark">
            <ShieldCheck className="size-5" />
          </span>
          <h1>Secure the admin.</h1>
          <p>Set your master password to protect the Surya.ai admin workspace.</p>
        </div>

        {error && (
          <div className="admin-auth-error">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="admin-auth-label">Admin password</label>
            <div className="relative">
              <Lock className="admin-auth-field-icon size-4" />
              <input
                type="password"
                required
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-auth-input"
              />
            </div>
          </div>
          <div>
            <label className="admin-auth-label">Confirm password</label>
            <div className="relative">
              <Lock className="admin-auth-field-icon size-4" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="admin-auth-input"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="admin-auth-submit">
            {loading ? 'Setting up...' : 'Save password & enter'}
            {!loading && <ArrowRight className="size-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
