import React from 'react';

export function ConformidadePage() {
  const requisitos = [
    {
      id: 1,
      titulo: 'Entrega de EPIs com registro de CA',
      status: 'parcial',
      descricao: 'Mantenha registro de todos os EPIs entregues com o respectivo Certificado de Aprovação.',
    },
    {
      id: 2,
      titulo: 'Inspeções periódicas documentadas',
      status: 'pendente',
      descricao: 'Realizar inspeções regulares e manter histórico para auditorias.',
    },
    {
      id: 3,
      titulo: 'Controle de validade dos EPIs',
      status: 'ok',
      descricao: 'Monitorar prazos de validade e garantir substituição tempestiva.',
    },
  ];

  return (
    <section aria-labelledby="conformidade-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="conformidade-titulo">Conformidade</h1>
          <p className="muted">Acompanhe requisitos legais e evidências para auditorias.</p>
        </div>
      </header>

      <section className="card" aria-label="Painel de requisitos de conformidade">
        <h2>Requisitos principais</h2>
        <ul className="requisitos-list">
          {requisitos.map((req) => (
            <li key={req.id} className={`req req-${req.status}`}>
              <div className="req-header">
                <span className="req-titulo">{req.titulo}</span>
                <span className="req-status" aria-label={`Status: ${req.status}`}>
                  {req.status === 'ok' && 'Em conformidade'}
                  {req.status === 'parcial' && 'Em andamento'}
                  {req.status === 'pendente' && 'Pendente'}
                </span>
              </div>
              <p className="muted small">{req.descricao}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
