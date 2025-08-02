import { UserData, CourseType, Role } from '../lib/types';
import type { Session } from '@supabase/supabase-js';

interface LoginResponse {
  user: UserData;
  session: Session;
}

const handleResponseError = async (response: Response, defaultMessage: string): Promise<never> => {
    let errorData;
    try {
        errorData = await response.json();
    } catch (e) {
        // The response was not JSON, maybe a Vercel error page (HTML/text)
        throw new Error(`Erro ${response.status}: Falha na comunicação com o servidor.`);
    }
    throw new Error(errorData.message || defaultMessage);
};

/**
 * Envia credenciais de login para o endpoint de backend seguro para verificação.
 * @param identifier O email ou ID de login da usuária.
 * @param password A senha da usuária.
 * @returns Uma Promise que resolve para o objeto com UserData e Session se as credenciais forem válidas.
 */
export async function login(identifier: string, password: string): Promise<LoginResponse | null> {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        });

        if (response.ok) {
            return await response.json();
        } else {
            await handleResponseError(response, 'ID de login ou senha inválidos.');
            return null; // Unreachable, but satisfies TypeScript
        }
    } catch (error) {
        console.error('Erro durante a requisição de login:', error);
        throw error;
    }
}


export interface RegistrationData {
    profileName: string;
    email: string;
    password: string;
    courseType: CourseType;
    roles: Role[];
    loginAlias?: string;
}

/**
 * Envia os dados de uma nova usuária para o endpoint de backend seguro para criação.
 * Requer um token de admin/boss para autorização.
 * @param data As informações da nova usuária.
 * @param token O JWT do administrador que está realizando a ação.
 * @returns Um objeto indicando sucesso ou falha com uma mensagem correspondente.
 */
export async function registerUser(data: RegistrationData, token: string): Promise<{ success: boolean; message: string; }> {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || 'Falha ao registrar usuária.' };
        }
    } catch (error) {
        console.error('Erro de conexão ao tentar registrar:', error);
        return { success: false, message: 'Erro de conexão. Verifique a internet e tente novamente.' };
    }
}


/**
 * Busca a lista de todas as usuárias do sistema.
 * Requer um token de admin/boss para autorização.
 * @param token O JWT do administrador que está realizando a ação.
 * @returns Uma Promise que resolve para um array de UserData.
 */
export async function getUsers(token: string): Promise<UserData[]> {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.users;
        } else {
             await handleResponseError(response, 'Falha ao buscar usuárias.');
             return []; // Unreachable
        }
    } catch (error) {
        console.error('Erro ao buscar lista de usuárias:', error);
        throw error;
    }
}