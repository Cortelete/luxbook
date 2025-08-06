import { UserData } from '../lib/types';
import { userAccessCodes } from '../data/userCredentials';

/**
 * Verifica se um código de acesso é válido, comparando-o com a base de dados local.
 * A verificação não diferencia maiúsculas/minúsculas e ignora espaços para melhor UX.
 * @param code O código de acesso inserido pela usuária.
 * @returns O objeto UserData correspondente se o código for válido, caso contrário, null.
 */
export function verifyAccessCode(code: string): UserData | null {
    const sanitizedCode = code.trim().toUpperCase();
    
    if (userAccessCodes[sanitizedCode]) {
        return userAccessCodes[sanitizedCode];
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
