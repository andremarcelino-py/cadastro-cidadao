import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function CadastroForm({ bairro, onSuccess }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome_completo: '',
    titulo_eleitor: '',
    zona_eleitoral: '',
    secao_eleitoral: '',
    escola_votacao: '',
    indicador: 'LUCAS',
    status: 'pendente'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Força apenas números para zona e seção 
    if ((name === 'zona_eleitoral' || name === 'secao_eleitoral') && !/^\d*$/.test(value)) {
      return; 
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pega o usuário logado para vincular a liderança
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('cidadaos')
        .insert([{ 
          ...formData, 
          bairro, // Salva o bairro recebido via prop 
          lider_uid: user?.id 
        }]);

      if (error) throw error;

      toast.success('Cidadão cadastrado com sucesso!');
      queryClient.invalidateQueries(['cidadaos']); // Atualiza o cache do React Query
      
      // Limpa form após sucesso 
      setFormData({
        nome_completo: '', titulo_eleitor: '', zona_eleitoral: '',
        secao_eleitoral: '', escola_votacao: '', indicador: 'LUCAS', status: 'pendente'
      });
      
      if (onSuccess) onSuccess();

    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
          <input required name="nome_completo" value={formData.nome_completo} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título de Eleitor *</label>
          <input required name="titulo_eleitor" value={formData.titulo_eleitor} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zona Eleitoral</label>
          <input name="zona_eleitoral" value={formData.zona_eleitoral} onChange={handleChange} placeholder="Apenas números" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seção Eleitoral</label>
          <input name="secao_eleitoral" value={formData.secao_eleitoral} onChange={handleChange} placeholder="Apenas números" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Escola/Local de Votação</label>
          <input name="escola_votacao" value={formData.escola_votacao} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Líder / Indicador</label>
          <select name="indicador" value={formData.indicador} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none bg-white">
            <option value="LUCAS">Lucas</option>
            <option value="GRATIDAO">Gratidão</option>
            <option value="SAMPAIO">Sampaio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none bg-white">
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
          </select>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t text-right">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar Cadastro'}
        </button>
      </div>
    </form>
  );
}