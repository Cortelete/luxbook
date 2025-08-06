import { CourseSection } from '../../../lib/types';

export const contatoSection: CourseSection = {
  id: 'contato',
  title: 'Entre em Contato',
  brief: 'Adoraríamos ouvir de você! Seja para dúvidas, sugestões ou parcerias, use os canais abaixo para falar diretamente com a Joy.',
  content: [
      { type: 'contact_details', content: '' },
      { type: 'note', content: 'O tempo de resposta pode variar. Agradecemos a sua paciência!' },
  ]
};