
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userCredentials } from '../lib/credentials';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    if (!req.body) {
        return res.status(400).json({ message: 'Corpo da requisição ausente.' });
    }

    const { loginId, password } = req.body;

    // Add strict validation to ensure inputs are strings before using string methods.
    // This prevents a server crash if the request body is malformed.
    if (typeof loginId !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: 'ID de login e senha são obrigatórios e devem ser strings.' });
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

    // 4. Compare the provided password with the one from environment variables, trimming both.
    if (password.trim() === correctPassword.trim()) {
        // SUCCESS: Passwords match. Return the user data.
        return res.status(200).json({ user: userCredential.data });
    } else {
        // FAILURE: Passwords do not match.
        return res.status(401).json({ message: 'Senha incorreta.' });
    }
}