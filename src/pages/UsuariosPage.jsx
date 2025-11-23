import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from '../contexts/ToastContext.jsx';

export function UsuariosPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [perfis, setPerfis] = useState([]);

  async function carregarPerfis() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .order('full_name', { ascending: true, nullsFirst: true });

    if (error) {
      addToast('Erro ao carregar usuários.', 'error');
      setPerfis([]);
    } else {
      setPerfis(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    carregarPerfis();
  }, []);

  async function atualizarRole(id, novaRole) {
    setSavingId(id);
    const { error } = await supabase.from('profiles').update({ role: novaRole }).eq('id', id);
    if (error) {
      addToast('Erro ao atualizar papel.', 'error');
    } else {
      addToast('Papel atualizado.', 'success');
      setPerfis((atual) =>
        atual.map((p) => (p.id === id ? { ...p, role: novaRole } : p))
      );
    }
    setSavingId(null);
  }

  return (
    <section aria-labelledby="usuarios-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="usuarios-titulo">Usuários</h1>
          <p className="muted">Gestão de acessos e papéis dos usuários da conta.</p>
        </div>
      </header>

      <section className="card" aria-label="Lista de usuários">
        <h2>Usuários</h2>
        {loading ? (
          <p className="empty-state">Carregando usuários...</p>
        ) : perfis.length === 0 ? (
          <p className="empty-state">
            Nenhum usuário encontrado. Crie contas pelo formulário de registro/login.
          </p>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
              </tr>
            </thead>
            <tbody>
              {perfis.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name || '-'}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role || 'colaborador'}
                      onChange={(e) => atualizarRole(u.id, e.target.value)}
                      disabled={savingId === u.id}
                    >
                      <option value="admin">Admin</option>
                      <option value="gestor">Gestor</option>
                      <option value="colaborador">Colaborador</option>
                    </select>
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
