import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userCredentials } from '../data/credentials';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res.status(400).json({ message: 'ID de login e senha são obrigatórios.' });
    }

    const sanitizedLoginId = loginId.toLowerCase().trim();
    const userCredential = userCredentials.get(sanitizedLoginId);

    // 1. Check if user exists in our data file
    if (!userCredential) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // 2. Construct the environment variable key from the loginId
    const passwordEnvVarKey = `PASSWORD_${sanitizedLoginId.toUpperCase()}`;
    const correctPassword = process.env[passwordEnvVarKey];
    
    // 3. Check if the password variable is set on the server
    if (!correctPassword) {
        console.error(`Vercel Serverless: Variável de ambiente de senha ${passwordEnvVarKey} não encontrada para o usuário ${sanitizedLoginId}.`);
        return res.status(500).json({ message: 'Erro de configuração do servidor para este usuário.' });
    }

    // 4. Compare the provided password with the one from environment variables
    if (password === correctPassword) {
        // SUCCESS: Passwords match. Return the user data.
        return res.status(200).json({ user: userCredential.data });
    } else {
        // FAILURE: Passwords do not match.
        return res.status(401).json({ message: 'Senha incorreta.' });
    }
}
