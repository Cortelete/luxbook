import { CourseSection } from '../../../lib/types';

export const biossegurancaSection: CourseSection = {
  id: 'biosseguranca',
  title: '5. Biossegurança: O Pilar do Profissionalismo',
  brief: 'Higienização em 3 níveis e esterilização de pinças.',
  content: [
    { type: 'subsection_title', id: 'biosseguranca_higienizacao', content: '5.1. A Importância da Higienização em 3 Níveis' },
    { type: 'list', content: [
      '**1. Pessoal:** Mãos sempre lavadas, uso de %%álcool 70%"", máscara descartável e cabelo preso. A sua higiene é o seu cartão de visita.',
      '**2. Ambiente:** Maca forrada com %%lençol descartável%% (trocado a cada cliente), ambiente limpo e organizado.',
      '**3. Material:** Tudo o que não é descartável deve ser devidamente %%higienizado e esterilizado%%.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'Ambiente de trabalho limpo e organizado, com materiais descartáveis.', 
        images: ['/images/biosseguranca_1_1.png', '/images/biosseguranca_1_2.png'] 
    } },
    { type: 'subsection_title', id: 'biosseguranca_esterilizacao', content: '5.2. Passo a Passo: Esterilização Correta das Pinças' },
    { type: 'list', content: [
      '**1. Lavar:** Logo após o uso, lave as pinças com %%água corrente e detergente neutro%% para remover qualquer resíduo de cola ou maquilhagem.',
      '**2. Secar:** Seque completamente com papel toalha.',
      '**3. Desinfetar:** Mergulhe as pinças numa solução de desinfetante de alto nível (seguindo as instruções do fabricante) ou em %%álcool 70%% por, no mínimo, 30 minutos.',
      '**4. Esterilizar (Ideal):** O padrão-ouro é a esterilização em %%estufa ou autoclave%%.'
    ]},
    { type: 'image_carousel', content: { 
        caption: 'Passos para esterilização: Lavagem, desinfecção e armazenamento seguro.', 
        images: ['/images/biosseguranca_2_1.png', '/images/biosseguranca_2_2.png', '/images/biosseguranca_2_3.png'] 
    } }
  ]
};