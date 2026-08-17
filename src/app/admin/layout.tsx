'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Image as ImageIcon,
  LogOut,
  Globe,
  Plus,
  ShieldCheck,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const adminNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login' || pathname === '/admin/setup') return <>{children}</>;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <div className="admin-shell">
      <div className="admin-ambient admin-ambient--one" aria-hidden="true" />
      <div className="admin-ambient admin-ambient--two" aria-hidden="true" />

      <aside className="admin-sidebar">
        <div>
          <Link href="/admin" className="admin-brand">
            <span className="admin-brand-mark">S.</span>
            <span>
              <strong>Surya.ai</strong>
              <small>
                <ShieldCheck className="size-3" /> Portfolio admin
              </small>
            </span>
          </Link>

          <nav className="admin-nav" aria-label="Admin navigation">
            <p className="admin-nav-label">Workspace</p>
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('admin-nav-link', isActive(item.href) && 'admin-nav-link--active')}
                >
                  <span>
                    <Icon className="size-4" />
                  </span>
                  {item.label}
                  <i />
                </Link>
              );
            })}
          </nav>

          <Link href="/admin/projects/new" className="admin-create-button">
            <Plus className="size-4" /> New project
          </Link>
        </div>

        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank">
            <Globe className="size-4" /> Public website <ExternalLink className="ml-auto size-3" />
          </Link>
          <button onClick={handleLogout}>
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <header className="admin-mobile-header">
        <Link href="/admin" className="admin-mobile-brand">
          S.<small>Admin</small>
        </Link>
        <nav aria-label="Mobile admin navigation">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(isActive(item.href) && 'active')}
                aria-label={item.label}
              >
                <Icon className="size-4" />
              </Link>
            );
          })}
          <Link href="/admin/projects/new" className="admin-mobile-add" aria-label="New project">
            <Plus className="size-4" />
          </Link>
        </nav>
      </header>

      <main className="admin-main">
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}
