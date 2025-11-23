import { createClient } from '@supabase/supabase-js';

// Estes valores são públicos no front-end, mas a chave de serviço (secreta) nunca deve ir para o cliente.
const SUPABASE_URL = 'https://gdtmzwldfcxyjlttjabt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdG16d2xkZmN4eWpsdHRqYWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDMxNDQsImV4cCI6MjA3OTQ3OTE0NH0.P1pmJ40D7U-QkeJ1qcs7Xyc63D48GDABkpNUDBLPLkk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
