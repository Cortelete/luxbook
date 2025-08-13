import { CourseSection } from '../lib/types';

/**
 * Envia uma pergunta para o serviço de backend do Tutor IA.
 * 
 * Esta função é a ponte entre o frontend (o que a aluna vê) e o nosso backend seguro
 * que roda na Vercel. Ela não chama a API do Gemini diretamente, mas sim a nossa
 * própria API em '/api/tutor'.
 * 
 * Isso garante que a chave da API do Gemini permaneça segura no servidor e
 * nunca seja exposta no navegador.
 *
 * @param question - A pergunta que a usuária digitou no chat.
 * @param activeSection - O objeto completo da seção do curso que está ativa, para dar contexto à IA.
 * @returns Uma Promise que resolve para o texto da resposta da IA.
 */
export const askAiTutor = async (question: string, activeSection: CourseSection): Promise<string> => {
    try {
        const response = await fetch('/api/tutor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, activeSection }),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            let errorMessage = `Falha de comunicação com o servidor (${response.status})`;
            try {
                // Tenta interpretar o corpo do erro como JSON, que é o esperado da nossa API
                const errorData = JSON.parse(responseBody);
                errorMessage = errorData.error || errorData.details || errorMessage;
            } catch (e) {
                // Se não for JSON, é um erro inesperado (ex: página HTML de erro da Vercel)
                console.error("Servidor retornou uma resposta não-JSON:", responseBody);
            }
            throw new Error(errorMessage);
        }

        const data = JSON.parse(responseBody);

        if (!data.text) {
             throw new Error("A resposta do Tutor IA está vazia.");
        }
        
        return data.text;

    } catch (error) {
        console.error("Erro ao chamar a API do Tutor IA via frontend service:", error);
        if (error instanceof Error) {
            // A mensagem de erro agora será mais informativa.
            return `Desculpe, ocorreu um erro ao contatar o Tutor IA: ${error.message}`;
        }
        return "Desculpe, ocorreu um erro desconhecido ao contatar o Tutor IA. Por favor, tente novamente mais tarde.";
    }
};