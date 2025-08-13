import { CourseSection } from '../../../lib/types';

export const fundamentosSection: CourseSection = {
  id: 'fundamentos',
  title: '1. Fundamentos da Extensão de Cílios',
  brief: 'O que são, por que são populares e o ciclo do serviço.',
  content: [
    { type: 'subsection_title', id: 'fundamentos_oquee', content: '1.1. O que é Extensão de Cílios e Por Que é Tão Popular?' },
    { type: 'paragraph', content: 'A extensão de cílios é uma técnica artística e meticulosa que consiste na aplicação de %%fios sintéticos%% (não se usam mais) ou %%tecnológicos%%, um a um, sobre os fios naturais. O objetivo é realçar o olhar, adicionando %%volume, comprimento e curvatura%% de forma personalizada.' },
    { type: 'paragraph', content: 'Mais do que um procedimento estético, a extensão de cílios é uma ferramenta de empoderamento. Ela oferece:'},
    { type: 'list', content: [
      '**Praticidade:** A cliente acorda %%"pronta"%%, economizando tempo na maquilhagem diária.',
      '**Confiança:** Um olhar marcante %%eleva a autoestima%% e a autoconfiança.',
      '**Versatilidade:** Permite criar desde looks %%"super naturais"%% até os mais %%dramáticos e glamorosos%%.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'Exemplos de looks possíveis com a extensão de cílios, do natural ao glamoroso.', 
        images: [
            '/images/fundamentos_1_1.png', 
            '/images/fundamentos_1_2.png',
            '/images/fundamentos_1_3.png',
            '/images/fundamentos_1_4.png',
            '/images/fundamentos_1_5.png',
            '/images/fundamentos_1_6.png',
        ] 
    } },
    { type: 'subsection_title', id: 'fundamentos_ciclo', content: '1.2. O Ciclo do Serviço: Aplicação, Manutenção e Remoção' },
    { type: 'paragraph', content: 'O seu relacionamento com a cliente passará por estas três fases. Dominá-las é fundamental.'},
    { type: 'list', content: [
      '**1. Aplicação (A Primeira Impressão):** É o primeiro procedimento, onde se constrói o design do zero. É a sua oportunidade de %%encantar a cliente%% com a sua técnica e o seu atendimento. Devendo durar, no máximo, de %%2 a 3 horas%% para iniciantes, e %%1 a 2 horas%% para quem já tem prática.',
      '**2. Manutenção (A Fidelização):** Realizada a cada %%15 a 21 dias%%. Neste serviço, você higieniza, remove as extensões que cresceram junto com o fio natural e preenche as falhas. Uma manutenção bem-feita garante um look impecável e a saúde dos fios, sendo a chave para %%fidelizar a cliente%%. Considera-se manutenção quando a cliente retorna com, no mínimo, %%50% das extensões%%.',
      '**3. Remoção (O Cuidado Final):** É a retirada completa e segura de todas as extensões, utilizando um produto específico ou manually. É um procedimento delicado que, quando bem executado, mostra o seu %%profissionalismo e cuidado%% com a saúde da cliente.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'As fases do serviço: a aplicação inicial, a manutenção periódica e a remoção segura.', 
        images: [
            '/images/fundamentos_2_1.png', 
            '/images/fundamentos_2_2.png',
            '/images/fundamentos_2_3.png',
            '/images/fundamentos_2_4.png',
            '/images/fundamentos_2_5.png',
            '/images/fundamentos_2_6.png',
            '/images/fundamentos_2_7.png',
            '/images/fundamentos_2_8.png',
            '/images/fundamentos_2_9.png',
            '/images/fundamentos_2_10.png'
        ] 
    } }
  ]
};