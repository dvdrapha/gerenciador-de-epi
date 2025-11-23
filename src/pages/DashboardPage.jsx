import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from '../contexts/ToastContext.jsx';

export function DashboardPage() {
  const { addToast } = useToast();
  const [epis, setEpis] = useState([]);
  const [estoqueMovimentos, setEstoqueMovimentos] = useState([]);
  const [episEmUso, setEpisEmUso] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      try {
        const [episRes, estoqueRes, emUsoRes] = await Promise.all([
          supabase
            .from('epis')
            .select('id, nome, validade')
            .order('validade', { ascending: true, nullsFirst: false }),
          supabase
            .from('estoque_movimentos')
            .select('id, tipo, quantidade'),
          supabase
            .from('epis_em_uso')
            .select('id, status')
            .eq('status', 'em_uso'),
        ]);

        if (episRes.error) {
          addToast(episRes.error.message || 'Erro ao carregar EPIs.', 'error');
          setEpis([]);
        } else {
          setEpis(episRes.data || []);
        }

        if (estoqueRes.error) {
          addToast(estoqueRes.error.message || 'Erro ao carregar estoque.', 'error');
          setEstoqueMovimentos([]);
        } else {
          setEstoqueMovimentos(estoqueRes.data || []);
        }

        if (emUsoRes.error) {
          addToast(emUsoRes.error.message || 'Erro ao carregar EPIs em uso.', 'error');
          setEpisEmUso([]);
        } else {
          setEpisEmUso(emUsoRes.data || []);
        }
      } catch (e) {
        addToast(e.message || 'Erro inesperado ao carregar dashboard.', 'error');
        setEpis([]);
        setEstoqueMovimentos([]);
        setEpisEmUso([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [addToast]);

  const proximosVencimentos = epis
    .filter((epi) => epi.validade)
    .slice(0, 3);

  const totalEmUso = episEmUso.length;

  // Considera estoque simples como EPIs cadastrados menos EPIs em uso
  const itensEmEstoque = Math.max(epis.length - totalEmUso, 0);

  return (
    <section aria-labelledby="dashboard-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="dashboard-titulo">Dashboard</h1>
          <p className="muted">Visão geral da saúde dos EPIs e conformidade.</p>
        </div>
      </header>

      <section aria-label="Indicadores principais" className="kpi-grid">
        <article
          className="card kpi-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="kpi-label">EPIs cadastrados</h2>
            <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>
              🧾
            </span>
          </div>
          <p className="kpi-value">{loading ? '...' : epis.length}</p>
          <p className="muted small">Total de modelos de EPIs cadastrados no sistema.</p>
        </article>

        <article
          className="card kpi-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="kpi-label">Itens em estoque</h2>
            <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>
              📦
            </span>
          </div>
          <p className="kpi-value">{loading ? '...' : itensEmEstoque}</p>
          <div
            aria-hidden="true"
            style={{
              marginTop: '0.25rem',
              height: '6px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #22c55e, #4ade80)',
              opacity: 0.75,
            }}
          />
          <p className="muted small">Estimativa simples: EPIs cadastrados menos EPIs em uso.</p>
        </article>

        <article
          className="card kpi-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="kpi-label">EPIs em uso</h2>
            <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>
              🦺
            </span>
          </div>
          <p className="kpi-value">{loading ? '...' : totalEmUso}</p>
          <p className="muted small">Quantidade de EPIs atualmente alocados a colaboradores.</p>
        </article>
      </section>

      <section aria-label="EPIs próximos da validade" className="card">
        <header className="section-header">
          <div>
            <h2>EPIs próximos da validade</h2>
            <p className="muted small">Acompanhe itens que exigem atenção.</p>
          </div>
        </header>
        {proximosVencimentos.length === 0 ? (
          <p className="empty-state">Nenhum EPI com validade crítica no momento.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {proximosVencimentos.map((epi) => (
              <article
                key={epi.id}
                style={{
                  borderRadius: '14px',
                  padding: '0.75rem 0.9rem',
                  background: 'linear-gradient(135deg, #fef3c7, #fee2e2)',
                  border: '1px solid rgba(234, 179, 8, 0.55)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(248, 113, 113, 0.12)',
                      color: '#b91c1c',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Atenção
                  </span>
                  <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>
                    ⏰
                  </span>
                </div>
                <strong style={{ fontSize: '0.95rem' }}>{epi.nome}</strong>
                <span style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>
                  Validade: {epi.validade}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
