import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

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

  const { data: cidadaos = [] } = useQuery({
    queryKey: ['cidadaos'],
    enabled: !!supabase && !!session?.userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('cidadaos').select('*');
      if (error) throw error;
      return data;
    }
  });

  const totalCadastros = cidadaos.length;
  const bairrosComCadastro = new Set(cidadaos.map(c => c.bairro)).size;

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
    </div>
  );
}