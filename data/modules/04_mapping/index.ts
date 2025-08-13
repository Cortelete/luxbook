import { CourseSection } from '../../../lib/types';

export const mappingSection: CourseSection = {
  id: 'mapping',
  title: '3. Mapping e Visagismo: A Arquitetura do Olhar',
  brief: 'Designs essenciais, personalização e guia prático.',
  content: [
    { type: 'subsection_title', id: 'mapping_designs', content: '3.1. Os 3 Designs Essenciais' },
    { type: 'paragraph', content: '%%Mapping%% é o mapa que você desenha no protetor de pálpebras (PAD) para guiar a aplicação.' },
    { type: 'image_carousel', content: { 
        caption: 'Ilustração clara dos 3 formatos de olho com o desenho do mapping sobre eles: Boneca, Gatinho e Esquilo, mostrando a distribuição dos tamanhos.', 
        images: [
            '/images/mapping_1_1.png', 
            '/images/mapping_1_2.png', 
            '/images/mapping_1_3.png'
        ] 
    } },
    { type: 'list', content: [
        '**1. Boneca (Doll Eye):** Fios maiores no centro do olho. **Efeito:** %%Abre e arredonda o olhar%%.',
        '**2. Gatinho (Cat Eye):** Fios crescem gradualmente do canto interno para o externo. **Efeito:** %%Alongando e levanta o olhar%%.',
        '**3. Esquilo (Squirrel):** O ponto alto (maior fio) fica no arco da sobrancelha. **Efeito:** %%Lifting natural%%, é o mais versátil e harmonioso.'
    ]},
    { type: 'subsection_title', id: 'mapping_visagismo', content: '3.2. Visagismo: A Arte de Personalizar para Cada Rosto e Olho' },
    { type: 'paragraph', content: '%%Visagismo%% é analisar as características únicas da cliente para criar o design perfeito.'},
    { type: 'image_carousel', content: { 
        caption: 'Exemplos de formatos de olho: Amendoado, Redondo e Caído.', 
        images: [
            '/images/mapping_2_1.png',
            '/images/mapping_2_2.png',
            '/images/mapping_2_3.png',
            '/images/mapping_2_4.png'
            
        ] 
    } },
    { type: 'table', content: {
        headers: ['Formato do Olho', 'Objetivo', 'Mapping Recomendado'],
        rows: [
            ['Redondos / Grandes', 'Alongar, criar um formato mais amendoado.', '%%Gatinho, Esquilo%%.'],
            ['Amendoados', 'Versátil, combina com tudo.', '%%Todos!%% Boneca realça, Gatinho alonga.'],
            ['Pequenos / Juntos', 'Abrir e dar a impressão de mais espaço.', '%%Boneca%%. Evitar o Gatinho muito marcado.'],
            ['Olhos Caídos', 'Levantar o canto externo.', '%%Esquilo é o melhor!%%']
        ]
    }},
    { type: 'subsection_title', id: 'mapping_guia', content: '3.3. Guia Prático: Desenhando o seu Primeiro Mapping' },
    { type: 'list', content: [
        '1. Com a cliente de olhos fechados, peça-lhe para olhar para cima. Marque com uma caneta o %%centro da íris%%, o %%canto interno%% e o %%canto externo%% no PAD.',
        '2. Divida o espaço em secções (geralmente %%5 a 7%%).',
        '3. Anote os tamanhos em cada secção de acordo com o design escolhido. Lembre-se de usar tamanhos menores (%%7-8mm%%) nos cantos internos para um acabamento natural.'
    ]},
     { type: 'image_carousel', content: { 
        caption: 'Exemplo de mapping desenhado no pad e espaço para sua prática.', 
        images: [
            '/images/mapping_3_1.png', 
            '/images/mapping_3_2.png'
        ] 
    } },
  ]
};