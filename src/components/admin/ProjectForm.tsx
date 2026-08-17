'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import type { Project, TechStackItem, Screenshot } from '@/types/project';

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'AI & Engineering');
  const [status, setStatus] = useState<Project['status']>(initialData?.status || 'in-progress');
  const [publishState, setPublishState] = useState<Project['publishState']>(
    initialData?.publishState || 'published'
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [order, setOrder] = useState(initialData?.order || 0);

  // Content Sections
  const [problem, setProblem] = useState(initialData?.problem || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [howItWorks, setHowItWorks] = useState(initialData?.howItWorks || '');
  const [architecture, setArchitecture] = useState(initialData?.architecture || '');

  // Media
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [demoMp4, setDemoMp4] = useState(initialData?.demoVideo?.mp4 || '');
  const [demoPoster, setDemoPoster] = useState(initialData?.demoVideo?.poster || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
  const [vimeoUrl, setVimeoUrl] = useState(initialData?.vimeoUrl || '');

  // Arrays
  const [techStack, setTechStack] = useState<TechStackItem[]>(initialData?.techStack || []);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(initialData?.screenshots || []);
  const [lessonsLearned, setLessonsLearned] = useState<string[]>(initialData?.lessonsLearned || []);
  const [challenges, setChallenges] = useState<string[]>(initialData?.challenges || []);
  const [futureImprovements, setFutureImprovements] = useState<string[]>(
    initialData?.futureImprovements || []
  );

  // Links
  const [githubLink, setGithubLink] = useState(initialData?.links?.github || '');
  const [liveLink, setLiveLink] = useState(initialData?.links?.live || '');
  const [caseStudyLink, setCaseStudyLink] = useState(initialData?.links?.caseStudy || '');

  // Tech stack item input helper
  const [newTechName, setNewTechName] = useState('');
  const [newTechCategory, setNewTechCategory] = useState<TechStackItem['category']>('ai');

  // Lesson / Challenge / Future bullet helpers
  const [newLesson, setNewLesson] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newFuture, setNewFuture] = useState('');

  // Auto slug generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  // Image Upload helper
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'cover' | 'screenshot'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (slug) formData.append('projectSlug', slug);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (target === 'cover') {
        setCoverImage(data.media.url);
      } else {
        setScreenshots((prev) => [...prev, { src: data.media.url, alt: file.name }]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    }
  };

  // Add items
  const addTechStackItem = () => {
    if (!newTechName.trim()) return;
    setTechStack([...techStack, { name: newTechName.trim(), category: newTechCategory }]);
    setNewTechName('');
  };

  const addLesson = () => {
    if (!newLesson.trim()) return;
    setLessonsLearned([...lessonsLearned, newLesson.trim()]);
    setNewLesson('');
  };

  const addChallenge = () => {
    if (!newChallenge.trim()) return;
    setChallenges([...challenges, newChallenge.trim()]);
    setNewChallenge('');
  };

  const addFuture = () => {
    if (!newFuture.trim()) return;
    setFutureImprovements([...futureImprovements, newFuture.trim()]);
    setNewFuture('');
  };

  // Form Submission
  const handleSubmit = async (overrideState?: Project['publishState']) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const targetPublishState = overrideState || publishState;

    const projectPayload: Partial<Project> & { slug: string; title: string } = {
      slug,
      title,
      tagline,
      description,
      category,
      status,
      publishState: targetPublishState,
      featured,
      order: Number(order),
      problem,
      solution,
      howItWorks,
      architecture,
      techStack,
      coverImage,
      demoVideo:
        demoMp4 || demoPoster
          ? { mp4: demoMp4, poster: demoPoster, autoplay: true, loop: true, muted: true }
          : undefined,
      youtubeUrl,
      vimeoUrl,
      screenshots,
      links: {
        github: githubLink || undefined,
        live: liveLink || undefined,
        caseStudy: caseStudyLink || undefined,
      },
      lessonsLearned,
      challenges,
      futureImprovements,
      startedAt: initialData?.startedAt || new Date().toISOString(),
      launchedAt: status === 'live' ? initialData?.launchedAt || new Date().toISOString() : null,
    };

    try {
      const endpoint = isEditing ? `/api/projects/${initialData?.slug}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      setSuccess(`Project saved successfully as ${targetPublishState}`);
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page admin-form-page space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-2 text-[#A8A8A3] transition-colors hover:text-[#F5F5F3]"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-2xl font-light tracking-tight text-[#F5F5F3]">
              {isEditing ? `Edit "${title || 'Project'}"` : 'Create New Project'}
            </h1>
            <p className="mt-0.5 text-xs text-[#A8A8A3]">
              Fill out project information, media assets, and case study narrative.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {slug && (
            <button
              type="button"
              onClick={() => window.open(`/projects/${slug}`, '_blank')}
              className="flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#141414] px-4 py-2.5 text-sm font-medium text-[#A8A8A3] transition-colors hover:text-[#F5F5F3]"
            >
              <Eye className="size-4" /> Preview
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-[#F5F5F3] transition-colors hover:bg-[#222]"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#FF6B4A] px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#FF8266] disabled:opacity-50"
          >
            <Save className="size-4" /> {loading ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <Check className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Form Body */}
        <div className="space-y-8 lg:col-span-2">
          {/* Essential Info Panel */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Essential Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Personal Content Engine"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ai-personal-content-engine"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Short Tagline / Subtitle *
              </label>
              <input
                type="text"
                required
                placeholder="End-to-end content operating system..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Long Overview Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detailed summary of what the project does, key features, and background context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-y rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Category *
              </label>
              <input
                type="text"
                required
                placeholder="AI agents, automation, computer vision…"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Narrative Case Study Panel */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Case Study Narrative
            </h2>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                The Problem / Challenge *
              </label>
              <textarea
                rows={3}
                required
                placeholder="What pain point or gap does this project address?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full resize-y rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                The Solution / Approach *
              </label>
              <textarea
                rows={3}
                required
                placeholder="How does this project solve the problem?"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full resize-y rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                How It Works (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Step-by-step walkthrough of user flow or core pipeline..."
                value={howItWorks}
                onChange={(e) => setHowItWorks(e.target.value)}
                className="w-full resize-y rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                System Architecture *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Technical architecture details (e.g., IoT Edge -> MQTT -> Next.js)..."
                value={architecture}
                onChange={(e) => setArchitecture(e.target.value)}
                className="w-full resize-y rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2.5 font-mono text-sm text-xs text-[#F5F5F3] placeholder:text-[#6B6B66] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Tech Stack Builder */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Technology Stack
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Tech name (e.g. Next.js 15, YOLOv8)"
                value={newTechName}
                onChange={(e) => setNewTechName(e.target.value)}
                className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
              <select
                value={newTechCategory}
                onChange={(e) => setNewTechCategory(e.target.value as TechStackItem['category'])}
                className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              >
                <option value="ai">AI</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
              </select>
              <button
                type="button"
                onClick={addTechStackItem}
                className="flex items-center gap-1 rounded-xl bg-[rgba(255,107,74,0.15)] px-4 py-2 text-sm font-semibold text-[#FF6B4A] transition-colors hover:bg-[rgba(255,107,74,0.25)]"
              >
                <Plus className="size-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-1.5 text-xs text-[#F5F5F3]"
                >
                  <span className="text-[0.6rem] font-semibold text-[#FF6B4A] uppercase">
                    {tech.category}
                  </span>
                  <span>{tech.name}</span>
                  <button
                    type="button"
                    onClick={() => setTechStack(techStack.filter((_, i) => i !== idx))}
                    className="text-[#6B6B66] hover:text-rose-400"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Key Learnings & Challenges */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Learnings & Challenges
            </h2>

            {/* Lessons */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Key Learnings
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a key takeaway or insight..."
                  value={newLesson}
                  onChange={(e) => setNewLesson(e.target.value)}
                  className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addLesson}
                  className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] hover:bg-[#222]"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {lessonsLearned.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-[#1A1A1A] p-3 text-xs text-[#A8A8A3]"
                  >
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => setLessonsLearned(lessonsLearned.filter((_, i) => i !== idx))}
                      className="ml-2 text-[#6B6B66] hover:text-rose-400"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Challenges
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a challenge…"
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addChallenge}
                  className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {challenges.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-[#1A1A1A] p-3 text-xs text-[#A8A8A3]"
                  >
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Future improvements
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a next step…"
                  value={newFuture}
                  onChange={(e) => setNewFuture(e.target.value)}
                  className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addFuture}
                  className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {futureImprovements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-[#1A1A1A] p-3 text-xs text-[#A8A8A3]"
                  >
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFutureImprovements(futureImprovements.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Panel */}
        <div className="space-y-8">
          {/* Status & Visibility */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Status & Visibility
            </h2>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Development Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Project['status'])}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2.5 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              >
                <option value="live">Live</option>
                <option value="beta">Beta</option>
                <option value="in-progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Publish State
              </label>
              <select
                value={publishState}
                onChange={(e) => setPublishState(e.target.value as Project['publishState'])}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2.5 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Draft (Admin Only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Featured Project
              </span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-5 cursor-pointer rounded accent-[#FF6B4A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
          </div>

          {/* Media Assets */}
          <div className="space-y-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Media Assets
            </h2>

            {/* Cover Image */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Cover Image
              </label>
              <div className="space-y-3">
                {coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#1A1A1A]">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="/images/projects/cover.webp"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
                  />
                  <label className="flex cursor-pointer items-center gap-1 rounded-xl bg-[rgba(255,107,74,0.15)] px-3 py-2 text-xs font-semibold text-[#FF6B4A] hover:bg-[rgba(255,107,74,0.25)]">
                    <Upload className="size-3" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'cover')}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Demo Video */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Demo Video MP4 URL
              </label>
              <input
                type="text"
                placeholder="/videos/projects/demo.mp4"
                value={demoMp4}
                onChange={(e) => setDemoMp4(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Video poster URL
              </label>
              <input
                type="text"
                placeholder="/images/projects/video-poster.webp"
                value={demoPoster}
                onChange={(e) => setDemoPoster(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                YouTube URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=…"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Vimeo URL
              </label>
              <input
                type="url"
                placeholder="https://vimeo.com/…"
                value={vimeoUrl}
                onChange={(e) => setVimeoUrl(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Screenshots
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[rgba(255,107,74,0.15)] px-3 py-2 text-xs font-semibold text-[#FF6B4A]">
                <ImageIcon className="size-3" /> Add screenshot
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'screenshot')}
                />
              </label>
              <div className="space-y-2">
                {screenshots.map((shot, idx) => (
                  <div
                    key={`${shot.src}-${idx}`}
                    className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] p-2"
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="size-12 rounded-lg object-cover"
                    />
                    <input
                      value={shot.alt}
                      onChange={(e) =>
                        setScreenshots(
                          screenshots.map((item, i) =>
                            i === idx ? { ...item, alt: e.target.value } : item
                          )
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshots(screenshots.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#141414] p-6">
            <h2 className="border-b border-[rgba(255,255,255,0.06)] pb-3 text-base font-medium text-[#F5F5F3]">
              Project Links
            </h2>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/Surya2421/..."
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Live URL
              </label>
              <input
                type="url"
                placeholder="https://project.surya.ai"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wider text-[#6B6B66] uppercase">
                Case Study URL
              </label>
              <input
                type="url"
                placeholder="https://surya.ai/content/..."
                value={caseStudyLink}
                onChange={(e) => setCaseStudyLink(e.target.value)}
                className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#FF6B4A] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
