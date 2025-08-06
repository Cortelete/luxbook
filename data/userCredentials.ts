import { UserData } from '../lib/types';

/**
 * Mapeia códigos de acesso únicos para os dados de cada usuária.
 * Este objeto funciona como a "base de dados" de usuárias.
 * A CHAVE do objeto é o CÓDIGO DE ACESSO em maiúsculas.
 * 
 * Para adicionar uma nova aluna:
 * 1. Crie um código de acesso único e secreto para ela (ex: 'NOMEALUNA2025').
 * 2. Adicione uma nova entrada a este objeto `userAccessCodes` usando o código como chave.
 * 3. Preencha os dados: id (pode ser um id único em minúsculas), nome, email, cargos e o tipo de curso.
 */
export const userAccessCodes: Record<string, UserData> = {
  // --- Códigos de Administradores e Gerência ---
  'IARTE42': { 
    id: 'iarte.ia', 
    name: 'Davi Cortelete Alves de Oliveira', 
    email: 'iarte.ctt@gmail.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },
  'LUX42JOY': { 
    id: 'superjoy', 
    name: 'Joyci de Fátima Almeida Amaro da Silva', 
    email: 'luxury.joycialmeida@gmail.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },

  // --- Códigos de Alunas (TESTES) ---
  'VIPTESTE1': {
    id: 'vipteste1',
    name: 'Teste (VIP)',
    email: 'maria.vip@example.com',
    roles: ['student'],
    courseType: 'Lash Empresária VIP',
  },
  'EMPTESTE1': {
    id: 'empteste1',
    name: 'Teste (Empreendedora)',
    email: 'ana.empreendedora@example.com',
    roles: ['student'],
    courseType: 'Lash Empreendedora',
  },
  'PROTESTE1': {
    id: 'proteste1',
    name: 'Teste (Profissional)',
    email: 'carla.profissional@example.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },

// --- Códigos de Alunas (REAIS) ---
  'LORR153': {
    id: 'lorrainefm',
    name: 'Lorraine Franciny Miranda',
    email: 'lorrainefrancinymiranda1@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
  'RAFA109': {
    id: 'rafaellasc',
    name: 'Rafaella De Souza Cordeiro',
    email: 'rafaellacordeiro1902@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
};
