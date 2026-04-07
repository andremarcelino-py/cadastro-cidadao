import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const hasSupabaseConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('Sua URL do Supabase') ||
  supabaseAnonKey.includes('Sua chave anonima do Supabase');

export const supabase = hasSupabaseConfig
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);