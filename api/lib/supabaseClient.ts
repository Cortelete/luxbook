import { createClient } from '@supabase/supabase-js';

// Estas variáveis de ambiente devem ser definidas nas configurações do seu projeto Vercel.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("A URL do Supabase e a Chave de Serviço (Service Role Key) devem ser definidas nas variáveis de ambiente.");
}

// Cria um cliente único e compartilhado para todas as funções serverless
// Usando a chave de serviço para operações de administrador (como criar usuários)
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});