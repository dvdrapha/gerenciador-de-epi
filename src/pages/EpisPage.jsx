import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

export function EpisPage() {
  const { addToast } = useToast();
  const [epis, setEpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEpis() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('epis')
          .select('id, nome, categoria, validade, fabricante, ca, foto_url')
          .order('created_at', { ascending: false });

        if (error) {
          addToast(error.message || 'Erro ao carregar EPIs.', 'error');
          setEpis([]);
        } else {
          setEpis(data || []);
        }
      } catch (e) {
        addToast(e.message || 'Erro inesperado ao carregar EPIs.', 'error');
        setEpis([]);
      } finally {
        setLoading(false);
      }
    }

    carregarEpis();
  }, [addToast]);

  return (
    <section aria-labelledby="epis-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="epis-titulo">EPIs</h1>
          <p className="muted">Catálogo de EPIs da empresa.</p>
        </div>
      </header>

      <section className="card" aria-label="Catálogo de EPIs">
        <h2>EPIs cadastrados</h2>
        {loading ? (
          <p className="empty-state">Carregando EPIs...</p>
        ) : epis.length === 0 ? (
          <p className="empty-state">Nenhum EPI cadastrado.</p>
        ) : (
          <div
            className="card-grid"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.75rem',
              justifyContent: 'flex-start',
            }}
          >
            {epis.map((epi) => (
              <article
                key={epi.id}
                className="epi-card"
                style={{
                  borderRadius: '18px',
                  padding: '1rem',
                  background: 'linear-gradient(145deg, #ffffff, #f4f7ff)',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'transform 160ms ease-out, box-shadow 160ms ease-out',
                  maxWidth: '320px',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 24px 55px rgba(15, 23, 42, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.12)';
                }}
              >
                <div
                  className="epi-card-image-wrapper"
                  style={{
                    width: '100%',
                    height: '190px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {epi.foto_url ? (
                    <img
                      src={epi.foto_url}
                      alt={epi.nome}
                      className="epi-card-image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="epi-card-placeholder"
                      aria-hidden="true"
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '999px',
                        background:
                          'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(96,165,250,0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {epi.nome?.charAt(0) || 'E'}
                    </div>
                  )}
                </div>
                <div
                  className="epi-card-body"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <h3
                      className="epi-card-title"
                      style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}
                    >
                      {epi.nome}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        background: 'rgba(59,130,246,0.12)',
                        color: '#1d4ed8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {epi.categoria || 'EPI'}
                    </span>
                  </div>
                  <p className="epi-card-meta" style={{ fontSize: '0.85rem', opacity: 0.75 }}>
                    Validade: {epi.validade || 'Sem validade informada'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
