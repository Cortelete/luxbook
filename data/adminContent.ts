import { CourseSection } from './lib/types';

/**
 * Defines the data for the Admin Panel section.
 * This allows it to be integrated into the sidebar and content display
 * like any other course module, but rendered with a special component.
 */
export const adminSection: CourseSection = {
  id: 'admin',
  title: 'Painel Admin',
  brief: 'Gerencie alunas, códigos e módulos.',
  content: [], // The content is custom-rendered by the AdminPanel component.
};