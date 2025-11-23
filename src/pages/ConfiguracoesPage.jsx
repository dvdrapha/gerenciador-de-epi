import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../contexts/ToastContext.jsx';

export function ConfiguracoesPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      empresa: 'Empresa Demo',
      cnpj: '',
      responsavel: '',
      alerta_validade: true,
      idioma: 'pt-BR',
    },
  });

  const { addToast } = useToast();

  async function onSubmit() {
    addToast('Preferências salvas.', 'success');
  }

  return (
    <section aria-labelledby="config-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="config-titulo">Configurações</h1>
          <p className="muted">Dados da empresa e preferências gerais.</p>
        </div>
      </header>

      <section className="card" aria-label="Dados da empresa">
        <header className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
              🏢
            </span>
            <div>
              <h2 style={{ marginBottom: '0.15rem' }}>Empresa</h2>
              <p className="muted small">Informações básicas usadas em relatórios e comunicações.</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
          <label className="field">
            <span>Nome fantasia</span>
            <input type="text" {...register('empresa')} />
          </label>
          <label className="field">
            <span>CNPJ</span>
            <input type="text" {...register('cnpj')} />
          </label>
          <label className="field">
            <span>Responsável pela segurança</span>
            <input type="text" {...register('responsavel')} />
          </label>

          <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
              style={{ borderRadius: '999px', paddingInline: '1.4rem' }}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar configurações'}
            </button>
          </div>

          <p className="muted small" style={{ marginTop: '0.25rem' }}>
            Última atualização visual: 23/11/2025
          </p>
        </form>
      </section>

      <section className="card" aria-label="Preferências do sistema">
        <header className="section-header">
          <div>
            <h2>Preferências</h2>
            <p className="muted small">Ajustes de idioma e alertas de validade.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
          <label className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              {...register('alerta_validade')}
              style={{ width: '18px', height: '18px' }}
            />
            <div>
              <span>Receber alertas de validade</span>
              <p className="muted small">Notificar quando EPIs estiverem próximos do vencimento.</p>
            </div>
          </label>

          <label className="field">
            <span>Idioma da interface</span>
            <select {...register('idioma')}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (US)</option>
            </select>
          </label>

          <div className="button-row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
              style={{ borderRadius: '999px', paddingInline: '1.4rem' }}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar preferências'}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
