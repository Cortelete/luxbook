import { CourseSection } from '../../../lib/types';

export const tecnicaSection: CourseSection = {
  id: 'tecnica',
  title: '2. A Técnica na Prática: Precisão e Arte',
  brief: 'Direcionamento, acoplagem, tipos de fios e análise.',
  content: [
    { type: 'subsection_title', id: 'tecnica_acoplagem', content: '2.1. Direcionamento e Acoplagem: O Segredo da Durabilidade' },
    { type: 'paragraph', content: 'A %%acoplagem%% é a forma como a base da extensão se une ao fio natural. Uma acoplagem perfeita é o segredo para uma retenção longa e um acabamento limpo.' },
    { type: 'list', content: [
      '**Distância Ideal:** A base da extensão deve ser colada a uma distância de %%0.5mm a 1mm da pálpebra%%. Nunca, em hipótese alguma, deve tocar na pele.',
      '**Área de Contato:** A base da extensão deve estar %%100% acoplada%% ao fio natural, sem pontas soltas.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'Ilustração detalhada mostrando a acoplagem correta, a distância da pálpebra, e exemplos de erros comuns: muita cola, base solta, colada na pele.', 
        images: [
            '/images/tecnica_1_1.png', 
            '/images/tecnica_1_2.png', 
            '/images/tecnica_1_3.png',
            '/images/tecnica_1_4.png',
            '/images/tecnica_1_5.png',
            '/images/tecnica_1_6.png',
            '/images/tecnica_1_7.png',
            '/images/tecnica_1_8.png',
            '/images/tecnica_1_9.png',
            '/images/tecnica_1_10.png',
            '/images/tecnica_1_11.png',
            '/images/tecnica_1_12.png',
            '/images/tecnica_1_13.png'
        ] 
    } },
    { type: 'table', content: {
      headers: ['Tipo de Acoplagem', 'Descrição', 'Quando Usar'],
      rows: [
        ['%%Por Cima%%', 'A extensão é colada sobre o fio natural.', 'Técnica mais comum, para fios com direção normal.'],
        ['%%Por Baixo%%', 'A extensão é colada por baixo do fio natural.', 'Ideal para fios que crescem retos ou para baixo, pois ajuda a levantar o olhar.'],
        ['%%Lateral%%', 'A extensão é colada na lateral do fio natural.', 'Usada para corrigir a direção de um fio natural "rebelde" ou torto.'],
      ]
    }},
    { type: 'subsection_title', id: 'tecnica_tipos', content: '2.2. Tipos de Fios e Técnicas: O seu Menu de Estilos' },
    { type: 'paragraph', content: 'Antes dos volumes, veio o %%Clássico Fio a Fio%%: a técnica de aplicar uma única extensão por fio natural. Hoje, os %%Volumes Tecnológicos%% dominam o mercado pela praticidade e qualidade. Existe o %%fio Ellipse%%, que é oco por dentro, sendo por isso mais macio e o mais indicado para aplicação em clientes. Já o %%fio cônico%% é mais adequado para treinos, por serem mais resistentes.' },
    { type: 'image_carousel', content: { 
        caption: 'Diferentes fans tecnológicos: Fio Y, Fio W e Volume Russo.', 
        images: [
            '/images/tecnica_2_1.png',
            '/images/tecnica_2_2.png',
            '/images/tecnica_2_3.png'
        ] 
    } },
    { type: 'table', content: {
        headers: ['Técnica / Volume', 'Formato do Fio', 'Efeito Criado', 'Ideal Para'],
        rows: [
            ['Clássico Fio a Fio', '1 fio único', '%%Efeito rímel%%, super natural.', 'Clientes que buscam discrição e definição.'],
            ['Volume Brasileiro', 'Fio em "Y"', '%%Leve volume%% com pontas texturizadas.', 'Transição do clássico para o volume.'],
            ['Volume Sirena/Fox', 'Fio em "L" ou "M"', '%%Efeito delineado%%, alonga o olhar.', 'Criar o famoso "fox eye" ou "efeito delineado".'],
            ['Volumes 4D, 5D (Russo), etc.', 'Tecnológico com 4, 5+ fios', '%%Alto volume%%, preenchimento e densidade.', 'Clientes que amam um olhar cheio e marcante, um look luxuoso e customizado.'],
            ['Capping', 'Fios "Y", "3D" e "4D"', 'Volume e personalização máximos, criando um look com %%durabilidade superior%%.', 'Perfeito para quem busca um efeito duradouro. Não contém manutenção (+30 dias).'],
            ['Express', 'Fios "Y", "5D", "4D", etc.', '%%Volume rápido%% e preenchimento instantâneo.', 'Otimizar tempo de aplicação, atender demanda rápida e oferecer volume imediato. Aplicado em 50% dos fios naturais.'],
        ]
    }},
    { type: 'subsection_title', id: 'tecnica_dominando', content: '2.3. Dominando as Curvaturas, Espessuras e Tamanhos' },
    { type: 'list', content: [
      '**Espessuras:** Para técnicas seguras, as espessuras mais usadas são %%0.05 e 0.07mm%% para volumes, e %%0.10 e 0.15mm%% para o clássico. Espessuras de 0.20mm ou mais são consideradas ultrapassadas e perigosas para a saúde do fio natural.',
      '**Tamanhos:** Medidos em milímetros (mm), geralmente de %%8mm a 15mm%%.',
      '**Curvaturas:** A curvatura define o nível de "curvatura" do fio.'
    ]},
     { type: 'image_carousel', content: { 
        caption: 'Comparativo das curvaturas mais comuns: C, D e M.', 
        images: [
            '/images/tecnica_3_1.png',
            '/images/tecnica_3_2.png',
            '/images/tecnica_3_3.png'
        ] 
    } },
    { type: 'table', content: {
      headers: ['Curvatura', 'Nível de Curvatura', 'Efeito'],
      rows: [
        ['%%C%%', 'Média', 'Natural, imita a curvatura da maioria dos cílios.'],
        ['%%CC%%', 'Média-Alta', 'Um pouco mais curvada que a C, "abre" mais o olhar.'],
        ['%%D%%', 'Alta', 'Bem curvada, efeito "boneca", super aberta.'],
        ['%%L / M%%', 'Base Reta', 'Efeito "lifting", levanta olhares caídos ou com pálpebra "gordinha".'],
      ]
    }},
    { type: 'subsection_title', id: 'tecnica_analise', content: '2.4. Análise do Fio Natural: A Regra de Ouro da Saúde Ocular' },
    { type: 'note', content: 'Atenção Máxima: A saúde do fio natural da sua cliente é a sua prioridade. Antes de tocar em qualquer extensão, você deve fazer uma análise criteriosa.' },
    { type: 'image_carousel', content: { 
        caption: 'Analisando a saúde e direção do fio natural antes do procedimento.', 
        images: [ '/images/tecnica_4_1.png' ] 
    } },
    { type: 'subtitle', content: 'Checklist de Análise do Fio Natural:' },
    { type: 'checklist', content: [
      '**Comprimento:** O fio natural é curto, médio ou longo? (A extensão pode ter no máximo %%2-3mm a mais%% que o fio natural).',
      '**Espessura:** O fio é fino, médio ou grosso? (Fios finos pedem extensões mais leves, como %%0.05 ou 0.07%%).',
      '**Densidade:** A cliente tem muitos fios ou poucos? (Isso influenciará na escolha do volume).',
      '**Direção:** Os fios crescem para cima, para a frente ou para baixo? (Isso influenciará na escolha da curvatura e da técnica de acoplagem).',
      '**Saúde:** Há falhas, fios quebradiços ou sinais de oleosidade excessiva?'
    ]}
  ]
};