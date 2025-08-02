import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, initError } from './lib/supabaseClient';
import { UserData, Role } from '../lib/types';
import { JwtPayload, verify } from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (initError) {
        return res.status(500).json({ message: initError });
    }
    const supabaseClient = supabase!;

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).end('Method Not Allowed');
    }

    // --- Verificação de Segurança ---
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
    // --- Fim da Verificação ---

    try {
        // Etapa 1: Buscar todos os usuários do Supabase Auth
        const { data: { users: authUsers }, error: authError } = await supabaseClient.auth.admin.listUsers();
        if (authError) throw authError;

        // Etapa 2: Buscar todos os perfis da tabela 'profiles'
        const { data: profiles, error: profileError } = await supabaseClient.from('profiles').select('*');
        if (profileError) throw profileError;

        // Etapa 3: Mapear perfis para busca rápida
        const profilesMap = new Map(profiles.map(p => [p.user_id, p]));

        // Etapa 4: Combinar dados de autenticação e perfis
        const combinedUsers: UserData[] = authUsers.map(authUser => {
            const profile = profilesMap.get(authUser.id);
            return {
                id: authUser.id,
                name: profile?.name || authUser.user_metadata.name || 'Nome não encontrado',
                email: authUser.email!,
                roles: profile?.roles || authUser.user_metadata.roles || ['student'],
                courseType: profile?.course_type || 'Lash Profissional',
                loginAlias: profile?.login_alias,
            };
        }).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar por nome

        return res.status(200).json({ users: combinedUsers });

    } catch (error: any) {
        console.error("Erro ao buscar lista de usuários:", error);
        return res.status(500).json({ message: error.message || 'Erro interno do servidor ao buscar usuárias.' });
    }
}
