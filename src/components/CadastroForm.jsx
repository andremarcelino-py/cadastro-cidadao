import { useState } from 'react';
import { toast } from 'sonner';
import { supabase, hasSupabaseConfig } from '../utils/supabase';

const BAIRROS_EMBU = [
  'Centro', 'Jardim Santo Eduardo', 'Jardim Independencia', 'Vila Regina', 'Santa Tereza',
  'Sao Marcos', 'Santo Antonio', 'Vazame', 'Casa Branca', 'Mimoso',
  'Jardim Silvia', 'Jardim Arabutan', 'Jardim Santa Clara', 'Jardim Magali',
  'Jardim Dom Jose', 'Parque Pirajussara', 'Parque Esplanada', 'Jardim Santa Emilia',
  'Jardim Vista Alegre', 'Jardim Pinheirinho', 'Jardim das Oliveiras', 'Capuava',
  'Itatuba', 'Ressaca', 'Valo Verde', 'Jardim Sao Luiz', 'Jardim Santo Andre',
  'Jardim Sao Francisco', 'Jardim Sao Jose', 'Jardim Sao Paulo', 'Jardim Sao Sebastiao',
  'Jardim Sao Vicente', 'Jardim Sao Pedro', 'Jardim Sao Joao', 'Jardim Sao Lucas',
  'Jardim Sao Marcos', 'Jardim Sao Mateus', 'Jardim Sao Miguel', 'Jardim Sao Rafael',
  'Jardim Sao Gabriel', 'Jardim Sao Tiago', 'Jardim Sao Bartolomeu', 'Jardim Sao Judas',
  'Jardim Sao Mateus', 'Jardim Sao Simão', 'Jardim Sao Tadeu', 'Jardim Sao Tomé',
  'Jardim Sao Felipe', 'Jardim Sao Bartolomeu', 'Jardim Sao André', 'Jardim Sao Bento',
  'Jardim Sao Caetano', 'Jardim Sao Carlos', 'Jardim Sao Clemente', 'Jardim Sao Cristovao',
  'Jardim Sao Damiao', 'Jardim Sao Dionisio', 'Jardim Sao Domingos', 'Jardim Sao Elias',
  'Jardim Sao Estevao', 'Jardim Sao Faustino', 'Jardim Sao Felix', 'Jardim Sao Fernando',
  'Jardim Sao Francisco de Assis', 'Jardim Sao Geraldo', 'Jardim Sao Goncalo', 'Jardim Sao Gregorio',
  'Jardim Sao Guilherme', 'Jardim Sao Humberto', 'Jardim Sao Inacio', 'Jardim Sao Jeronimo',
  'Jardim Sao Joao Batista', 'Jardim Sao Joao Evangelista', 'Jardim Sao Jorge', 'Jardim Sao Jose Maria',
  'Jardim Sao Judas Tadeu', 'Jardim Sao Lazaro', 'Jardim Sao Lourenco', 'Jardim Sao Lucas Evangelista',
  'Jardim Sao Marcos Evangelista', 'Jardim Sao Mateus Evangelista', 'Jardim Sao Miguel Arcanjo',
  'Jardim Sao Nicolau', 'Jardim Sao Pantaleao', 'Jardim Sao Paulo Apóstolo', 'Jardim Sao Pedro Apóstolo',
  'Jardim Sao Rafael Arcanjo', 'Jardim Sao Roque', 'Jardim Sao Salvador', 'Jardim Sao Sebastiao Martir',
  'Jardim Sao Simão e Sao Judas', 'Jardim Sao Tadeu', 'Jardim Sao Tiago Maior', 'Jardim Sao Tiago Menor',
  'Jardim Sao Tome Apostolo', 'Jardim Sao Vicente de Paulo', 'Jardim Sao Vito', 'Jardim Sao Zacarias'
];

export default function CadastroForm({ session, onSuccess }) {
  const [form, setForm] = useState({
    nome_completo: '',
    bairro: '',
    titulo_eleitor: '',
    zona_eleitoral: '',
    secao_eleitoral: '',
    escola_votacao: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.nome_completo.trim() || !form.bairro || !form.titulo_eleitor.trim()) {
      toast.error('Preencha nome, bairro e titulo de eleitor.');
      return;
    }

    if (form.zona_eleitoral && !/^\d+$/.test(form.zona_eleitoral)) {
      toast.error('Zona eleitoral deve conter apenas numeros.');
      return;
    }

    if (form.secao_eleitoral && !/^\d+$/.test(form.secao_eleitoral)) {
      toast.error('Secao eleitoral deve conter apenas numeros.');
      return;
    }

    if (hasSupabaseConfig || !supabase) {
      toast.error('Configure o Supabase no .env antes de cadastrar.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('cidadaos').insert({
        nome_completo: form.nome_completo.trim(),
        bairro: form.bairro,
        titulo_eleitor: form.titulo_eleitor.trim(),
        zona_eleitoral: form.zona_eleitoral.trim() || null,
        secao_eleitoral: form.secao_eleitoral.trim() || null,
        escola_votacao: form.escola_votacao.trim() || null,
        lider_uid: session?.userId
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso!');
      setForm({
        nome_completo: '',
        bairro: '',
        titulo_eleitor: '',
        zona_eleitoral: '',
        secao_eleitoral: '',
        escola_votacao: ''
      });
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Nome completo *</label>
        <input
          type="text"
          value={form.nome_completo}
          onChange={(e) => setForm((prev) => ({ ...prev, nome_completo: e.target.value }))}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Nome do eleitor"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Bairro *</label>
        <select
          value={form.bairro}
          onChange={(e) => setForm((prev) => ({ ...prev, bairro: e.target.value }))}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecione o bairro</option>
          {BAIRROS_EMBU.map((bairro) => (
            <option key={bairro} value={bairro}>{bairro}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Titulo de eleitor *</label>
        <input
          type="text"
          value={form.titulo_eleitor}
          onChange={(e) => setForm((prev) => ({ ...prev, titulo_eleitor: e.target.value }))}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Digite o titulo"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Zona eleitoral</label>
          <input
            type="text"
            value={form.zona_eleitoral}
            onChange={(e) => setForm((prev) => ({ ...prev, zona_eleitoral: e.target.value }))}
            className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Apenas numeros"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Secao eleitoral</label>
          <input
            type="text"
            value={form.secao_eleitoral}
            onChange={(e) => setForm((prev) => ({ ...prev, secao_eleitoral: e.target.value }))}
            className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Apenas numeros"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Escola de votacao</label>
        <input
          type="text"
          value={form.escola_votacao}
          onChange={(e) => setForm((prev) => ({ ...prev, escola_votacao: e.target.value }))}
          className="w-full border border-slate-700 bg-slate-950 text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Local de votacao"
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
