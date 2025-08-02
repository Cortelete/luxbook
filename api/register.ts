import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabaseClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { profileName, loginId, password, courseType } = req.body;

    if (!profileName || !loginId || !password || !courseType) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    
    // Validação da senha
    if (password.length < 6 || !/\d/.test(password)) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres e conter pelo menos um número.' });
    }


    // Etapa 1: Criar a usuária no Supabase Auth usando o cliente admin.
    // Isso requer a chave de serviço (SERVICE_ROLE_KEY).
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: loginId,
        password: password,
        email_confirm: true, // Auto-confirma o email, já que o admin está criando
    });

    if (authError || !authData.user) {
        console.error('Erro na criação de usuária no Supabase:', authError?.message);
        const errorMessage = authError?.message.includes('unique constraint') 
            ? 'Este email já está em uso.'
            : authError?.message || 'Não foi possível criar a usuária.';
        return res.status(409).json({ message: errorMessage });
    }

    // Etapa 2: Criar o perfil correspondente na tabela 'profiles'.
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
            user_id: authData.user.id,
            name: profileName,
            roles: ['student'], // Novas usuárias sempre começam com o cargo 'student'.
            course_type: courseType,
        }]);

    if (profileError) {
        console.error('Erro na criação do perfil no Supabase:', profileError.message);
        // IMPORTANTE: Se a criação do perfil falhar, reverter deletando a usuária do auth para evitar órfãos.
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ message: `Falha ao criar perfil: ${profileError.message}` });
    }

    return res.status(201).json({ success: true, message: `Usuária "${profileName}" criada com sucesso!` });
}