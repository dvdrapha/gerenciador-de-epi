import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import { Layout } from './components/layout/Layout.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { EpisPage } from './pages/EpisPage.jsx';
import { EstoquePage } from './pages/EstoquePage.jsx';
import { UsuariosPage } from './pages/UsuariosPage.jsx';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage.jsx';
import { EmUsoPage } from './pages/EmUsoPage.jsx';
import { ProtectedRoute, RoleGuard } from './components/routing/ProtectedRoute.jsx';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/registro"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="epis" element={<EpisPage />} />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="em-uso" element={<EmUsoPage />} />
        <Route
          path="usuarios"
          element={
            <RoleGuard roles={['admin', 'gestor']}>
              <UsuariosPage />
            </RoleGuard>
          }
        />
        <Route path="configuracoes" element={<ConfiguracoesPage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
