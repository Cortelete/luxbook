import { UserData } from '../lib/types';
import { userAccessCodes } from '../data/userCredentials';

/**
 * Verifica se um ID de usuário e código de acesso são válidos, comparando-os com a base de dados local.
 * A verificação não diferencia maiúsculas/minúsculas e ignora espaços para melhor UX.
 * @param userId O ID de usuário inserido pela usuária.
 * @param code O código de acesso inserido pela usuária.
 * @returns O objeto UserData correspondente se as credenciais forem válidas, caso contrário, null.
 */
export function verifyCredentials(userId: string, code: string): UserData | null {
    const sanitizedCode = code.trim().toUpperCase();
    const sanitizedUserId = userId.trim().toLowerCase();
    
    const user = userAccessCodes[sanitizedCode];

    if (user && user.id.toLowerCase() === sanitizedUserId) {
        return user;
    }
    
    return null;
}

/**
 * Retorna uma lista de todas as usuárias da base de dados local.
 * Usado pelo Painel Admin para exibir as alunas cadastradas.
 * @returns Um array de UserData.
 */
export function getUsers(): UserData[] {
    return Object.values(userAccessCodes).sort((a, b) => a.name.localeCompare(b.name));
}