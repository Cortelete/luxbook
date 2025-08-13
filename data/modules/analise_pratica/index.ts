import { CourseSection } from '../../../lib/types';

export const analisePraticaSection: CourseSection = {
  id: 'analise_pratica',
  title: '10. Análise Prática',
  brief: 'Teste seus conhecimentos analisando casos reais de visagismo e mapping.',
  content: [
    { type: 'paragraph', content: 'Agora é a hora de colocar seu olhar clínico para trabalhar! Analise as imagens a seguir, que representam diferentes formatos de olhos e desafios comuns. Para cada caso:'},
    { type: 'list', content: [
        "**Identifique o formato do olho:** É amendoado, redondo, caído, profundo?",
        "**Defina o objetivo:** O que você quer alcançar? Levantar, alongar, abrir o olhar?",
        "**Escolha o mapping ideal:** Seria Gatinho, Esquilo, Boneca ou uma variação?",
        "**Descreva a técnica:** Quais curvaturas e espessuras você usaria para alcançar o efeito desejado com segurança?"
    ]},
    {
      type: 'image_carousel',
      content: {
        caption: '',
        images: [
          '/images/analise_pratica_1.png',
          '/images/analise_pratica_2.png',
          '/images/analise_pratica_3.png',
          '/images/analise_pratica_4.png',
        ],
      },
    },
    { type: 'note', content: 'Discuta suas análises com suas colegas e com a Joyci. A troca de experiências é uma das ferramentas mais poderosas para o seu crescimento profissional.'}
  ],
};