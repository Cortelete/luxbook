import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabaseClient';
import { UserData, CourseType, Role } from '../lib/types';
import type { User, Session } from '@supabase/supabase-js';

// Função auxiliar para buscar o perfil e construir o objeto UserData
async function getUserProfile(user: User): Promise<UserData | null> {
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
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { identifier, password }: { identifier: string; password: string; } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ message: 'Identificador (email/alias) e senha são obrigatórios.' });
    }

    let authResponse: { data: { user: User; session: Session; } | null, error: Error | null } | null = null;
    let effectiveEmail = identifier;

    // Etapa 1: Tentar fazer login com o identificador como se fosse um email
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
    });

    if (signInError) {
        // Se falhar e o erro NÃO for de email inválido, pode ser uma senha incorreta para um alias.
        // Vamos verificar se o identificador é um alias.
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('login_alias', identifier)
            .single();

        if (profile && profile.email) {
            effectiveEmail = profile.email;
            // Tentar login novamente com o email encontrado
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: effectiveEmail,
                password: password,
            });

            if (retryError) {
                 return res.status(401).json({ message: 'ID de login ou senha inválidos.' });
            }
            authResponse = { data: retryData, error: retryError };

        } else {
             // Se não for encontrado um alias, o erro original de login é válido.
             return res.status(401).json({ message: 'ID de login ou senha inválidos.' });
        }
    } else {
        authResponse = { data: signInData, error: signInError };
    }
    
    if (!authResponse.data?.user || !authResponse.data.session) {
         return res.status(401).json({ message: 'ID de login ou senha inválidos.' });
    }

    // Etapa 2: Buscar o perfil da usuária
    const userData = await getUserProfile(authResponse.data.user);
    if (!userData) {
         return res.status(404).json({ message: 'Perfil de usuária não encontrado. Contate o suporte.' });
    }

    // Etapa 3: Retornar o perfil e a sessão (que contém o token JWT)
    return res.status(200).json({ user: userData, session: authResponse.data.session });
}