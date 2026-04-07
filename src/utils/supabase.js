import { createClient } from '@supabase/supabase-js';

const env = process.env;
const supabaseUrl = env.REACT_APP_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  env.REACT_APP_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('Sua URL do Supabase') ||
  supabaseAnonKey.includes('Sua chave');

export const supabase = hasSupabaseConfig
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);