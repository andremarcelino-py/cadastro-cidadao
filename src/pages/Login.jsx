import { useState } from 'react';
import { toast } from 'sonner';
import { listLeaderTokens } from '../utils/tokens';
const ADMIN_TOKEN = 'Leo.22';

export default function Login({ onLogin }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token.trim()) {
      toast.error('Informe o token de acesso.');
      return;
    }

    setLoading(true);
    if (token.trim() === ADMIN_TOKEN) {
      onLogin({ role: 'admin', nome: 'Leo' });
      toast.success('Login de admin realizado.');
      setLoading(false);
      return;
    }

    try {
      const leaderTokens = await listLeaderTokens();
      const found = leaderTokens.find((item) => item.token === token.trim());

      if (found) {
        onLogin({ role: 'leader', nome: found.nome || 'Lider' });
        toast.success('Login de lider realizado.');
      } else {
        toast.error('Token invalido.');
      }
    } catch (err) {
      toast.error(err.message || 'Erro ao validar token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-2">Sistema</p>
        <h1 className="text-3xl font-bold text-white mb-2">Cadastro Cidadao</h1>
        <p className="text-slate-400 mb-6">Acesso por token (admin e lider).</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300 block mb-1">Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Digite o token"
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
