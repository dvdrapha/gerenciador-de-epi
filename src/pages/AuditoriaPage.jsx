import React from 'react';
import { useData } from '../contexts/DataContext.jsx';

export function AuditoriaPage() {
  const { auditoria } = useData();

  return (
    <section aria-labelledby="auditoria-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="auditoria-titulo">Auditoria</h1>
          <p className="muted">Registro de ações relevantes para rastreabilidade.</p>
        </div>
      </header>

      <section className="card" aria-label="Logs de auditoria">
        <h2>Logs</h2>
        {auditoria.length === 0 ? (
          <p className="empty-state">Nenhuma ação registrada ainda.</p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Tipo</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {auditoria.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.data).toLocaleString()}</td>
                  <td>{log.tipo}</td>
                  <td>{log.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}
