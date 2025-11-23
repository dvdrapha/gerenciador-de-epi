import React, { createContext, useContext, useMemo, useState } from 'react';

// Contexto simples in-memory para mock de dados
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [epis, setEpis] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [episEmUso, setEpisEmUso] = useState([]);
  const [inspecoes, setInspecoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [auditoria, setAuditoria] = useState([]);

  function logAcao(descricao, tipo = 'info') {
    setAuditoria((prev) => [
      { id: Date.now(), descricao, tipo, data: new Date().toISOString() },
      ...prev,
    ]);
  }

  const value = useMemo(
    () => ({
      epis,
      setEpis,
      estoque,
      setEstoque,
      entregas,
      setEntregas,
      episEmUso,
      setEpisEmUso,
      inspecoes,
      setInspecoes,
      usuarios,
      setUsuarios,
      auditoria,
      logAcao,
    }),
    [epis, estoque, entregas, inspecoes, usuarios, auditoria]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData deve ser usado dentro de DataProvider');
  return ctx;
}
