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
    name: 'Joyci Almeida', 
    email: 'joyci@luxury.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },
  'IARTE42': { 
    id: 'user-admin', 
    name: 'Admin', 
    email: 'admin@luxury.com', 
    roles: ['admin', 'student'], 
    courseType: 'Lash Empresária VIP' 
  },

  // --- Códigos de Alunas (Exemplos) ---
  'MARIAVIP123': {
    id: 'mariavip123',
    name: 'Maria Silva (VIP)',
    email: 'maria.vip@example.com',
    roles: ['student'],
    courseType: 'Lash Empresária VIP',
  },
  'ANAEMP456': {
    id: 'anaemp456',
    name: 'Ana Souza (Empreendedora)',
    email: 'ana.empreendedora@example.com',
    roles: ['student'],
    courseType: 'Lash Empreendedora',
  },
  'CARLAPRO789': {
    id: 'carlapro789',
    name: 'Carla Santos (Profissional)',
    email: 'carla.profissional@example.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
  'LUXACAD777': {
    id: 'luxacad777',
    name: 'Nova Aluna (Acesso 777)',
    email: 'aluna777@example.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
  },
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