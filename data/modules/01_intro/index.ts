import { CourseSection } from '../../../lib/types';

export const introSection: CourseSection = {
  id: 'intro',
  title: 'Olá, futura Lash de Sucesso!',
  brief: 'Sua jornada para se tornar uma especialista em cílios começa agora.',
  content: [
    { type: 'paragraph', content: 'Seja muito bem-vinda a este guia interativo! Meu nome é %%Joyci Almeida%%, e estou entusiasmada por ser sua guia no mundo da extensão de cílios. A decisão de entrar nesta área é o primeiro passo de uma jornada incrível, capaz de transformar não só a sua vida profissional, mas também a autoestima de muitas pessoas.' },
    { type: 'paragraph', content: 'Este não é apenas um guia, é o seu manual completo para dominar a técnica com %%segurança, precisão e excelência%%. Vamos construir uma base sólida para o seu sucesso!' },
    { type: 'subtitle', content: 'Uma Mentalidade de Sucesso' },
    { type: 'paragraph', content: 'Mais do que aprender a colar fios, você está aprendendo a ser uma empreendedora. Cultive a paciência, celebre cada pequena vitória e nunca perca a curiosidade. Seu crescimento é um processo contínuo. Estamos aqui para apoiar cada passo.' },
    { type: 'subsection_title', id: 'how-to-use', content: 'Como Aproveitar ao Máximo' },
    { type: 'list', content: [
      '**Explore sem Medo:** Use os cartões abaixo ou o menu lateral para navegar pelos módulos. Sinta-se à vontade para ir e voltar no conteúdo sempre que precisar reforçar um conceito.',
      '**Mão na Massa:** A teoria é a base, mas a prática leva à perfeição. Após cada seção teórica, reserve um tempo para praticar em uma esponja ou boneca de treino. A repetição é sua melhor amiga.'
    ]},
    { type: 'note', content: 'Lembre-se: não há atalhos para a perfeição, mas há um caminho. E nós vamos percorrê-lo juntas.' },
    { type: 'subsection_title', id: 'modules-title', content: 'Módulos de Aprendizagem' },
  ],
};