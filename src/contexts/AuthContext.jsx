import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { upsertProfile } from '../lib/profileService.js';

const AuthContext = createContext(null);

function buildUserFromAuthUser(u, overrides) {
  if (!u) return null;

  const name = overrides?.name || u.user_metadata?.full_name || u.email;
  const role = overrides?.role || 'colaborador';

  return {
    id: u.id,
    email: u.email,
    name,
    role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function buildUserWithProfile(u) {
    if (!u) return null;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', u.id)
        .single();

      const overrides = {};
      if (profile?.full_name) overrides.name = profile.full_name;
      if (profile?.role) overrides.role = profile.role;

      return buildUserFromAuthUser(u, overrides);
    } catch (_error) {
      return buildUserFromAuthUser(u);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) {
          setUser(null);
        } else if (data?.session?.user) {
          const u = data.session.user;
          const built = await buildUserWithProfile(u);
          setUser(built);
        } else {
          setUser(null);
        }
      } catch (_error) {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sUser = session?.user;
      if (sUser) {
        buildUserWithProfile(sUser).then((built) => {
          setUser(built);
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const u = data.user;
    // Sincroniza profile em segundo plano, sem bloquear o login
    upsertProfile({
      id: u.id,
      email: u.email,
      fullName: u.user_metadata?.full_name || u.email,
    });
    const built = await buildUserWithProfile(u);
    setUser(built);
    return built;
  }

  async function register({ nome, email, senha }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          full_name: nome,
        },
      },
    });
    if (error) throw error;
    const u = data.user;
    if (!u) return null;
    // Sincroniza profile em segundo plano, sem bloquear o fluxo
    upsertProfile({
      id: u.id,
      email: u.email,
      fullName: nome || u.user_metadata?.full_name || u.email,
    });
    const built = buildUserFromAuthUser(u, { name: nome });
    setUser(built);
    return built;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
