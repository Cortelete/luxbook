import { UserData } from '../lib/types';
import { userAccessCodes } from '../data/userCredentials';

// Helper function to introduce a delay, simulating processing time.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica as credenciais da usuária usando o sistema antigo (código de acesso como chave).
 * @param accessCode - O código de acesso fornecido.
 * @returns Uma Promise que resolve para os dados da usuária (UserData) em caso de sucesso, ou null em caso de falha.
 */
export async function verifyCredentials(accessCode: string): Promise<UserData | null> {
    // Simula o tempo de processamento do servidor para segurança.
    await sleep(750);
    
    const sanitizedAccessCode = accessCode.trim().toUpperCase();

    // Busca direta no objeto usando o código como chave.
    const userData = userAccessCodes[sanitizedAccessCode];

    if (userData) {
        return userData;
    }

    // Se o código não for encontrado, retorna null.
    return null;
}

/**
 * Retorna uma lista de todas as usuárias da base de dados local.
 * @returns Um array de UserData.
 */
export function getUsers(): UserData[] {
    // Usa Object.values para obter todos os dados de usuária do objeto.
    return Object.values(userAccessCodes)
        .sort((a, b) => a.name.localeCompare(b.name));
}
