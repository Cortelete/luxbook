/**
 * Armazena os "códigos de formanda" válidos.
 * Usar um Set garante que não haja duplicatas e oferece uma verificação (lookup)
 * muito rápida e eficiente (O(1)).
 *
 * Para adicionar um novo código, basta adicioná-lo à lista de strings.
 * Ex: new Set(['formanda2024', 'novaaluna', 'joyci2025'])
 */
export const graduationCodes = new Set<string>([
  'formanda2024',
  'sucesso2024',
  'codlux',
]);
