import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabaseClient';
import { UserData, CourseType } from '../lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { loginId, password } = req.body;

    if (typeof loginId !== 'string' || typeof password !== 'string' || !loginId || !password) {
        return res.status(400).json({ message: 'ID de login (email) e senha são obrigatórios.' });
    }

    // Etapa 1: Autenticar a usuária com o Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginId,
        password: password,
    });

    if (authError || !authData.user) {
        console.error('Erro de autenticação Supabase:', authError?.message);
        return res.status(401).json({ message: 'ID de login ou senha inválidos.' });
    }

    // Etapa 2: Buscar o perfil da usuária na tabela 'profiles'.
    // Esta tabela contém os dados customizados como cargos e tipo de curso.
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();
    
    if (profileError || !profileData) {
        console.error('Erro ao buscar perfil no Supabase:', profileError?.message);
        // Isso indica um problema de integridade de dados (usuária de auth existe, mas o perfil não).
        return res.status(404).json({ message: 'Perfil de usuária não encontrado. Contate o suporte.' });
    }

    // Etapa 3: Construir o objeto UserData para enviar de volta ao frontend.
    const userData: UserData = {
        name: profileData.name,
        roles: profileData.roles || ['student'], // Padrão para 'student' se os cargos não estiverem definidos
        loginId: authData.user.email!,
        courseType: profileData.course_type as CourseType,
    };

    return res.status(200).json({ user: userData });
}