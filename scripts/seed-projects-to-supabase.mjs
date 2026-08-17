import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

loadEnvConfig(root);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(url, serviceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

const projectDir = path.join(root, 'data', 'projects');
const files = (await fs.readdir(projectDir))
    .filter((f) => f.endsWith('.json'))
    .sort();

if (!files.length) {
    throw new Error('No project JSON files found.');
}

const now = new Date().toISOString();

const rows = [];

for (const file of files) {
    const raw = await fs.readFile(path.join(projectDir, file), 'utf8');
    const p = JSON.parse(raw);

    const row = {
        slug: p.slug,
        title: p.title,
        short_description: p.tagline ?? '',
        description: p.description ?? '',
        category: p.category ?? 'AI & Engineering',
        status: p.status ?? 'in-progress',
        publish_state: p.publishState ?? 'published',
        featured: p.featured ?? false,
        display_order: p.order ?? 0,
        problem: p.problem ?? '',
        solution: p.solution ?? '',
        how_it_works: p.howItWorks ?? null,
        architecture: p.architecture ?? '',
        tech_stack: Array.isArray(p.techStack) ? p.techStack : [],
        cover_media: p.coverImage ?? null,
        demo_video: p.demoVideo ?? null,
        gallery_media: [
            ...(Array.isArray(p.screenshots) ? p.screenshots : []),
            ...(Array.isArray(p.gallery) ? p.gallery : []),
        ],
        links: p.links ?? {},
        learnings: Array.isArray(p.lessonsLearned)
            ? p.lessonsLearned
            : [],
        challenges: Array.isArray(p.challenges)
            ? p.challenges
            : [],
        future_improvements: Array.isArray(p.futureImprovements)
            ? p.futureImprovements
            : [],
        metrics: p.metrics ?? {},
        youtube_url: p.youtubeUrl ?? null,
        vimeo_url: p.vimeoUrl ?? null,

        // NEVER NULL
        started_at: p.startedAt || now,
        launched_at: p.launchedAt || null,
        updated_at: now,
    };

    rows.push(row);
}

console.log(`Found ${rows.length} project files.`);
console.log(`Migration timestamp: ${now}`);

for (const row of rows) {
    console.log(
        `${row.slug} -> updated_at=${row.updated_at}`
    );
}

console.log('Writing to Supabase...');

const { data, error } = await supabase
    .from('projects')
    .upsert(rows, {
        onConflict: 'slug',
    })
    .select('slug,title,publish_state,updated_at');

if (error) {
    console.error('Supabase insert failed:');
    console.error(error);
    process.exit(1);
}

console.log(`Successfully seeded ${data.length} projects.`);
console.table(data);