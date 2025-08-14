import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API do Tutor IA desativada.
 * Esta funcionalidade foi removida da aplicação.
 * Esta rota foi mantida para evitar que chamadas antigas quebrem, 
 * mas agora retorna um erro informativo.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Allow', 'POST');
    res.status(410).json({ 
        message: 'This AI Tutor service has been disabled.'
    });
}
