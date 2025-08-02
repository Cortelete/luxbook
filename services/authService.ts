import { userCredentials } from '../lib/credentials';
import { UserData, CourseType } from '../lib/types';

/**
 * Sends login credentials to a secure backend endpoint for verification.
 * @param username The username entered by the user.
 * @param password The password entered by the user.
 * @returns A Promise that resolves to the UserData object if credentials are valid, otherwise null.
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
            // The API will send back specific error messages
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);
            return null;
        }
    } catch (error) {
        console.error('Error during login fetch:', error);
        return null;
    }
}

interface RegistrationResult {
    success: boolean;
    message: string;
}

/**
 * Pre-validates new user data and provides instructions for the admin.
 * This function does NOT create the user; it serves as a secure helper for the admin.
 * @param profileName The desired display name for the user.
 * @param loginId The desired login ID for the user.
 * @param password The user's password.
 * @param courseType The user's course type.
 * @returns An object indicating success or failure with a corresponding message.
 */
export function prepareRegistration(profileName: string, loginId: string, password: string, courseType: CourseType): RegistrationResult {
    const sanitizedLoginId = loginId.toLowerCase().trim();

    if (!profileName || !sanitizedLoginId || !password) {
         return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    if (userCredentials.has(sanitizedLoginId)) {
        return { success: false, message: 'Este ID de login já está em uso. Por favor, escolha outro.' };
    }
    
    const newUserObjectString = `
['${sanitizedLoginId}', {
  data: { 
    name: '${profileName.trim()}', 
    roles: ['student'],
    loginId: '${sanitizedLoginId}',
    courseType: '${courseType}'
  } 
}]`;

    const envVarName = `PASSWORD_${sanitizedLoginId.toUpperCase()}`;

    const successMessage = `
        <div class="text-left text-sm space-y-4">
            <p class="font-bold text-green-400">✅ Pré-Cadastro validado com sucesso!</p>
            <p>Para finalizar, siga os 2 passos seguintes:</p>
            <div>
                <strong class="text-white">1. Edite o arquivo do código:</strong>
                <p>Copie o bloco de código abaixo e cole dentro do Map no arquivo <code class="bg-gray-700 p-1 rounded text-gold">lib/credentials.ts</code>.</p>
                <pre class="bg-gray-800 text-xs p-3 rounded-lg mt-2 overflow-x-auto"><code>${newUserObjectString}</code></pre>
            </div>
            <div>
                <strong class="text-white">2. Crie a Senha na Vercel:</strong>
                <p>Vá para o painel do seu projeto na Vercel, navegue até "Settings" > "Environment Variables" e adicione uma nova variável:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Nome:</strong> <code class="bg-gray-700 p-1 rounded text-gold">${envVarName}</code></li>
                    <li><strong>Valor:</strong> <code class="bg-gray-700 p-1 rounded text-gold">${password}</code></li>
                </ul>
                <p class="mt-2">Após salvar, faça o deploy novamente para aplicar as alterações.</p>
            </div>
        </div>
    `;

    return { success: true, message: successMessage };
}