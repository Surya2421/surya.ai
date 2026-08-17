import Link from 'next/link';
import { getProjectsData } from '@/lib/projects';
import {
  FolderKanban,
  Sparkles,
  Radio,
  FileEdit,
  Plus,
  Image as ImageIcon,
  ArrowUpRight,
  Layers,
  Activity,
  Command,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const projects = await getProjectsData(true);
  const metrics = [
    { label: 'Total projects', value: projects.length, icon: FolderKanban, tone: 'coral' },
    {
      label: 'Live',
      value: projects.filter((p) => p.status === 'live').length,
      icon: Radio,
      tone: 'green',
    },
    {
      label: 'In progress',
      value: projects.filter((p) => p.status === 'in-progress').length,
      icon: Layers,
      tone: 'amber',
    },
    {
      label: 'Drafts',
      value: projects.filter((p) => p.publishState === 'draft').length,
      icon: FileEdit,
      tone: 'violet',
    },
    {
      label: 'Featured',
      value: projects.filter((p) => p.featured).length,
      icon: Sparkles,
      tone: 'coral',
    },
  ];

  return (
    <div className="admin-page admin-dashboard">
      <section className="admin-page-hero">
        <div>
          <p className="admin-kicker">
            <Activity className="size-3.5" /> Portfolio overview
          </p>
          <h1>Keep the work current.</h1>
          <p>Manage projects, media, publishing, and the story your portfolio tells.</p>
        </div>
        <div className="admin-command-chip">
          <Command className="size-4" />
          <span>Admin</span>
          <strong>Ready</strong>
          <i />
        </div>
      </section>

      <section className="admin-metrics" aria-label="Portfolio metrics">
        {metrics.map((metric, index) => (
          <article className={`admin-metric admin-metric--${metric.tone}`} key={metric.label}>
            <div className="admin-metric-top">
              <span>0{index + 1}</span>
              <metric.icon className="size-4" />
            </div>
            <strong>{metric.value}</strong>
            <p>{metric.label}</p>
          </article>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-section-block">
          <div className="admin-section-heading">
            <div>
              <span>Quick launch</span>
              <h2>What do you want to do?</h2>
            </div>
          </div>
          <div className="admin-actions-grid">
            <Link
              href="/admin/projects/new"
              className="admin-action-card admin-action-card--primary"
            >
              <span className="admin-action-icon">
                <Plus className="size-5" />
              </span>
              <div>
                <h3>Create a project</h3>
                <p>Publish a complete case study.</p>
              </div>
              <ArrowUpRight className="size-5" />
            </Link>
            <Link href="/admin/projects" className="admin-action-card">
              <span className="admin-action-icon">
                <FolderKanban className="size-5" />
              </span>
              <div>
                <h3>Manage projects</h3>
                <p>Edit, order, feature, or archive.</p>
              </div>
              <ArrowUpRight className="size-5" />
            </Link>
            <Link href="/admin/media" className="admin-action-card">
              <span className="admin-action-icon">
                <ImageIcon className="size-5" />
              </span>
              <div>
                <h3>Media library</h3>
                <p>Organize images and videos.</p>
              </div>
              <ArrowUpRight className="size-5" />
            </Link>
          </div>
        </div>

        <div className="admin-recent-panel">
          <div className="admin-panel-head">
            <div>
              <span>Recent activity</span>
              <h2>Projects</h2>
            </div>
            <Link href="/admin/projects">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="admin-project-list">
            {projects.slice(0, 5).map((project, index) => (
              <div className="admin-project-row" key={project.slug}>
                <span className="admin-project-index">0{index + 1}</span>
                <div className="admin-project-info">
                  <h3>{project.title}</h3>
                  <p>{project.tagline}</p>
                  <div>
                    {project.featured && <span>Featured</span>}
                    <span>{project.publishState}</span>
                  </div>
                </div>
                <Link href={`/admin/projects/${project.slug}/edit`}>
                  Edit <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
