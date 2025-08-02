import { CourseSection } from './lib/types';

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
import { nossosCursosSection } from './modules/12_nossosCursos/index';
import { horaDaAcaoSection } from './modules/13_fim/index';
import { contatoSection } from './modules/14_contato/index';
import { adminSection } from './adminContent';

export const courseData: CourseSection[] = [
  introSection,
  adminSection, // Included for access, but filtered in UI
  fundamentosSection,
  tecnicaSection,
  mappingSection,
  biologiaSection,
  biossegurancaSection,
  kitSection,
  aplicacaoSection,
  manutencaoSection,
  remocaoSection,
  horaDaAcaoSection,
  nossosCursosSection,
  contatoSection
];