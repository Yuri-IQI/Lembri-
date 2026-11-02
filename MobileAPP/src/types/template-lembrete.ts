import type { AndroidSymbol } from 'expo-symbols';

import type { TemplateId } from '@/types/lembrete';

export interface TemplateLembrete {
  id: TemplateId;
  nome: string;
  icone: AndroidSymbol;
  exemplo: string;
  tituloNovo: string;
  tipoPadrao?: { nome: string; corHex: string };
}
