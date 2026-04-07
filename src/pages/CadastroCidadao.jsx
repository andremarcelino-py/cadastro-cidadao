import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CadastroForm from '../components/CadastroForm';

export default function CadastroCidadao() {
  const [searchParams] = useSearchParams();
  const bairro = searchParams.get('bairro'); // 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cadastro');

  if (!bairro) return <div className="p-8 text-center text-slate-300">Bairro nao informado.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/')} className="text-sm text-emerald-400 hover:underline mb-2">
            &larr; Voltar para painel
          </button>
          <h2 className="text-2xl font-bold text-white">Bairro: {bairro}</h2>
        </div>
      </header>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-700 bg-slate-950">
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'cadastro' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'relatorio' ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
            onClick={() => setActiveTab('relatorio')}
          >
            Relatorio
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'cadastro' && (
            <CadastroForm bairro={bairro} onSuccess={() => setActiveTab('relatorio')} />
          )}
          {activeTab === 'relatorio' && (
            <div className="text-center text-slate-400 py-8">
              Tabela de cidadaos do bairro {bairro} em construcao...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}