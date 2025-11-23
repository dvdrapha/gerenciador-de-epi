import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  async function onSubmit(data) {
    try {
      await login(data.email, data.senha);
      addToast('Login realizado com sucesso.', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.message || 'Falha ao entrar. Verifique suas credenciais.', 'error');
    }
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 55%), #f3f4ff',
      }}
    >
      <section
        aria-label="Apresentação do sistema de gestão de EPIs"
        style={{
          flex: 1.1,
          padding: '3rem 3.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <header>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(59,130,246,0.12)',
              color: '#1d4ed8',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            Plataforma SaaS para segurança
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
            Gestão de EPIs clara, visual e em tempo real.
          </h1>
          <p style={{ maxWidth: '34rem', fontSize: '0.98rem', color: '#4b5563' }}>
            Centralize o controle de estoque, entregas e uso de EPIs em um único painel, com
            indicadores que ajudam a manter sua equipe sempre protegida e em conformidade.
          </p>
        </header>

        <section
          aria-label="Principais funcionalidades"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
          <article
            style={{
              borderRadius: '16px',
              padding: '1rem',
              background: '#ffffff',
              boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <span
              aria-hidden="true"
              style={{ fontSize: '1.4rem' }}
            >
              📊
            </span>
            <strong>Dashboard em tempo real</strong>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Acompanhe EPIs cadastrados, itens em estoque e EPIs em uso logo após o login.
            </p>
          </article>
          <article
            style={{
              borderRadius: '16px',
              padding: '1rem',
              background: '#ffffff',
              boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>
              🧰
            </span>
            <strong>Estoque organizado</strong>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Cadastre novos EPIs com foto, categoria e validade, mantendo a rastreabilidade.
            </p>
          </article>
          <article
            style={{
              borderRadius: '16px',
              padding: '1rem',
              background: '#ffffff',
              boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>
              🦺
            </span>
            <strong>Controle de EPIs em uso</strong>
            <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Veja quem está utilizando cada EPI, registre devoluções e mantenha o histórico em dia.
            </p>
          </article>
        </section>
      </section>

      <section
        className="auth-card"
        aria-labelledby="login-titulo"
        style={{
          flex: 0.85,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 2.75rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 id="login-titulo">Acessar plataforma</h2>
          <p className="muted">Entre com suas credenciais corporativas para continuar.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
            <label className="field">
              <span>E-mail corporativo</span>
              <input type="email" required {...register('email')} />
            </label>
            <label className="field">
              <span>Senha</span>
              <input type="password" required {...register('senha')} />
            </label>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="muted small" style={{ marginTop: '0.75rem' }}>
            Ainda não tem conta? <Link to="/registro">Criar conta</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
