import { getSiteSettings } from '@/lib/settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page-heading">
        <div>
          <span>Portfolio settings</span>
          <h1>Identity and links</h1>
          <p>Update public copy and contact channels without editing source files.</p>
        </div>
      </header>
      <SettingsForm initial={settings} />
    </div>
  );
}
