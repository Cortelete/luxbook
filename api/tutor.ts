import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CourseSection, ContentItem, TableData } from '../lib/types';

/**
 * Remove formatações especiais e converte itens em texto limpo.
 */
function stringifyItem(item: ContentItem): string {
  const cleanText = (text: string) =>
    text.replace(/%%(.*?)%%/g, '$1').replace(/\*\*(.*?)\*\*/g, '$1').trim();

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
      return (item.content as string[])
        .map((li) => `- ${cleanText(li)}`)
        .join('\n');
    case 'table':
      const table = item.content as TableData;
      const header = `| ${table.headers.join(' | ')} |`;
      const separator = `| ${table.headers.map(() => '---').join(' | ')} |`;
      const rows = table.rows
        .map((row) => `| ${row.map(cleanText).join(' | ')} |`)
        .join('\n');
      return `${header}\n${separator}\n${rows}`;
    // Tipos ignorados no contexto
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('Erro: API_KEY não configurada no ambiente.');
    return res
      .status(500)
      .json({ error: 'O serviço Tutor IA não está configurado corretamente.' });
  }

  try {
    const { question, activeSection } = req.body as {
      question: string;
      activeSection: CourseSection;
    };

    if (!question?.trim() || !activeSection?.content) {
      return res
        .status(400)
        .json({ error: 'Pergunta ou seção do curso ausente na requisição.' });
    }

    // Monta contexto do manual
    const context = `${activeSection.title}\n\n${activeSection.content
      .map(stringifyItem)
      .filter(Boolean)
      .join('\n\n')}`;

    // Instrução de sistema mais clara
    const systemInstruction = `
Você é um tutor especialista em design de cílios, assistente de Joyci Almeida.
Seu papel é responder **somente** com base no manual do módulo atual.
Regras:
- Seja clara, precisa e amigável.
- Use **markdown** para formatação (negrito, listas, tabelas).
- Não invente informações. Se não souber, diga que a resposta não está no manual.
- Respostas concisas, mas completas.
- Não repita a pergunta.
`.trim();

    // Prompt estruturado
    const userPrompt = `
MANUAL DO MÓDULO:
---
${context}
---

PERGUNTA DA ALUNA:
"${question}"
`.trim();

    // Inicializa cliente Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction,
    });

    // Gera resposta
    const result = await model.generateContent(userPrompt);

    const textResponse = result?.response?.text?.() || 'Não foi possível gerar resposta.';
    res.status(200).json({ text: textResponse });
  } catch (error: any) {
    console.error('Erro ao chamar Tutor IA:', error);
    res.status(500).json({
      error: 'Erro interno ao processar a solicitação do Tutor IA.',
      details: error?.message || error,
    });
  }
}
