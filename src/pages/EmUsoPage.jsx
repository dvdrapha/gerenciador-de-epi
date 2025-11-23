import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

export function EmUsoPage() {
  const { addToast } = useToast();
  const [episEmUso, setEpisEmUso] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEmUso() {
      setLoading(true);
      const { data, error } = await supabase
        .from('epis_em_uso')
        .select('id, colaborador, epi, inicio, previsao_devolucao, status')
        .eq('status', 'em_uso')
        .order('inicio', { ascending: false });

      if (error) {
        addToast('Erro ao carregar EPIs em uso.', 'error');
        setEpisEmUso([]);
      } else {
        setEpisEmUso(data || []);
      }
      setLoading(false);
    }

    carregarEmUso();
  }, [addToast]);

  async function handleDevolver(epiUso) {
    const { error: updateError } = await supabase
      .from('epis_em_uso')
      .update({ status: 'devolvido' })
      .eq('id', epiUso.id);

    if (updateError) {
      addToast('Erro ao devolver EPI ao estoque.', 'error');
      return;
    }

    const { error: movError } = await supabase.from('estoque_movimentos').insert({
      tipo: 'entrada',
      descricao: `Devolução de EPI: ${epiUso.epi}`,
      quantidade: 1,
    });

    if (movError) {
      addToast('EPI devolvido, mas houve erro ao registrar no estoque.', 'error');
    }

    setEpisEmUso((prev) => prev.filter((r) => r.id !== epiUso.id));
    addToast('EPI devolvido ao estoque.', 'success');
  }

  return (
    <section aria-labelledby="emuso-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="emuso-titulo">EPIs em uso</h1>
          <p className="muted">Controle de EPIs atualmente alocados a colaboradores.</p>
        </div>
      </header>

      <section className="card" aria-label="EPIs em uso">
        <h2>Registros atuais</h2>
        {loading ? (
          <p className="empty-state">Carregando EPIs em uso...</p>
        ) : episEmUso.length === 0 ? (
          <p className="empty-state">
            Nenhum EPI marcado como em uso.
          </p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>EPI</th>
                <th>Início</th>
                <th>Previsão devolução</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {episEmUso.map((r) => (
                <tr key={r.id}>
                  <td>{r.colaborador}</td>
                  <td>{r.epi}</td>
                  <td>{r.inicio}</td>
                  <td>{r.previsao_devolucao || '-'} </td>
                  <td>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleDevolver(r)}
                      style={{
                        borderRadius: '999px',
                        padding: '0.3rem 0.9rem',
                        border: '1px solid rgba(129,140,248,0.5)',
                        background: 'rgba(239,246,255,0.9)',
                        color: '#1d4ed8',
                      }}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}
