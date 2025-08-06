import { UserData } from '../lib/types';
import { userAccessCodes } from '../data/userCredentials';

// Helper function to introduce a delay, simulating processing time.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica as credenciais da usuária usando o ID de usuário e o código de acesso.
 * @param userId - O ID da usuária fornecido.
 * @param accessCode - O código de acesso fornecido.
 * @returns Uma Promise que resolve para os dados da usuária (UserData) em caso de sucesso, ou null em caso de falha.
 */
export async function verifyCredentials(userId: string, accessCode: string): Promise<UserData | null> {
    // Simula o tempo de processamento do servidor para segurança.
    await sleep(750);
    
    const sanitizedAccessCode = accessCode.trim().toUpperCase();
    const sanitizedUserId = userId.trim().toLowerCase();

    // Busca direta no objeto usando o código como chave.
    const userData = userAccessCodes[sanitizedAccessCode];

    // Se o código encontrou um usuário, verifica se o ID corresponde.
    if (userData && userData.id === sanitizedUserId) {
        return userData;
    }

    // Se o código não for encontrado ou o ID não corresponder, retorna null.
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