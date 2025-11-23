import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../contexts/DataContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

export function EstoquePage() {
  const { logAcao } = useData();
  const { handleSubmit, reset } = useForm();
  const { addToast } = useToast();
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [epis, setEpis] = useState([]);
  const [loadingEpis, setLoadingEpis] = useState(true);

  const [epiSelecionado, setEpiSelecionado] = useState(null);
  const [epiParaExcluir, setEpiParaExcluir] = useState(null);
  const [novoEpiFormKey, setNovoEpiFormKey] = useState(0);

  useEffect(() => {
    async function carregarMovimentos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('estoque_movimentos')
        .select('id, tipo, descricao, quantidade, data')
        .order('data', { ascending: false });

      if (error) {
        addToast('Erro ao carregar movimentações de estoque.', 'error');
        setEstoque([]);
      } else {
        setEstoque(data || []);
      }
      setLoading(false);
    }

    async function carregarEpis() {
      setLoadingEpis(true);
      const { data, error } = await supabase
        .from('epis')
        .select('id, nome, categoria, validade, fabricante, ca, foto_url')
        .order('created_at', { ascending: false });

      if (error) {
        addToast('Erro ao carregar EPIs.', 'error');
        setEpis([]);
      } else {
        setEpis(data || []);
      }
      setLoadingEpis(false);
    }

    carregarMovimentos();
    carregarEpis();
  }, [addToast]);

  async function onSubmit() {
    // Mantido apenas para compatibilidade, sem uso na interface
    reset();
  }

  async function handleCriarEpi(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nome = formData.get('nome')?.toString().trim();
    const categoria = formData.get('categoria')?.toString().trim();
    const validade = formData.get('validade')?.toString() || null;
    const fabricante = formData.get('fabricante')?.toString() || null;
    const ca = formData.get('ca')?.toString() || null;
    const foto_url = formData.get('foto_url')?.toString() || null;

    if (!nome || !categoria) {
      addToast('Preencha pelo menos nome e categoria do EPI.', 'error');
      return;
    }

    const payload = {
      nome,
      categoria,
      validade,
      fabricante,
      ca,
      foto_url,
    };

    const { data: inserted, error } = await supabase
      .from('epis')
      .insert(payload)
      .select('id, nome, categoria, validade, fabricante, ca, foto_url')
      .single();

    if (error) {
      addToast('Erro ao cadastrar EPI.', 'error');
      return;
    }

    const { error: estoqueError } = await supabase.from('estoque_movimentos').insert({
      tipo: 'entrada',
      descricao: `Cadastro de EPI: ${inserted.nome}`,
      quantidade: 1,
    });

    if (estoqueError) {
      addToast('EPI cadastrado, mas houve erro ao registrar no estoque.', 'error');
    }

    setEpis((prev) => [inserted, ...prev]);
    event.currentTarget.reset();
    setNovoEpiFormKey((prev) => prev + 1);
    logAcao(`Cadastro de EPI: ${inserted.nome}`, 'sucesso');
    addToast('EPI cadastrado com sucesso.', 'success');
  }

  async function handleExcluirEpi(epi) {
    setEpiParaExcluir(epi);
  }

  async function handleConfirmarExclusao() {
    if (!epiParaExcluir) return;

    const epi = epiParaExcluir;

    await supabase.from('epis_em_uso').delete().eq('epi', epi.nome);
    await supabase
      .from('estoque_movimentos')
      .delete()
      .ilike('descricao', `%${epi.nome}%`);

    const { error } = await supabase.from('epis').delete().eq('id', epi.id);

    if (error) {
      addToast('Erro ao excluir EPI.', 'error');
      return;
    }

    setEpis((prev) => prev.filter((e) => e.id !== epi.id));
    logAcao(`Exclusão de EPI: ${epi.nome}`, 'warning');
    addToast('EPI excluído com sucesso.', 'success');
    setEpiParaExcluir(null);
  }

  function handleCancelarExclusao() {
    setEpiParaExcluir(null);
  }

  async function handleMarcarEmUso(epi) {
    setEpiSelecionado(epi);
  }

  async function handleConfirmarEmUso(event) {
    event.preventDefault();

    if (!epiSelecionado) {
      addToast('Nenhum EPI selecionado para uso.', 'error');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const colaborador = formData.get('colaborador')?.toString().trim();
    const inicio = formData.get('inicio')?.toString() || new Date().toISOString().slice(0, 10);
    const previsao = formData.get('previsao_devolucao')?.toString() || null;

    if (!colaborador) {
      addToast('Informe o colaborador para registrar o EPI em uso.', 'error');
      return;
    }

    const payload = {
      colaborador,
      epi: epiSelecionado.nome,
      inicio,
      previsao_devolucao: previsao,
      status: 'em_uso',
    };

    const { error } = await supabase.from('epis_em_uso').insert(payload).single();

    if (error) {
      addToast('Erro ao marcar EPI como em uso.', 'error');
      return;
    }

    logAcao(`EPI em uso por ${payload.colaborador} (${payload.epi})`, 'info');
    addToast('EPI marcado como em uso.', 'success');
    setEpiSelecionado(null);
  }

  function handleCancelarEmUso() {
    setEpiSelecionado(null);
  }

  return (
    <section aria-labelledby="estoque-titulo" className="stack-lg">
      <header className="page-header">
        <div>
          <h1 id="estoque-titulo">Estoque</h1>
          <p className="muted">Controle de entradas, saídas e alertas.</p>
        </div>
      </header>

      {epiParaExcluir && (
        <section className="card danger-card" aria-label="Confirmar exclusão de EPI">
          <h2>Excluir EPI</h2>
          <p>
            Tem certeza que deseja excluir o EPI <strong>{epiParaExcluir.nome}</strong>? Esta ação
            não pode ser desfeita e removerá também registros relacionados.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancelarExclusao}
              style={{
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                border: '1px solid rgba(148,163,184,0.6)',
                background: '#f9fafb',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={handleConfirmarExclusao}
              style={{
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                border: '1px solid #fecaca',
                background: '#fee2e2',
                color: '#b91c1c',
              }}
            >
              Excluir EPI
            </button>
          </div>
        </section>
      )}

      {epiSelecionado && (
        <section className="card" aria-label="Registrar EPI em uso">
          <h2>Registrar EPI em uso</h2>
          <p className="muted small">{epiSelecionado.nome}</p>
          <form onSubmit={handleConfirmarEmUso} className="stack" noValidate>
            <label className="field">
              <span>Colaborador</span>
              <input
                type="text"
                required
                name="colaborador"
              />
            </label>
            <label className="field">
              <span>Início do uso</span>
              <input
                type="date"
                name="inicio"
              />
            </label>
            <label className="field">
              <span>Previsão de devolução</span>
              <input
                type="date"
                name="previsao_devolucao"
              />
            </label>
            <div className="button-row" style={{ gap: '1rem' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelarEmUso}
                style={{
                  borderRadius: '999px',
                  padding: '0.45rem 1.2rem',
                  border: '1px solid rgba(148,163,184,0.6)',
                  background: '#f9fafb',
                  minWidth: '135px',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="primary-button"
                style={{
                  borderRadius: '999px',
                  padding: '0.45rem 1.2rem',
                  border: 'none',
                  minWidth: '135px',
                }}
              >
                Confirmar uso
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="grid-2">
        <section className="card" aria-label="Novo EPI">
          <h2>Novo EPI</h2>
          <form key={novoEpiFormKey} onSubmit={handleCriarEpi} className="stack" noValidate>
            <label className="field">
              <span>Nome</span>
              <input
                type="text"
                required
                name="nome"
              />
            </label>
            <label className="field">
              <span>Categoria</span>
              <input
                type="text"
                required
                name="categoria"
              />
            </label>
            <label className="field">
              <span>Validade</span>
              <input
                type="date"
                name="validade"
              />
            </label>
            <label className="field">
              <span>Fabricante</span>
              <input
                type="text"
                name="fabricante"
              />
            </label>
            <label className="field">
              <span>CA</span>
              <input
                type="text"
                name="ca"
              />
            </label>
            <label className="field">
              <span>URL da foto</span>
              <input
                type="url"
                placeholder="https://..."
                name="foto_url"
              />
            </label>
            <button type="submit" className="primary-button" style={{ borderRadius: '999px' }}>
              Cadastrar EPI
            </button>
          </form>
        </section>

        <section className="card" aria-label="EPIs cadastrados no estoque">
          <h2>EPIs cadastrados</h2>
          {loadingEpis ? (
            <p className="empty-state">Carregando EPIs...</p>
          ) : epis.length === 0 ? (
            <p className="empty-state">Nenhum EPI cadastrado.</p>
          ) : (
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Validade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {epis.map((epi) => (
                  <tr key={epi.id}>
                    <td>{epi.nome}</td>
                    <td>{epi.categoria}</td>
                    <td>{epi.validade || '-'}</td>
                    <td>
                      <div className="button-row" style={{ gap: '1.5rem' }}>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handleMarcarEmUso(epi)}
                          style={{
                            borderRadius: '999px',
                            padding: '0.3rem 0.9rem',
                            border: '1px solid rgba(129,140,248,0.5)',
                            background: 'rgba(239,246,255,0.9)',
                            color: '#1d4ed8',
                          }}
                        >
                          Em uso
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleExcluirEpi(epi)}
                          style={{
                            borderRadius: '999px',
                            padding: '0.3rem 0.9rem',
                            border: '1px solid #fecaca',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            marginLeft: '0.1rem',
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
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
