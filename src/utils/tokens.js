import { supabase } from './supabase';

const STORAGE_KEY = 'lider_tokens';

function readLocalTokens() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTokens(tokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export async function listLeaderTokens() {
  if (supabase) {
    const { data, error } = await supabase
      .from('lider_tokens')
      .select('nome, token')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) return data;
  }
  return readLocalTokens();
}

export async function createLeaderToken({ nome, token }) {
  if (supabase) {
    const { error } = await supabase
      .from('lider_tokens')
      .insert({ nome, token });
    if (!error) return { source: 'supabase' };
  }

  const current = readLocalTokens();
  const next = [{ nome, token }, ...current.filter((item) => item.token !== token)];
  saveLocalTokens(next);
  return { source: 'local' };
}

