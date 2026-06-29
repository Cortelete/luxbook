import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API de listagem de usuárias desativada.
 * A listagem de usuárias foi migrada para o frontend, lendo de um arquivo local.
 * Esta rota foi mantida para evitar que chamadas antigas quebrem, 
 * mas agora retorna um erro informativo.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Allow', 'GET');
    res.status(410).json({ 
        message: 'This user listing service has been disabled.' 
    });
}
