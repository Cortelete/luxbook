import { UserData, CourseType } from '../lib/types';

/**
 * Envia credenciais de login para o endpoint de backend seguro para verificação.
 * @param username O email da usuária.
 * @param password A senha da usuária.
 * @returns Uma Promise que resolve para o objeto UserData se as credenciais forem válidas, caso contrário, null.
 */
export async function login(username: string, password: string): Promise<UserData | null> {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ loginId: username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            const errorData = await response.json();
            // Lançar o erro para que o componente de login possa capturá-lo
            throw new Error(errorData.message || 'ID de login ou senha inválidos.');
        }
    } catch (error) {
        console.error('Erro durante a requisição de login:', error);
        // Repassar o erro
        throw error;
    }
}


interface RegistrationData {
    profileName: string;
    loginId: string;
    password: string;
    courseType: CourseType;
}

/**
 * Envia os dados de uma nova usuária para o endpoint de backend seguro para criação.
 * Destinado ao uso pelo administrador.
 * @param data As informações da nova usuária.
 * @returns Um objeto indicando sucesso ou falha com uma mensagem correspondente.
 */
export async function registerUser(data: RegistrationData): Promise<{ success: boolean; message: string; }> {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        return { success: false, message: 'Erro de conexão ao tentar registrar. Verifique a internet e tente novamente.' };
    }
}