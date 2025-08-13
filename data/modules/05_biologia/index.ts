import { CourseSection } from '../../../lib/types';

export const biologiaSection: CourseSection = {
  id: 'biologia',
  title: '4. Biologia e Saúde Ocular: A sua Prioridade',
  brief: 'Ciclo de vida dos fios, alergias e contraindicações.',
  content: [
    { type: 'subsection_title', id: 'biologia_ciclo', content: '4.1. O Ciclo de Vida dos Fios e o seu Impacto na Retenção' },
    { type: 'paragraph', content: 'Nossos cílios naturais têm 3 fases:' },
    { type: 'list', content: [
      '**1. Anágena (Bebé):** Fase de crescimento ativo. %%**NÃO APLICAMOS**%% extensões em fios muito curtos nesta fase, pois o peso pode prejudicar o seu desenvolvimento.',
      '**2. Catágena (Adolescente):** Fase de transição, o fio para de crescer. %%**É A FASE IDEAL**%% para a aplicação.',
      '**3. Telógena (Adulto):** Fase de repouso. O fio está "solto", prestes a cair. A extensão cairá junto com ele. É por isso que a manutenção é necessária.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'O ciclo de vida dos cílios: Anágena, Catágena e Telógena.', 
        images: [
          '/images/biologia_1_1.png',
          '/images/biologia_1_2.png'
        ] 
    } },
    { type: 'subsection_title', id: 'biologia_alergias', content: '4.2. Alergias vs. Irritação: Como Identificar, Prevenir e Agir' },
    { type: 'image_carousel', content: { 
        caption: 'Diferença visual entre irritação (vermelhidão no globo ocular) e alergia (inchaço na pálpebra).', 
        images: [
          '/images/biologia_2_1.png', 
          '/images/biologia_2_2.png',
          '/images/biologia_2_3.png'
        ] 
    } },
    { type: 'table', content: {
      headers: ['Característica', 'Irritação Química (Comum)', 'Reação Alérgica (Rara)'],
      rows: [
        ['Sintomas', '%%Vermelhidão no globo ocular%% (parte branca), ardência leve.', '%%Inchaço da pálpebra%%, vermelhidão na pele, coceira intensa, dor.'],
        ['Causa', 'Vapores do adesivo durante a cura.', 'Reação do sistema imunitário ao %%cianoacrilato%% (componente da cola).'],
        ['Quando Surge', 'Durante ou logo após o procedimento. Passa em 24h.', 'Pode levar de %%24 a 72 horas%% para se manifestar.'],
        ['Ação da Profissional', 'Usar ventilador, garantir que os olhos estão bem fechados.', '%%Remoção imediata%% e cuidadosa. Aconselhar a cliente a procurar um %%médico%%.']
      ]
    }},
    { type: 'subsection_title', id: 'biologia_contraindicacoes', content: '4.3. Contraindicações: Quando NÃO se deve fazer o procedimento' },
    { type: 'list', content: [
      '**Absolutas (NÃO FAZER):** Cliente com %%conjuntivite, blefarite, terçol%%, a passar por %%quimioterapia%%, ou com qualquer infeção ocular ativa.',
      '**Relativas (AVALIAR COM CUIDADO):** Cliente %%grávida ou a amamentar%% (pedir autorização médica), com olhos muito sensíveis, com gripe ou alergias respiratórias fortes no dia.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'Exemplos de condições que são contraindicações: blefarite e terçol.', 
        images: [
          '/images/biologia_3_1.png', 
          '/images/biologia_3_2.png',
          '/images/biologia_3_3.png'
        ] 
    } },
    { type: 'subsection_title', id: 'biologia_anamnese', content: '4.4. Ficha de Anamnese: A sua Ferramenta de Segurança Profissional' },
    { type: 'paragraph', content: 'É um questionário %%obrigatório%% que a cliente preenche e assina ANTES do primeiro procedimento. Ele protege você e a cliente. Perguntas essenciais de EXEMPLO:' },
    { type: 'image_carousel', content: { 
        caption: 'Modelo de Ficha de Anamnese preenchida.', 
        images: ['/images/biologia_4_1.png'] 
    } },
    { type: 'list', content: [
      'Já fez extensão de cílios antes? Teve alguma reação?',
      'Tem alergia a algum produto cosmético, esparadrapo ou látex?',
      'Tem algum problema de saúde ocular (glaucoma, olho seco, etc.)?',
      'Fez alguma cirurgia nos olhos recentemente?',
      'Está grávida ou a amamentar?',
      'Usa lentes de contacto?',
      '**CONSULTAR DOCUMENTO DE %%FICHA DE ANAMNESE%%**'
    ]}
  ]
};