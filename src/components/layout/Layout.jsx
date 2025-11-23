import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex' }}>
      <div className="app-body" style={{ display: 'flex', flex: 1 }}>
        <nav
          className="app-nav"
          aria-label="Navegação principal"
          style={{
            background: '#020617',
            color: '#e5e7eb',
            width: sidebarCollapsed ? '68px' : '220px',
            transition: 'width 200ms ease-in-out',
            borderRight: '1px solid rgba(15,23,42,0.8)',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-end',
              padding: sidebarCollapsed ? '0.5rem 0.25rem' : '0.75rem 0.75rem 0.5rem',
            }}
          >
            <button
              type="button"
              className="ghost-button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              style={{
                width: sidebarCollapsed ? '32px' : '36px',
                height: sidebarCollapsed ? '32px' : '36px',
                borderRadius: '999px',
                border: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(15,23,42,0.85)',
                color: '#e5e7eb',
                boxShadow: '0 8px 20px rgba(15,23,42,0.55)',
              }}
              aria-label={sidebarCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              <span aria-hidden="true" style={{ fontSize: '0.85rem' }}>
                {sidebarCollapsed ? '›' : '‹'}
              </span>
            </button>
          </div>

          {!sidebarCollapsed && <div className="nav-section-header">Visão geral</div>}
          <NavLink
            to="/dashboard"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              📊
            </span>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </NavLink>

          {!sidebarCollapsed && <div className="nav-section-header">Gestão de EPIs</div>}
          <NavLink
            to="/epis"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              🧰
            </span>
            {!sidebarCollapsed && <span>Catálogo de EPIs</span>}
          </NavLink>
          <NavLink
            to="/estoque"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              📦
            </span>
            {!sidebarCollapsed && <span>Estoque</span>}
          </NavLink>
          <NavLink
            to="/em-uso"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              🦺
            </span>
            {!sidebarCollapsed && <span>EPIs em uso</span>}
          </NavLink>

          {!sidebarCollapsed && <div className="nav-section-header">Administração</div>}
          <NavLink
            to="/usuarios"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              👥
            </span>
            {!sidebarCollapsed && <span>Usuários</span>}
          </NavLink>
          <NavLink
            to="/configuracoes"
            className="nav-link"
            style={({ isActive }) => ({
              borderRadius: '999px',
              padding: '0.45rem 0.75rem',
              marginInline: sidebarCollapsed ? '0.1rem' : '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              backgroundColor: isActive ? '#1d4ed8' : 'transparent',
              color: isActive ? '#e5e7eb' : '#9ca3af',
              transition: 'background-color 120ms ease-out, color 120ms ease-out',
            })}
          >
            <span aria-hidden="true" style={{ marginRight: sidebarCollapsed ? 0 : '0.5rem' }}>
              ⚙️
            </span>
            {!sidebarCollapsed && <span>Configurações</span>}
          </NavLink>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <header className="app-header" role="banner">
            <div className="app-header-left">
              <span className="app-logo" aria-label="Gestão de EPIs">
                EPI SaaS
              </span>
            </div>
            <div className="app-header-right">
              {user && (
                <div className="user-badge" aria-label={`Usuário autenticado: ${user.name}`}>
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                  <button type="button" className="ghost-button" onClick={logout}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </header>

          <main
            className="app-main"
            id="conteudo-principal"
            role="main"
            style={{
              flex: 1,
              paddingInline: '2.5rem',
            }}
          >
            <Outlet />
          </main>

          <footer className="app-footer" role="contentinfo">
            <small>© {new Date().getFullYear()} Gestão de EPIs - Plataforma SaaS</small>
          </footer>
        </div>
      </div>
    </div>
  );
}
