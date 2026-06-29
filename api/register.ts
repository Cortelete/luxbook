import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API de registro de usuária desativada.
 * O sistema de cadastro foi migrado para um arquivo de configuração local no frontend.
 * Esta rota foi mantida para evitar que chamadas antigas quebrem, 
 * mas agora retorna um erro informativo.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Allow', 'POST');
    res.status(410).json({ 
        message: 'This user registration service has been disabled.'
    });
}
