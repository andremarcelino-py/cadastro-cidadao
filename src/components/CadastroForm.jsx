import { useState } from 'react';
import { toast } from 'sonner';
import { supabase, hasSupabaseConfig } from '../utils/supabase';

export default function CadastroForm({ bairro, onSuccess }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nome.trim()) {
      toast.error('Informe o nome.');
      return;
    }

    if (hasSupabaseConfig || !supabase) {
      toast.error('Configure o Supabase no .env antes de cadastrar.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('cidadaos').insert({
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        bairro
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso!');
      setNome('');
      setTelefone('');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Nome *</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Digite o nome"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="(11) 99999-9999"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 text-slate-950 py-2 rounded-lg font-semibold hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? 'Salvando...' : 'Salvar cadastro'}
      </button>
    </form>
  );
}
