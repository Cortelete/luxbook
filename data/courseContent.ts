import { CourseSection } from '../lib/types';

import { introSection } from './modules/01_intro/index';
import { fundamentosSection } from './modules/02_fundamentos/index';
import { tecnicaSection } from './modules/03_tecnica/index';
import { mappingSection } from './modules/04_mapping/index';
import { biologiaSection } from './modules/05_biologia/index';
import { biossegurancaSection } from './modules/06_biosseguranca/index';
import { kitSection } from './modules/07_kit/index';
import { aplicacaoSection } from './modules/08_aplicacao/index';
import { manutencaoSection } from './modules/09_manutencao/index';
import { remocaoSection } from './modules/10_remocao/index';
// Módulo 11 (horaDaAcao) é usado para o modal de dicas e não entra na navegação principal.
import { nossosCursosSection } from './modules/12_nossosCursos/index';
import { horaDaAcaoSection } from './modules/13_fim/index';
import { contatoSection } from './modules/14_contato/index';
import { empreendedoraSection } from './modules/15_empreendedora/index';
import { vipSection } from './modules/16_vip/index';

export const courseData: CourseSection[] = [
  introSection,
  fundamentosSection,
  tecnicaSection,
  mappingSection,
  biologiaSection,
  biossegurancaSection,
  kitSection,
  aplicacaoSection,
  manutencaoSection,
  remocaoSection,
  empreendedoraSection,
  vipSection,
  horaDaAcaoSection, // Graduation Gate leads here
  nossosCursosSection,
  contatoSection
];