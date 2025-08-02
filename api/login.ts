import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, initError } from './lib/supabaseClient';
import { UserData, CourseType } from '../lib/types';
import type { User, Session } from '@supabase/supabase-js';

// Função auxiliar para buscar o perfil e construir o objeto UserData
async function getUserProfile(user: User): Promise<UserData | null> {
    if (!supabase) return null; // Should not happen due to initError check

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
    
    if (profileError || !profileData) {
        console.error(`Erro ao buscar perfil para user_id ${user.id}:`, profileError?.message);
        return null;
    }

    const userData: UserData = {
        id: profileData.user_id,
        name: profileData.name,
        roles: profileData.roles || ['student'],
        email: user.email!,
        courseType: profileData.course_type as CourseType,
        loginAlias: profileData.login_alias,
    };
    return userData;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (initError) {
            return res.status(500).json({ message: initError });
        }
        // We know supabase is not null here due to the check above
        const supabaseClient = supabase!;

        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).end('Method Not Allowed');
        }

        const { identifier, password }: { identifier: string; password: string; } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identificador (email/alias) e senha são obrigatórios.' });
        }

        // Etapa 1: Tentar fazer login
        let signInResponse = await supabaseClient.auth.signInWithPassword({
            email: identifier,
            password: password,
        });

        // Se o login inicial falhar, verifique se o identificador é um alias e tente novamente.
        if (signInResponse.error) {
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('email')
                .eq('login_alias', identifier)
                .single();

            // Se um perfil com o alias existir, tente o login com o email real.
            if (profile?.email) {
                signInResponse = await supabaseClient.auth.signInWithPassword({
                    email: profile.email,
                    password: password,
                });
            }
        }
        
        // Após todas as tentativas, se ainda houver um erro ou não houver dados, falhe.
        if (signInResponse.error || !signInResponse.data.user || !signInResponse.data.session) {
            return res.status(401).json({ message: 'ID de login ou senha inválidos.' });
        }
        
        // Desestruture a resposta bem-sucedida
        const { user, session } = signInResponse.data;

        // Etapa 2: Buscar o perfil da usuária
        const userData = await getUserProfile(user);
        if (!userData) {
            return res.status(404).json({ message: 'Perfil de usuária não encontrado. Contate o suporte.' });
        }

        // Etapa 3: Retornar o perfil e a sessão (que contém o token JWT)
        return res.status(200).json({ user: userData, session: session });

    } catch (error) {
        console.error('[API Login Error]: Uncaught exception', error);
        return res.status(500).json({ message: "Ocorreu um erro inesperado no servidor." });
    }
}