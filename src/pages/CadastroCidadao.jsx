import { useNavigate } from 'react-router-dom';
import CadastroForm from '../components/CadastroForm';

export default function CadastroCidadao({ session }) {
  const navigate = useNavigate();
  const isLeader = session?.funcao === 'lider';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/')} className="text-sm text-emerald-400 hover:underline mb-2">
            &larr; Voltar para painel
          </button>
          <h2 className="text-2xl font-bold text-white">Novo cadastro de cidadao</h2>
        </div>
      </header>

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
        <div className="p-6">
          {!isLeader ? (
            <div className="text-center text-amber-300 py-8">
              Apenas usuarios com funcao lider podem cadastrar cidadaos.
            </div>
          ) : (
            <CadastroForm session={session} onSuccess={() => navigate('/')} />
          )}
        </div>
      </div>
    </div>
  );
}