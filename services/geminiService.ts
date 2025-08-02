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
        // Faz a chamada para a nossa API de backend segura ('/api/tutor').
        const response = await fetch('/api/tutor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Envia a pergunta e a seção ativa no corpo da requisição em formato JSON.
            // O backend usará 'activeSection' para construir o contexto.
            body: JSON.stringify({ question, activeSection }),
        });

        const data = await response.json();

        // Se a resposta do nosso backend não for bem-sucedida (ex: erro 500, 400),
        // lança um erro com a mensagem que o backend nos enviou.
        if (!response.ok) {
            throw new Error(data.error || 'Falha ao buscar resposta do Tutor IA.');
        }

        // Se tudo correu bem, retorna o texto da resposta da IA.
        return data.text;

    } catch (error) {
        console.error("Erro ao chamar a API do Tutor IA via frontend service:", error);
        if (error instanceof Error) {
            return `Desculpe, ocorreu um erro ao contatar o Tutor IA: ${error.message}`;
        }
        return "Desculpe, ocorreu um erro desconhecido ao contatar o Tutor IA. Por favor, tente novamente mais tarde.";
    }
};