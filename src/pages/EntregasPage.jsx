import React from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../contexts/DataContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export function EntregasPage() {
  const { entregas, setEntregas, logAcao } = useData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const { addToast } = useToast();

  async function onSubmit(data) {
    const entrega = {
      id: Date.now(),
      colaborador: data.colaborador,
      epi: data.epi,
      data: data.data || new Date().toISOString().slice(0, 10),
    };
    setEntregas((prev) => [entrega, ...prev]);
    logAcao(`Entrega de EPI para ${entrega.colaborador}`, 'info');
    addToast('Entrega registrada com sucesso.', 'success');
    reset();
  }

  return (
    <section aria-labelledby="entregas-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="entregas-titulo">Entregas</h1>
          <p className="muted">Registro de entregas de EPIs aos colaboradores.</p>
        </div>
      </header>

      <div className="grid-2">
        <section className="card" aria-label="Nova entrega de EPI">
          <h2>Nova entrega</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
            <label className="field">
              <span>Colaborador</span>
              <input type="text" required {...register('colaborador')} />
            </label>
            <label className="field">
              <span>EPI</span>
              <input type="text" required {...register('epi')} />
            </label>
            <label className="field">
              <span>Data</span>
              <input type="date" {...register('data')} />
            </label>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar entrega'}
            </button>
          </form>
        </section>

        <section className="card" aria-label="Histórico de entregas">
          <h2>Histórico</h2>
          {entregas.length === 0 ? (
            <p className="empty-state">Nenhuma entrega registrada.</p>
          ) : (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Colaborador</th>
                  <th>EPI</th>
                </tr>
              </thead>
              <tbody>
                {entregas.map((e) => (
                  <tr key={e.id}>
                    <td>{e.data}</td>
                    <td>{e.colaborador}</td>
                    <td>{e.epi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </section>
  );
}
