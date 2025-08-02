import { createClient } from '@supabase/supabase-js';
import { CourseType, Role } from '../../lib/types';

// Estas variáveis de ambiente devem ser definidas nas configurações do seu projeto Vercel.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("A URL do Supabase e a Chave de Serviço (Service Role Key) devem ser definidas nas variáveis de ambiente.");
}

// Define a estrutura para uma linha da tabela 'profiles'
export interface Profile {
    user_id: string;
    name: string;
    email: string;
    roles: Role[];
    course_type: CourseType;
    login_alias?: string | null;
}

// Define o schema do banco de dados para o cliente Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile; // O tipo de uma linha lida do DB
        Insert: Profile; // O tipo de uma linha a ser inserida
        Update: Partial<Profile>; // O tipo para uma atualização de linha
      };
    };
    Functions: {}; // Pode ficar vazio se não for usado
    Enums: {}; // Pode ficar vazio se não for usado
  };
}

// Cria um cliente único e compartilhado para todas as funções serverless
// Usando a chave de serviço para operações de administrador (como criar usuários)
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});