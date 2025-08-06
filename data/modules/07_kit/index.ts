import { CourseSection } from '../../../lib/types';

export const kitSection: CourseSection = {
  id: 'kit',
  title: '6. O seu Kit de Sucesso: Ferramentas e Materiais',
  brief: 'Materiais essenciais e a ciência por trás da cola.',
  content: [
      { type: 'subsection_title', id: 'kit_materiais', content: '6.1. Guia Detalhado de Materiais Essenciais' },
      { type: 'list', content: [
          '**Pinças:** No mínimo duas. Uma %%reta para isolamento%% e uma %%curva (ou em L) para aplicação%%.',
          '**Fios Tecnológicos:** Caixas "mix" (com vários tamanhos) são ideais para começar. Tenha pelo menos curvaturas "D" e "M".',
          '**Adesivo (Cola):** Específico para extensão de cílios, com %%registro na ANVISA%%.',
          '**Removedor:** Em %%creme ou gel%%. **NUNCA LÍQUIDO.**',
          '**Itens de Higienização:** Espuma de limpeza (shampoo de bebé diluído ou específico), primer ou higienizador.',
          '**Protetores de Pálpebra (Pads):** Para isolar os cílios inferiores.',
          '**Fita Micropore ou Transpore:** Para ajudar a levantar a pálpebra e expor os fios.',
          '**Pedra Jade ou Anel para Cola:** Para depositar a gota de adesivo.',
          '**Microbrush e Escovinhas:** Totalmente descartáveis.',
          '**Termo-higrômetro:** Medidor de temperatura e umidade. %%**OBRIGATÓRIO.**%%',
          '**Ventilador Portátil:** Para ajudar na secagem e aliviar qualquer desconforto da cliente.'
      ]},
      { type: 'subsection_title', id: 'kit_adesivo', content: '6.2. O Adesivo (Cola): A Ciência por Trás da Retenção Perfeita' },
      { type: 'paragraph', content: 'O principal componente da cola é o %%Cianoacrilato%%. Ele polimeriza (seca) em contato com a umidade do ar.' },
      { type: 'list', content: [
          '**Armazenamento:** Antes de aberto, guarde na embalagem original em local fresco e seco. Após aberto, guarde-o num %%"magic pack" com sílica%% para controlar a umidade, longe da luz e do calor. Nunca na geladeira.',
          '**Agitação:** Agite vigorosamente por %%1 minuto%% antes do primeiro uso do dia, e por %%30 segundos%% antes de cada nova gota.',
          '**A Gota Perfeita:** A gota de cola deve ser redonda e preta. Se estiver transparente ou grossa, descarte. Troque a sua gota a cada %%15-20 minutos%% durante o procedimento.'
      ]},
      { type: 'table', content: {
          headers: ['Fator', 'Impacto na Cola', 'Solução'],
          rows: [
              ['%%Umidade ALTA (>65%)%%', 'Seca rápido demais (falsa colagem)', 'Ligar desumidificador ou ar condicionado'],
              ['%%Umidade BAIXA (<45%)%%', 'Seca lento demais (fios grudam)', 'Usar umidificador ou nanomister'],
              ['%%Temperatura ALTA (>25°C)%%', 'Acelera a secagem, cola fica viscosa', 'Ligar ar condicionado'],
              ['%%Temperatura BAIXA (<19°C)%%', 'Retarda a secagem', 'Climatizar o ambiente']
          ]
      }}
  ]
};