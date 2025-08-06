import { UserData } from '../lib/types';
import { userCredentials } from '../data/userCredentials';

/**
 * Retorna uma lista de todas as usuárias da base de dados local.
 * Usado pelo Painel Admin para exibir as alunas cadastradas.
 * @returns Um array de UserData.
 */
export function getUsers(): UserData[] {
    // Retorna uma lista ordenada de usuárias, omitindo a chave da variável de ambiente.
    return userCredentials
        .map(({ accessCodeEnvKey, ...userData }) => userData)
        .sort((a, b) => a.name.localeCompare(b.name));
}
