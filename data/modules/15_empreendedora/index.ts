import { CourseSection } from '../../../lib/types';

export const empreendedoraSection: CourseSection = {
  id: '15_empreendedora',
  title: 'Curso Lash Empreendedora',
  brief: 'Eleve seu negócio de cílios para o próximo nível com gestão e marketing.',
  content: [
    { type: 'subsection_title', id: 'empreendedora_intro', content: 'Bem-vinda, Empreendedora!' },
    { type: 'paragraph', content: 'Este módulo é o seu guia para transformar sua paixão por cílios em um negócio lucrativo e sustentável. Vamos abordar precificação, marketing digital e gestão de clientes.' },
    { type: 'image_carousel', content: { 
        caption: 'Ferramentas para gestão e marketing do seu negócio.', 
        images: ['/images/empreendedora_1_1.png'] 
    } },
    { type: 'note', content: 'O conteúdo completo para este módulo estará disponível em breve. Parabéns por investir na sua carreira!' },
  ],
};