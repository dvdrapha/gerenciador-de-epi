import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  async function onSubmit(data) {
    try {
      await registerUser(data);
      addToast('Conta criada com sucesso. Verifique seu e-mail se necessário.', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.message || 'Falha ao criar conta.', 'error');
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby="registro-titulo">
        <h1 id="registro-titulo">Criar conta da empresa</h1>
        <p className="muted">Comece a gerenciar EPIs com segurança e conformidade.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
          <label className="field">
            <span>Nome da empresa</span>
            <input type="text" required {...register('empresa')} />
          </label>
          <label className="field">
            <span>Seu nome</span>
            <input type="text" required {...register('nome')} />
          </label>
          <label className="field">
            <span>E-mail corporativo</span>
            <input type="email" required {...register('email')} />
          </label>
          <label className="field">
            <span>Senha</span>
            <input type="password" required {...register('senha')} />
          </label>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        <p className="muted small">
          Já tem acesso? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </div>
  );
}
