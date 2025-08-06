import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
// A Vercel resolverá este caminho relativo a partir da raiz do projeto.
import { CourseSection, ContentItem, TableData, ImageCarouselData } from '../lib/types';

/**
 * Converte um item de conteúdo do curso em uma string de texto simples (markdown).
 * Esta função limpa a formatação especial (como %%gold%%) para fornecer um contexto
 * limpo para a IA, além de estruturar listas e tabelas de forma legível.
 * @param item - O item de conteúdo a ser convertido.
 * @returns Uma string formatada em markdown representando o item.
 */
function stringifyItem(item: ContentItem): string {
    const cleanText = (text: string) => text.replace(/%%(.*?)%%/g, '$1').replace(/\*\*(.*?)\*\*/g, '$1');

    switch (item.type) {
        case 'paragraph':
        case 'note':
            return cleanText(item.content as string);
        case 'subsection_title':
            return `\n## ${cleanText(item.content as string)}\n`;
        case 'subtitle':
            return `\n### ${cleanText(item.content as string)}\n`;
        case 'list':
        case 'checklist':
            return (item.content as string[]).map(li => `- ${cleanText(li)}`).join('\n');
        case 'table':
            const table = item.content as TableData;
            const header = `| ${table.headers.join(' | ')} |`;
            const separator = `| ${table.headers.map(() => '---').join(' | ')} |`;
            const rows = table.rows.map(row => `| ${row.map(cleanText).join(' | ')} |`).join('\n');
            return `${header}\n${separator}\n${rows}`;
        // Tipos de conteúdo que são específicos da interface e não devem ir para o contexto da IA.
        case 'image_carousel':
        case 'contact_details':
        case 'tip_category':
        case 'course_offer':
        case 'final_quote':
            return '';
        default:
            return '';
    }
}


/**
 * O handler principal da Serverless Function.
 * Ele é o ponto de entrada da nossa API de backend.
 * 1. Recebe a requisição do frontend.
 * 2. Valida os dados recebidos.
 * 3. Constrói o contexto e a instrução para a IA.
 * 4. Chama a API do Gemini de forma segura.
 * 5. Retorna a resposta para o frontend.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Validação do Método da Requisição
    // Garante que apenas requisições do tipo POST sejam aceitas.
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    // 2. Segurança da Chave de API
    // Pega a chave da API das variáveis de ambiente do servidor Vercel.
    // Isso garante que a chave NUNCA seja exposta no código do navegador.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("Vercel Serverless: A variável de ambiente API_KEY não foi definida.");
        return res.status(500).json({ error: "O serviço de Tutor IA não está configurado corretamente no servidor." });
    }

    try {
        // 3. Extração e Validação dos Dados do Corpo da Requisição
        const { question, activeSection } = req.body as { question: string; activeSection: CourseSection };

        if (!question || !activeSection) {
            return res.status(400).json({ error: "Pergunta ou seção do curso ausentes na requisição." });
        }

        // 4. Geração do Contexto e da Instrução do Sistema
        // Converte o conteúdo da seção do curso em uma string de texto limpa para ser usada como contexto.
        const context = `${activeSection.title}\n\n${activeSection.content.map(stringifyItem).filter(Boolean).join('\n\n')}`;
        
        // A instrução do sistema guia o comportamento da IA.
        const systemInstruction = `Você é um tutor especialista em design de cílios, assistente de Joyci Almeida. Sua base de conhecimento é estritamente o manual de treinamento fornecido. Responda às perguntas dos alunos de forma clara, precisa e amigável, baseando-se apenas no conteúdo do seguinte manual: \n\n---\n${context}\n---\n\nSe a pergunta não puder ser respondida usando o manual, informe educadamente que você só pode responder a perguntas relacionadas ao conteúdo do módulo atual. Não invente informações. Mantenha as respostas concisas e diretas. Use markdown para formatação (negrito com **, listas com -) quando apropriado.`;

        // 5. Chamada da API do Gemini
        const ai = new GoogleGenAI({ apiKey });

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.4, // Um pouco mais determinístico para um tutor
                topK: 32,
                topP: 0.9,
            },
        });
        
        // 6. Envio da Resposta
        // Retorna a resposta de texto da IA para o frontend.
        res.status(200).json({ text: response.text });

    } catch (error) {
        console.error("Erro ao chamar a API do Gemini a partir da Vercel function:", error);
        res.status(500).json({ error: "Ocorreu um erro interno ao contatar o Tutor IA." });
    }
}