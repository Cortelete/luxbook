import type { UserData } from '../types';

/**
 * Stores user data. Passwords are now managed as Environment Variables on Vercel
 * for security. The key of the map is the user's login ID (e.g., 'joy', 'pro').
 * The password for a user with loginId 'pro' should be stored in an environment
 * variable named 'PASSWORD_PRO'.
 *
 * To manually add a new user:
 * 1. Add a new entry to this map with their data.
 * 2. Create a corresponding password environment variable in the Vercel dashboard.
 */
export const userCredentials = new Map<string, { data: UserData; }>([
  // Admin Login
  ['joy', { 
    data: { 
      name: 'Joyci Almeida', 
      role: 'admin',
      loginId: 'joy',
      courseType: 'Lash Empresária VIP'
    } 
  }],

  // Example Student for Lash Profissional plan
  ['pro', {
    data: {
      name: 'Aluna Profissional',
      role: 'student',
      loginId: 'pro',
      courseType: 'Lash Profissional'
    }
  }],
  
  // Example Student for Lash Empreendedora plan
  ['empreendedora', {
    data: {
      name: 'Aluna Empreendedora',
      role: 'student',
      loginId: 'empreendedora',
      courseType: 'Lash Empreendedora'
    }
  }],

  // Example Student for Lash Empresária VIP plan
  ['vip', {
    data: {
      name: 'Aluna Empresária VIP',
      role: 'student',
      loginId: 'vip',
      courseType: 'Lash Empresária VIP'
    }
  }],
]);
