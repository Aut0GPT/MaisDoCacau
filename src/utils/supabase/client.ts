import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a client-side Supabase client
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

// For backward compatibility
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
