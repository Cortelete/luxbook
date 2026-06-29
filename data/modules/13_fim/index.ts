import { CourseSection } from '../../../lib/types';

export const horaDaAcaoSection: CourseSection = {
  id: 'horaDaAcao',
  title: '11. Hora da Ação',
  brief: 'Transforme conhecimento em sucesso e pegue suas dicas de ouro!',
  content: [
    { type: 'paragraph', content: 'Chegamos ao fim de um ciclo inesquecível. E antes de tudo, queremos deixar registrado o nosso mais profundo agradecimento a cada uma de vocês que fez parte desse curso.' },
    { type: 'paragraph', content: 'Durante esses dias de aprendizado, trocas e muita dedicação, vimos mais do que técnicas e conteúdos: vimos crescimento, empoderamento e brilho nos olhos.' },
    {
      type: 'paragraph',
      id: 'achievement_quote',
      content: 'Vocês chegaram com sonhos, e agora saem com novas habilidades, confiança e um propósito ainda mais claro — prontas para %%transformar vidas%% com sua arte!',
    },
    {
      type: 'paragraph',
      id: 'values_paragraph',
      content: 'A LuxAcademy tem o orgulho de formar profissionais com excelência, mas também mulheres fortes, seguras e prontas para o mercado, com valores que vão além da estética: %%Respeito%%, %%Entrega%% e %%Amor%% pelo que fazem.',
    },
    { type: 'paragraph', content: 'A cada pincelada de conhecimento, criamos juntas uma história que jamais será esquecida. E é só o começo. O universo Lash Designer é vasto, e estamos apenas na primeira página.' },
    { type: 'paragraph', content: 'Obrigada, de coração, por confiarem na nossa missão. Nos vemos em breve, no próximo curso, evento ou mentoria! A LuxAcademy está — e sempre estará — de portas abertas para vocês.' },
    { type: 'final_quote', content: 'Seu talento é a sua arte. Sua dedicação é o seu sucesso. Agora, vá e ilumine o mundo, um olhar de cada vez.' }
  ]
};
