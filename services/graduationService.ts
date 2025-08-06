import { graduationCodes } from '../data/graduationCodes';

/**
 * Verifica se o código de formanda fornecido é válido.
 * A verificação é insensível a maiúsculas/minúsculas e ignora espaços
 * em branco no início e no fim para uma melhor experiência do usuário.
 * 
 * @param code - O código inserido pela aluna.
 * @returns true se o código for válido, false caso contrário.
 */
export function verifyGraduationCode(code: string): boolean {
    const sanitizedCode = code.trim().toLowerCase();
    return graduationCodes.has(sanitizedCode);
}
