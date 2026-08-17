import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdmin, getSupabasePublic } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/constants/site';

export type SiteSettings = {
  intro: string;
  availability: string;
  identity: string;
  email: string;
  github: string;
  linkedin: string;
  youtube: string;
  instagram: string;
};

export const defaultSiteSettings: SiteSettings = {
  intro:
    'I build useful things with AI—agents, automation, products, and experiments shaped around real work.',
  availability: 'Open to thoughtful collaborations and practical AI builds.',
  identity: 'ECE student and AI builder working from India.',
  email: siteConfig.author.email,
  github: siteConfig.links.github,
  linkedin: siteConfig.links.linkedin,
  youtube: siteConfig.links.youtube,
  instagram: siteConfig.links.instagram,
};

const localPath = path.join(process.cwd(), 'data', 'settings.json');

function clean(input: Partial<SiteSettings>): SiteSettings {
  return {
    intro: input.intro?.trim() || defaultSiteSettings.intro,
    availability: input.availability?.trim() || defaultSiteSettings.availability,
    identity: input.identity?.trim() || defaultSiteSettings.identity,
    email: input.email?.trim() || defaultSiteSettings.email,
    github: input.github?.trim() || defaultSiteSettings.github,
    linkedin: input.linkedin?.trim() || defaultSiteSettings.linkedin,
    youtube: input.youtube?.trim() || defaultSiteSettings.youtube,
    instagram: input.instagram?.trim() || defaultSiteSettings.instagram,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseAdmin() || getSupabasePublic();
  if (supabase) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'profile')
      .maybeSingle();
    if (!error && data?.value) return clean(data.value as Partial<SiteSettings>);
  }
  try {
    return clean(JSON.parse(await fs.readFile(localPath, 'utf8')) as Partial<SiteSettings>);
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const settings = clean(input);
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'profile', value: settings, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return settings;
  }
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
  return settings;
}
