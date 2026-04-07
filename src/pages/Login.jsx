import { useState } from 'react';
import { toast } from 'sonner';
import { supabase, hasSupabaseConfig } from '../utils/supabase';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !senha.trim()) {
      toast.error('Preencha e-mail e senha.');
      return;
    }

    if (email.trim() === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
      onLogin({
        role: 'admin',
        email: ADMIN_EMAIL
      });
      toast.success('Login de admin realizado.');
      return;
    }

    if (hasSupabaseConfig || !supabase) {
      toast.error('Configure o Supabase no .env para login de lider.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha
      });

      if (error) throw error;

      onLogin({
        role: 'leader',
        email: data.user?.email || email.trim(),
        userId: data.user?.id,
        nome: data.user?.user_metadata?.nome || ''
      });
      toast.success('Login de lider realizado.');
    } catch (err) {
      toast.error(err.message || 'Nao foi possivel fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-2">Sistema</p>
        <h1 className="text-3xl font-bold text-white mb-2">Cadastro Cidadao</h1>
        <p className="text-slate-400 mb-6">Entre como admin ou lider comunitario.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300 block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="admin@prefeitura.com"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 block mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
