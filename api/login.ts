import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userCredentials } from '../data/userCredentials';
import { UserData } from '../lib/types';

// Helper function to introduce a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(req: VercelRequest, res: VercelResponse) { // Handler is now async
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        // Adiciona um atraso deliberado de 750ms para dificultar ataques de força bruta.
        // O atraso é constante para sucessos e falhas, prevenindo ataques de temporização.
        await sleep(750);

        const { userId, accessCode } = req.body;

        if (!userId || !accessCode) {
            return res.status(400).json({ error: 'ID de Usuário e Código de Acesso são obrigatórios.' });
        }

        const sanitizedUserId = String(userId).trim().toLowerCase();
        const sanitizedAccessCode = String(accessCode).trim().toUpperCase();

        // Encontra a especificação da usuária pelo seu ID de usuário
        const userSpec = userCredentials.find(u => u.id.toLowerCase() === sanitizedUserId);

        if (userSpec) {
            // Obtém o código de acesso esperado das variáveis de ambiente
            const expectedCode = process.env[userSpec.accessCodeEnvKey];

            if (!expectedCode) {
                 console.error(`Vercel Serverless: Variável de ambiente não encontrada para a chave: ${userSpec.accessCodeEnvKey}`);
                 // Retorna um erro genérico para a usuária por segurança
                 return res.status(401).json({ error: 'ID de Usuário ou Código de Acesso inválido.' });
            }

            // Compara o código fornecido com o da variável de ambiente
            if (sanitizedAccessCode === expectedCode.toUpperCase()) {
                // Sucesso! Retorna os dados da usuária, mas sem informações sensíveis como a chave da env.
                const { accessCodeEnvKey, ...userData } = userSpec;
                return res.status(200).json(userData as UserData);
            }
        }

        // Se a usuária não for encontrada ou o código não corresponder, retorna erro de credenciais inválidas.
        return res.status(401).json({ error: 'ID de Usuário ou Código de Acesso inválido.' });

    } catch (error) {
        console.error("Erro na API de login:", error);
        return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
}