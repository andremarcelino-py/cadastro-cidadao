import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { createLeaderToken } from '../utils/tokens';

const BAIRROS = [
  'Centro', 'Jardim Santo Eduardo', 'Jardim Independencia', 'Vila Regina', 'Santa Tereza',
  'Sao Marcos', 'Santo Antonio', 'Vazame', 'Casa Branca', 'Mimoso',
  'Jardim Silvia', 'Jardim Arabutan', 'Jardim Santa Clara', 'Jardim Magali',
  'Jardim Dom Jose', 'Parque Pirajussara', 'Parque Esplanada', 'Jardim Santa Emilia',
  'Jardim Vista Alegre', 'Jardim Pinheirinho', 'Jardim das Oliveiras', 'Capuava',
  'Itatuba', 'Ressaca', 'Valo Verde', 'Jardim Sao Luiz'
];

export default function Home({ session, onLogout }) {
  const navigate = useNavigate();
  const isLeader = session?.funcao === 'lider';
  const isAdmin = session?.funcao === 'admin';
  const [leaderFilter, setLeaderFilter] = useState('');
  const [bairroFilter, setBairroFilter] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderToken, setNewLeaderToken] = useState('');
  const [creatingLeader, setCreatingLeader] = useState(false);

  const { data: cidadaos = [] } = useQuery({
    queryKey: ['cidadaos'],
    enabled: !!supabase && !!session?.userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('cidadaos').select('*');
      if (error) throw error;
      return data;
    }
  });

  const leaderTokensQuery = useQuery({
    queryKey: ['leader_tokens'],
    enabled: isAdmin && !!supabase,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lider_tokens')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const leaderTokens = leaderTokensQuery.data || [];
  const leaderCounts = leaderTokens.map((leader) => ({
    ...leader,
    count: cidadaos.filter((c) => c.lider_uid === leader.token).length
  }));
  const sortedRanking = [...leaderCounts].sort((a, b) => b.count - a.count);
  const leaderByToken = Object.fromEntries(leaderTokens.map((leader) => [leader.token, leader.nome]));
  const filteredVoters = cidadaos
    .filter((c) => (leaderFilter ? c.lider_uid === leaderFilter : true))
    .filter((c) => (bairroFilter ? c.bairro === bairroFilter : true));
  const uniqueBairros = [...new Set(cidadaos.map((c) => c.bairro).filter(Boolean))];

  const totalCadastros = cidadaos.length;
  const totalLeaders = leaderTokens.length;
  const bairrosComCadastro = new Set(cidadaos.map((c) => c.bairro)).size;

  const handleCreateLeader = async (event) => {
    event.preventDefault();

    if (!newLeaderName.trim() || !newLeaderToken.trim()) {
      alert('Preencha nome e token do líder.');
      return;
    }

    try {
      setCreatingLeader(true);
      await createLeaderToken({ nome: newLeaderName.trim(), token: newLeaderToken.trim() });
      setNewLeaderName('');
      setNewLeaderToken('');
      leaderTokensQuery.refetch();
      alert('Líder criado com sucesso.');
    } catch (error) {
      alert(error.message || 'Erro ao criar líder.');
    } finally {
      setCreatingLeader(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-semibold">Painel</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">Cadastro Cidadao</h1>
              <p className="text-slate-300 mt-2">
                Embu das Artes - SP | {session?.funcao || '-'}
              </p>
            </div>
            <div className="flex gap-2">
              {isLeader && (
                <button
                  onClick={() => navigate('/cadastro-cidadao')}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Novo cadastro
                </button>
              )}
              <button
                onClick={onLogout}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
              >
                Sair
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-3xl font-bold text-white">{totalCadastros}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Cadastros totais</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-3xl font-bold text-white">{bairrosComCadastro}</p>
              <p className="text-xs uppercase text-slate-400 mt-1">Bairros com cadastro</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-4">
              <p className="text-base font-semibold text-emerald-300">
                {isLeader ? 'Lider pode cadastrar eleitores.' : 'Admin acompanha os cadastros gerais.'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {isAdmin ? (
        <>
          <section className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white">Criar novo líder</h2>
              <form className="space-y-4" onSubmit={handleCreateLeader}>
                <div>
                  <label className="text-sm text-slate-300 block mb-1">Nome do líder</label>
                  <input
                    value={newLeaderName}
                    onChange={(e) => setNewLeaderName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Digite o nome do líder"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-1">Token do líder</label>
                  <input
                    value={newLeaderToken}
                    onChange={(e) => setNewLeaderToken(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Digite o token do líder"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creatingLeader}
                  className="w-full rounded-lg bg-emerald-500 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {creatingLeader ? 'Criando...' : 'Criar líder'}
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-4">Visão geral</h2>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-3xl font-bold text-white">{totalLeaders}</p>
                  <p className="text-xs uppercase text-slate-400 mt-1">Líderes cadastrados</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-3xl font-bold text-white">{Math.max(...leaderCounts.map((l) => l.count), 0)}</p>
                  <p className="text-xs uppercase text-slate-400 mt-1">Maior cadastros por líder</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Ranking de líderes</h2>
                <p className="text-slate-400 text-sm">Veja quais líderes cadastraram mais eleitores.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={leaderFilter}
                  onChange={(e) => setLeaderFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Filtrar por líder</option>
                  {leaderTokens.map((leader) => (
                    <option key={leader.token} value={leader.token}>{leader.nome}</option>
                  ))}
                </select>
                <select
                  value={bairroFilter}
                  onChange={(e) => setBairroFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Filtrar por bairro</option>
                  {uniqueBairros.map((bairro) => (
                    <option key={bairro} value={bairro}>{bairro}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-950">
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">#</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Líder</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Token</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Cadastros</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRanking.map((leader, index) => (
                    <tr key={leader.token} className="border-b border-slate-700 hover:bg-slate-900/70">
                      <td className="border border-slate-700 px-4 py-3 text-slate-200">{index + 1}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{leader.nome}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{leader.token}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{leader.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">Lista de cadastros</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-950">
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Nome</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Bairro</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Título</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Líder</th>
                    <th className="border border-slate-700 px-4 py-3 text-slate-300">Token do líder</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVoters.map((cidadao, index) => (
                    <tr key={`${cidadao.titulo_eleitor}-${index}`} className="border-b border-slate-700 hover:bg-slate-900/70">
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{cidadao.nome_completo}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{cidadao.bairro}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{cidadao.titulo_eleitor}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{leaderByToken[cidadao.lider_uid] || 'Desconhecido'}</td>
                      <td className="border border-slate-700 px-4 py-3 text-slate-100">{cidadao.lider_uid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section>
          <h2 className="text-lg font-semibold text-slate-200 mb-3">Bairros de Embu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BAIRROS.map((bairro) => {
              const count = cidadaos.filter((c) => c.bairro === bairro).length;
              const hasCadastros = count > 0;
              return (
                <div
                  key={bairro}
                  className={`p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                    hasCadastros
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-700 shadow-lg shadow-emerald-900/20'
                      : 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <h3 className="font-bold text-sm truncate">{bairro}</h3>
                  <p className={`text-xs mt-1 ${hasCadastros ? 'opacity-90' : 'text-slate-400'}`}>
                    {count} cadastros
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}