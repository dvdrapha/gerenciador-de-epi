import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (children) return children;
  return <Outlet />;
}

export function RoleGuard({ roles, children }) {
  const { user } = useAuth();

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
