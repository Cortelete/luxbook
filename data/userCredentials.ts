import { UserData } from '../lib/types';

/**
 * Mapeia códigos de acesso únicos para os dados de cada usuária.
 * Este objeto funciona como a nova "base de dados" de usuárias.
 * 
 * Para adicionar uma nova aluna:
 * 1. Crie um código de acesso único e secreto para ela (ex: 'NOMEALUNA2025').
 * 2. Adicione uma nova entrada ao objeto `userAccessCodes`.
 * 3. Preencha os dados: id (pode ser o código em minúsculas), nome, email, cargos (geralmente ['student']) e o tipo de curso.
 */
export const userAccessCodes: Record<string, UserData> = {
  // --- Códigos de Administradores ---
  'LUXJOY42': { 
    id: 'user-boss', 
    name: 'Srta. Joyci de Fátima Almeida Amaro da Silva', 
    email: 'luxury.joycalmeida@gmail.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },
  'IARTE42': { 
    id: 'user-admin', 
    name: 'Davi Cortelete Alves de Oliveira', 
    email: 'admin@luxury.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },

  // --- Códigos de Alunas (TESTES) ---
  'TESTEVIP77': {
    id: 'vipteste1',
    name: 'Teste (VIP)',
    email: 'maria.vip@example.com',
    roles: ['student'],
    courseType: 'Lash Empresária VIP',
  },
  'TESTEEMP77': {
    id: 'empteste1',
    name: 'Teste (Empreendedora)',
    email: 'ana.empreendedora@example.com',
    roles: ['student'],
    courseType: 'Lash Empreendedora',
  },
  'TESTEPRO77': {
    id: 'proteste1',
    name: 'Teste (Profissional)',
    email: 'carla.profissional@example.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },

// --- Códigos de Alunas (REAIS) ---
    'LFM153PRO': {
    id: 'lorrainefm',
    name: 'Lorraine Franciny Miranda',
    email: 'lorrainefrancinymiranda1@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
    'RFC109PRO': {
    id: 'rafaellasc',
    name: 'Rafaella De Souza Cordeiro',
    email: 'rafaellacordeiro1902@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
};