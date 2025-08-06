import { UserData } from '../lib/types';

export interface UserCredentialSpec extends UserData {
    accessCodeEnvKey: string;
}

/**
 * Define as especificações para cada usuária, incluindo a chave da variável de ambiente
 * onde o código de acesso secreto está armazenado.
 * 
 * Para adicionar uma nova aluna (sendo admin):
 * 1. Defina um nome para a variável de ambiente do código de acesso (ex: 'S_NOVAALUNA_KEY').
 * 2. Adicione essa variável de ambiente no Vercel com o código de acesso secreto da aluna como valor.
 * 3. Adicione um novo objeto a este array `userCredentials` com os dados da aluna
 *    e o `accessCodeEnvKey` que você definiu no passo 1.
 * 4. Faça o deploy (publicação) da nova versão da aplicação.
 */
export const userCredentials: UserCredentialSpec[] = [
  // --- Administradores e Gerência ---
    { 
    id: 'iarte.ia', 
    name: 'Davi Cortelete Alves de Oliveira', 
    email: 'admin@luxury.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP',
    accessCodeEnvKey: 'S_USERBOSS_KEY'
  },
  { 
    id: 'superjoy', 
    name: 'Joyci de Fátima Almeida Amaro da Silva', 
    email: 'luxury.joycalmeida@gmail.com', 
    roles: ['boss', 'admin', 'student'], 
    courseType: 'Lash Empresária VIP',
    accessCodeEnvKey: 'S_USERADMIN_KEY'
  },


  // --- Códigos de Alunas (TESTES) ---
  {
    id: 'vipteste1',
    name: 'Teste (VIP)',
    email: 'maria.vip@example.com',
    roles: ['student'],
    courseType: 'Lash Empresária VIP',
    accessCodeEnvKey: 'S_TESTEVIP1_KEY'
  },
  {
    id: 'empteste1',
    name: 'Teste (Empreendedora)',
    email: 'ana.empreendedora@example.com',
    roles: ['student'],
    courseType: 'Lash Empreendedora',
    accessCodeEnvKey: 'S_TESTEEMP1_KEY'
  },
  {
    id: 'proteste1',
    name: 'Teste (Profissional)',
    email: 'carla.profissional@example.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
    accessCodeEnvKey: 'S_TESTEPRO1_KEY'
  },

// --- Códigos de Alunas (REAIS) ---
    {
    id: 'lorrainefm',
    name: 'Lorraine Franciny Miranda',
    email: 'lorrainefrancinymiranda1@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
    accessCodeEnvKey: 'S_LORRAINEFM_KEY'
  },
    {
    id: 'rafaellasc',
    name: 'Rafaella De Souza Cordeiro',
    email: 'rafaellacordeiro1902@gmail.com',
    roles: ['student'],
    courseType: 'Lash Profissional',
    accessCodeEnvKey: 'S_RAFAELLASC_KEY'
  },
];
