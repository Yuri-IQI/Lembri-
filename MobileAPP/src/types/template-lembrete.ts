import type { AndroidSymbol } from 'expo-symbols';

import type { TemplateId } from '@/types/lembrete';

/**
 * Template oferecido na tela "Escolher template" (substitui os modelos do CARD-26).
 */
export interface TemplateLembrete {
  id: TemplateId;
  /** Nome exibido no card (ex.: "Remédio"). */
  nome: string;
  /** Material Symbol (Android) exibido no card. */
  icone: AndroidSymbol;
  /** Exemplo curto exibido abaixo do nome. */
  exemplo: string;
  /** Título da tela do formulário ao criar (ex.: "Novo remédio"). */
  tituloNovo: string;
  /** Tipo selecionado por padrão; criado ao salvar o primeiro lembrete se ainda não existir. */
  tipoPadrao?: { nome: string; corHex: string };
}
