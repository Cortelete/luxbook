import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CourseType, Role } from '../../lib/types';

// Define a structure for a linha da tabela 'profiles'
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


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const initError = (!supabaseUrl || !supabaseKey)
    ? "Variáveis de ambiente do Supabase (URL e Service Role Key) não foram configuradas no servidor."
    : null;

// The client will be null if there's an error, which is checked by the initError flag in API handlers.
export const supabase = initError ? null : createClient<Database>(supabaseUrl!, supabaseKey!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
