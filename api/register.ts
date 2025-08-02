import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, initError } from './lib/supabaseClient';
import { CourseType, Role } from '../lib/types';
import { JwtPayload, verify } from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (initError) {
        return res.status(500).json({ message: initError });
    }
    const supabaseClient = supabase!;

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    // --- Aprimoramento de Segurança: Verificação de token JWT ---
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso não autorizado: token ausente.' });
    }
    if (!jwtSecret) {
        console.error("CRITICAL: SUPABASE_JWT_SECRET environment variable not set.");
        return res.status(500).json({ message: "Configuração de segurança do servidor incompleta." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = verify(token, jwtSecret) as JwtPayload;
        const userRoles = decodedToken?.user_metadata?.roles as Role[] | undefined;

        if (!userRoles || (!userRoles.includes('admin') && !userRoles.includes('boss'))) {
           return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
        }

    } catch (error) {
        console.error("Erro na validação do token:", error);
        return res.status(401).json({ message: 'Acesso não autorizado: token inválido.' });
    }
    // --- Fim da verificação de segurança ---

    const { profileName, email, password, courseType, roles, loginAlias }: {
        profileName: string;
        email: string;
        password: string;
        courseType: CourseType;
        roles: Role[];
        loginAlias?: string;
    } = req.body;

    if (!profileName || !email || !password || !courseType || !roles) {
        return res.status(400).json({ message: 'Campos essenciais (nome, email, senha, tipo de curso, cargos) são obrigatórios.' });
    }
    
    if (password.length < 6 || !/\d/.test(password)) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres e conter pelo menos um número.' });
    }

    // Etapa 1: Criar a usuária no Supabase Auth
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            name: profileName,
            roles: roles,
        }
    });

    if (authError || !authData.user) {
        console.error('Erro na criação de usuária no Supabase:', authError?.message);
        const errorMessage = authError?.message.includes('unique constraint') 
            ? 'Este email já está em uso.'
            : authError?.message || 'Não foi possível criar a usuária.';
        return res.status(409).json({ message: errorMessage });
    }

    // Etapa 2: Criar o perfil correspondente na tabela 'profiles'.
    const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
            user_id: authData.user.id,
            name: profileName,
            email: email, // Store email here for easier lookup if needed
            roles: roles,
            course_type: courseType,
            login_alias: loginAlias || null,
        });

    if (profileError) {
        console.error('Erro na criação do perfil no Supabase:', profileError.message);
        const errorMessage = profileError.message.includes('duplicate key value violates unique constraint "profiles_login_alias_key"')
            ? `O ID de Login "${loginAlias}" já está em uso.`
            : `Falha ao criar perfil: ${profileError.message}`;

        await supabaseClient.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ message: errorMessage });
    }

    return res.status(201).json({ success: true, message: `Usuária "${profileName}" criada com sucesso!` });
}