import { CourseSection } from '../../../lib/types';

export const manutencaoSection: CourseSection = {
  id: 'manutencao',
  title: '8. Manutenção: A Chave da Fidelização',
  brief: 'Avaliação, remoção de extensões e preenchimento.',
  content: [
    { type: 'subsection_title', id: 'manutencao_avaliacao', content: '8.1. Avaliação e Preparação para a Manutenção' },
    { type: 'paragraph', content: 'Cada manutenção começa com uma análise detalhada.' },
    { type: 'list', content: [
      '**Análise do Crescimento:** Peça para a cliente deitar-se e, com uma escovinha de cílios, penteie os fios. Observe quais extensões cresceram, quais estão viradas ou soltas, e onde há falhas. Lembre-se: considera-se manutenção quando a cliente retorna com, no mínimo, %%50% das extensões%%.',
      '**Higienização Cuidadosa:** Repita o processo de higienização com o shampoo para cílios.',
      '**Isolamento dos Cílios Inferiores:** Como na aplicação, utilize pads de gel ou fita micropore.',
      '**Finalização igual aplicação (Consultar 7.4.)**'
    ]},
    { type: 'subsection_title', id: 'manutencao_remocao', content: '8.2. Remoção de Extensões Crescidas ou Soltas' },
    { type: 'list', content: [
      '**Remoção de Extensões Soltas:** Extensões que estão prestes a cair ou já estão muito soltas podem ser removidas delicadamente com a pinça.',
      '**Remoção de Extensões Crescidas:** Com a pinça de isolamento, separe o fio natural que cresceu e puxe a extensão na direção do crescimento. Se não sair facilmente, utilize uma pasta %%removedora ou gel (NÃO LÍQUIDO)%% pontualmente.',
      '**Remoção Manual (para fios que se soltam facilmente):** Às vezes, as extensões que cresceram muito já estão com a adesão fraca. Nestes casos, com a pinça, você pode gentilmente deslizar a extensão para fora do fio natural.',
      '**Evitar cristalização da cola residual:** Passe a pinça da base até a ponta, em seguida um lenço para ter certeza de que todo produto foi retirado %%antes da higienização%%.'
    ]},
    { type: 'subsection_title', id: 'manutencao_preenchimento', content: '8.3. Preenchimento de Falhas e Realinhamento' },
    { type: 'list', content: [
      '**Preparação dos Fios Naturais:** Após remover as extensões necessárias, penteie os cílios naturais novamente e aplique uma pequena quantidade de %%primer%% nos fios que irão receber as novas extensões.',
      '**Aplicação de Novas Extensões:** Preencha as falhas seguindo a mesma técnica de aplicação fio a fio descrita no item 7.2. Atente-se ao design original e tente manter a %%simetria entre os olhos%%.',
      '**Verificação Final:** Ao concluir o preenchimento, penteie os cílios novamente. Verifique se todas as extensões estão bem acopladas e o volume está equilibrado. Utilize o %%nano mister%%.'
    ]},
    { type: 'image_carousel', content: { 
        caption: '', 
        images: [
          '/images/manutencao_3_1.png',
          '/images/manutencao_3_2.png'
        ] 
    } }
  ]
};