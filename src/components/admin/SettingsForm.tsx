'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import type { SiteSettings } from '@/lib/settings';

const fields: Array<[keyof SiteSettings, string, string]> = [
  ['intro', 'Homepage introduction', 'One specific sentence about what you build.'],
  ['identity', 'Short identity', 'Your background in one line.'],
  ['availability', 'Availability note', 'Shown near the contact call to action.'],
  ['email', 'Email', 'Public contact email.'],
  ['linkedin', 'LinkedIn URL', 'Full profile URL.'],
  ['github', 'GitHub URL', 'Full profile URL.'],
  ['youtube', 'YouTube URL', 'Full channel URL.'],
  ['instagram', 'Instagram URL', 'Full profile URL.'],
];

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save settings');
      setForm(data.settings);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings-form">
      <div className="admin-settings-grid">
        {fields.map(([key, label, help]) => (
          <label
            key={key}
            className={
              key === 'intro' || key === 'availability'
                ? 'admin-field admin-field--wide'
                : 'admin-field'
            }
          >
            <span>{label}</span>
            <small>{help}</small>
            {key === 'intro' || key === 'availability' ? (
              <textarea
                rows={3}
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            ) : (
              <input
                type={key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            )}
          </label>
        ))}
      </div>
      <div className="admin-settings-actions">
        {error && <p className="admin-form-error">{error}</p>}
        {saved && (
          <p className="admin-form-success">
            <Check /> Saved
          </p>
        )}
        <button onClick={save} disabled={saving}>
          <Save /> {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
