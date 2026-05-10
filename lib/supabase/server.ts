import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  client = createClient(supabaseUrl, supabaseKey);
  return client;
}

export function getSupabase(): SupabaseClient | null {
  return getSupabaseClient();
}
