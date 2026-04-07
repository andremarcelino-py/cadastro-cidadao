import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CadastroForm from '../components/CadastroForm';

export default function CadastroCidadao() {
  const [searchParams] = useSearchParams();
  const bairro = searchParams.get('bairro'); // 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cadastro');

  if (!bairro) return <div className="p-8 text-center">Bairro não informado.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline mb-2">
            &larr; Voltar para Home 
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Bairro: {bairro}</h2>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b bg-gray-50">
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'cadastro' ? 'border-b-2 border-blue-600 text-blue-700 bg-white' : 'text-gray-600'}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro 
          </button>
          <button 
            className={`flex-1 py-3 font-semibold ${activeTab === 'relatorio' ? 'border-b-2 border-blue-600 text-blue-700 bg-white' : 'text-gray-600'}`}
            onClick={() => setActiveTab('relatorio')}
          >
            Relatório 
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'cadastro' && (
            <CadastroForm bairro={bairro} onSuccess={() => setActiveTab('relatorio')} />
          )}
          {activeTab === 'relatorio' && (
            <div className="text-center text-gray-500 py-8">
              {/* Componente RelatorioGeral seria renderizado aqui  */}
              Tabela de cidadãos do bairro {bairro} em construção...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}