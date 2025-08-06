import { UserData } from '../lib/types';
import { userCredentials } from '../data/userCredentials';

// Helper function to introduce a delay, simulating processing time.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Verifica as credenciais da usuária.
 * Esta função agora roda no cliente, mas inclui um atraso para dificultar ataques.
 * @param userId - O ID de usuário fornecido.
 * @param accessCode - O código de acesso fornecido.
 * @returns Uma Promise que resolve para os dados da usuária (UserData) em caso de sucesso, ou null em caso de falha.
 */
export async function verifyCredentials(userId: string, accessCode: string): Promise<UserData | null> {
    // Simula o tempo de processamento do servidor para segurança.
    await sleep(750);
    
    const sanitizedUserId = userId.trim().toLowerCase();
    const sanitizedAccessCode = accessCode.trim().toUpperCase();

    const userSpec = userCredentials.find(u => u.id.toLowerCase() === sanitizedUserId);

    if (userSpec && userSpec.accessCode.toUpperCase() === sanitizedAccessCode) {
        // Se as credenciais estiverem corretas, retorna os dados da usuária sem o código de acesso.
        const { accessCode, ...userData } = userSpec;
        return userData;
    }

    // Se não encontrar ou a senha estiver incorreta, retorna null.
    return null;
}

/**
 * Retorna uma lista de todas as usuárias da base de dados local.
 * Usado pelo Painel Admin para exibir as alunas cadastradas.
 * @returns Um array de UserData.
 */
export function getUsers(): UserData[] {
    // Retorna uma lista ordenada de usuárias, omitindo o código de acesso.
    return userCredentials
        .map(({ accessCode, ...userData }) => userData)
        .sort((a, b) => a.name.localeCompare(b.name));
}
