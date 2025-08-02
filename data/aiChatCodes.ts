/**
 * Armazena os "códigos de acesso" válidos para o Tutor IA.
 * Usar um Set garante que não haja duplicatas e oferece uma verificação (lookup)
 * muito rápida e eficiente (O(1)).
 *
 * Para adicionar um novo código, basta adicioná-lo à lista de strings.
 * Ex: new Set(['luxur.ia', 'alunavip', 'acesso2024'])
 */
export const aiChatCodes = new Set<string>([
  'luxur.ia',
]);
