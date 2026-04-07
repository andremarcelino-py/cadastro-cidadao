import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useState } from 'react';

// Lista simplificada de Bairros (hard-coded conforme doc) 
const BAIRROS = ["Centro", "Jardim Santo Eduardo", "Jardim Independência", "Vazame", "Pinheirinho"];

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bairros');

  // Busca todos os cidadãos (o RLS do Supabase fará o filtro de segurança automaticamente) [cite: 10]
  const { data: cidadaos = [] } = useQuery({
    queryKey: ['cidadaos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cidadaos').select('*');
      if (error) throw error;
      return data;
    }
  });

  const totalCadastros = cidadaos.length;
  const bairrosComCadastro = new Set(cidadaos.map(c => c.bairro)).size;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cabeçalho */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">CADASTRO CIDADÃO</h1>
        <p className="text-gray-600 mb-4">Embu das Artes - SP</p>
        <div className="flex justify-center gap-4">
          <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
            <span className="block text-2xl font-bold">{totalCadastros}</span>
            <span className="text-xs text-gray-500 uppercase">Cadastros</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
            <span className="block text-2xl font-bold">{bairrosComCadastro}</span>
            <span className="text-xs text-gray-500 uppercase">Bairros Atingidos</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'bairros' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bairros')}
        >
          Bairros
        </button>
        <button 
          className={`flex-1 py-2 font-semibold ${activeTab === 'lideres' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('lideres')}
        >
          Líder Comunitário
        </button>
      </div>

      {/* Conteúdo Aba Bairros  */}
      {activeTab === 'bairros' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BAIRROS.map(bairro => {
            const count = cidadaos.filter(c => c.bairro === bairro).length;
            const hasCadastros = count > 0;
            return (
              <div 
                key={bairro}
                onClick={() => navigate(`/cadastro-cidadao?bairro=${bairro}`)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  hasCadastros 
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-800' // [cite: 11]
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100' // [cite: 5]
                }`}
              >
                <h3 className="font-bold text-sm truncate">{bairro}</h3>
                <p className={`text-xs ${hasCadastros ? 'opacity-90' : 'text-gray-500'}`}>
                  {count} cadastros [cite: 9]
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}