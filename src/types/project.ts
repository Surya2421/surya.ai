import { z } from 'zod';

export const TechStackItemSchema = z.object({
  name: z.string(),
  category: z.enum(['frontend', 'backend', 'ai', 'devops', 'design']),
  icon: z.string().optional(),
});

export const DemoVideoSchema = z.object({
  poster: z.string().optional(),
  webm: z.string().optional(),
  mp4: z.string().optional(),
  autoplay: z.boolean().default(true),
  loop: z.boolean().default(true),
  muted: z.boolean().default(true),
});

export const ScreenshotSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const LinksSchema = z.object({
  github: z.string().url().or(z.string().length(0)).optional(),
  live: z.string().url().or(z.string().length(0)).optional(),
  caseStudy: z.string().url().or(z.string().length(0)).optional(),
  demo: z.string().url().or(z.string().length(0)).optional(),
});

export const MetricsSchema = z.object({
  users: z.number().optional(),
  revenue: z.number().optional(),
  processingTime: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.string().optional().default('AI & Engineering'),
  status: z.enum(['live', 'beta', 'archived', 'in-progress']),
  publishState: z.enum(['draft', 'published', 'archived']).default('published'),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  problem: z.string(),
  solution: z.string(),
  howItWorks: z.string().optional(),
  architecture: z.string(),
  techStack: z.array(TechStackItemSchema).default([]),
  coverImage: z.string().optional(),
  demoVideo: DemoVideoSchema.optional(),
  youtubeUrl: z.string().optional(),
  vimeoUrl: z.string().optional(),
  screenshots: z.array(ScreenshotSchema).default([]),
  gallery: z.array(ScreenshotSchema).optional(),
  links: LinksSchema.default({}),
  lessonsLearned: z.array(z.string()).default([]),
  challenges: z.array(z.string()).optional(),
  futureImprovements: z.array(z.string()).optional(),
  startedAt: z.string(),
  launchedAt: z.string().nullable().optional(),
  lastUpdated: z.string().optional(),
  metrics: MetricsSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type TechStackItem = z.infer<typeof TechStackItemSchema>;
export type DemoVideo = z.infer<typeof DemoVideoSchema>;
export type Screenshot = z.infer<typeof ScreenshotSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type Metrics = z.infer<typeof MetricsSchema>;
