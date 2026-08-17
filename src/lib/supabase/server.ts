import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabasePublicConfigured = Boolean(supabaseUrl && publicKey);
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && secretKey);

export function getSupabasePublic() {
  if (!isSupabasePublicConfigured) return null;
  return createClient(supabaseUrl, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseAdmin() {
  if (!isSupabaseAdminConfigured) return null;
  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
