import { supabase } from './supabaseClient.js';

export async function upsertProfile({ id, email, fullName, role }) {
  if (!id || !email) return;

  const payload = {
    id,
    email,
    full_name: fullName,
  };

  if (role) {
    payload.role = role;
  }

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    // Aqui apenas registramos em console; em produção você pode mandar para um serviço de log
    // ou exibir algum aviso mais amigável.
    // console.error('Erro ao sincronizar profile:', error);
  }
}
