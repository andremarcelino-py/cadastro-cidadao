import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase, hasSupabaseConfig } from '../utils/supabase';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLeaderToken } from '../utils/tokens';

// Lista simplificada de Bairros (hard-coded conforme doc) 
const BAIRROS = ["Centro", "Jardim Santo Eduardo", "Jardim Independência", "Vazame", "Pinheirinho"];

export default function Home({ session, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bairros');
  const [novoLider, setNovoLider] = useState({ nome: '', token: '' });
  const [creatingLeader, setCreatingLeader] = useState(false);
  const isAdmin = session?.role === 'admin';

  // Busca todos os cidadãos (o RLS do Supabase fará o filtro de segurança automaticamente) [cite: 10]
  const { data: cidadaos = [] } = useQuery({
    queryKey: ['cidadaos'],
    enabled: !!supabase,
    queryFn: async () => {
      const { data, error } = await supabase.from('cidadaos').select('*');
      if (error) throw error;
      return data;
    }
  });

  const totalCadastros = cidadaos.length;
  const bairrosComCadastro = new Set(cidadaos.map(c => c.bairro)).size;

  const handleCreateLeader = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      toast.error('Somente o admin pode criar login de lider.');
      return;
    }

    if (!novoLider.nome.trim() || !novoLider.token.trim()) {
      toast.error('Preencha nome e token do lider.');
      return;
    }

    try {
      setCreatingLeader(true);
      const result = await createLeaderToken({
        nome: novoLider.nome.trim(),
        token: novoLider.token.trim()
      });
      toast.success(
        result.source === 'supabase'
          ? `Token do lider ${novoLider.nome.trim()} salvo no Supabase.`
          : `Token do lider ${novoLider.nome.trim()} salvo localmente.`
      );
      setNovoLider({ nome: '', token: '' });
    } catch (err) {
      toast.error(err.message || 'Erro ao criar lider.');
    } finally {
      setCreatingLeader(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-6 md:p-8 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">Painel</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">Cadastro Cidadao</h1>
              <p className="text-slate-400 mt-2">
                Embu das Artes - SP | {isAdmin ? 'Admin' : 'Lider'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              Sair
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:max-w-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-2xl font-bold text-white">{totalCadastros}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Cadastros</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-2xl font-bold text-white">{bairrosComCadastro}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Bairros com cadastro</p>
            </div>
          </div>
          {isAdmin && hasSupabaseConfig && (
            <p className="mt-4 text-sm text-amber-300 bg-amber-900/40 border border-amber-700 rounded px-3 py-2 inline-block">
              Sem Supabase: os tokens de lider serao salvos localmente neste navegador.
            </p>
          )}
        </div>
      </header>

      <div className="flex mb-4 border-b border-slate-800">
        <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'bairros' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400'}`}
          onClick={() => setActiveTab('bairros')}
        >
          Bairros
        </button>
        {isAdmin && (
          <button 
            className={`flex-1 py-2 font-semibold ${activeTab === 'lideres' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('lideres')}
          >
            Criar login de lider
          </button>
        )}
        {!isAdmin && (
          <button 
            className={`flex-1 py-2 font-semibold ${activeTab === 'perfil' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('perfil')}
          >
            Perfil
          </button>
        )}
        {isAdmin && (
          <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'perfil' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-slate-400'}`}
          onClick={() => setActiveTab('perfil')}
        >
          Perfil
          </button>
        )}
      </div>

      {activeTab === 'bairros' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BAIRROS.map(bairro => {
            const count = cidadaos.filter(c => c.bairro === bairro).length;
            const hasCadastros = count > 0;
            return (
              <div 
                key={bairro}
                onClick={() => navigate(`/cadastro-cidadao?bairro=${bairro}`)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  hasCadastros 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-700'
                    : 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
                }`}
              >
                <h3 className="font-bold text-sm truncate">{bairro}</h3>
                <p className={`text-xs ${hasCadastros ? 'opacity-90' : 'text-slate-400'}`}>
                  {count} cadastros
                </p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'lideres' && isAdmin && (
        <div className="max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white mb-1">Criar login para lider</h2>
          <p className="text-sm text-slate-400 mb-6">Sem e-mail: apenas nome e token para acesso do lider.</p>

          <form className="space-y-4" onSubmit={handleCreateLeader}>
            <input
              type="text"
              placeholder="Nome do lider"
              value={novoLider.nome}
              onChange={(e) => setNovoLider((prev) => ({ ...prev, nome: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="password"
              placeholder="Token do lider"
              value={novoLider.token}
              onChange={(e) => setNovoLider((prev) => ({ ...prev, token: e.target.value }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={creatingLeader}
              className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {creatingLeader ? 'Criando...' : 'Criar login do lider'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'perfil' && (
        <div className="max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">Perfil atual</h2>
          <p className="text-slate-300"><span className="text-slate-400">Tipo:</span> {isAdmin ? 'Admin' : 'Lider'}</p>
          <p className="text-slate-300"><span className="text-slate-400">Nome:</span> {session?.nome || '-'}</p>
        </div>
      )}
    </div>
  );
}