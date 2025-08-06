import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API de login desativada.
 * O sistema de autenticação foi migrado para um código de acesso local no frontend.
 * Esta rota foi mantida para evitar que chamadas antigas quebrem, 
 * mas agora retorna um erro informativo.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Allow', 'POST');
    res.status(410).json({ 
        message: 'This login service has been disabled.' 
    });
}
