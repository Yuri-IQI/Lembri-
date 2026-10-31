import { Colors } from '@/constants/theme';
import type { TemplateId } from '@/types/lembrete';
import type { TemplateLembrete } from '@/types/template-lembrete';

/**
 * Os quatro templates de lembrete, na ordem da tela "Escolher template".
 */
export const templatesLembreteMock: TemplateLembrete[] = [
  {
    id: 'remedio',
    nome: 'Remédio',
    icone: 'medication',
    exemplo: 'Ex.: Losartana às 8h',
    tituloNovo: 'Novo remédio',
    tipoPadrao: { nome: 'Saúde', corHex: Colors.tagSaude },
  },
  {
    id: 'compromisso',
    nome: 'Compromisso',
    icone: 'event',
    exemplo: 'Ex.: Consulta no cardiologista',
    tituloNovo: 'Novo compromisso',
    // PENDÊNCIA: a cor do tipo Compromissos vai ser configurável.
    tipoPadrao: { nome: 'Compromissos', corHex: Colors.tagAzul },
  },
  {
    id: 'tarefa',
    nome: 'Tarefa da casa',
    icone: 'local_laundry_service',
    exemplo: 'Ex.: Lavar roupas',
    tituloNovo: 'Nova tarefa da casa',
    tipoPadrao: { nome: 'Tarefas Domésticas', corHex: Colors.tag },
  },
  {
    id: 'livre',
    nome: 'Livre',
    icone: 'edit_note',
    exemplo: 'Para qualquer outra coisa',
    tituloNovo: 'Novo lembrete',
  },
];

export const obterTemplate = (id: TemplateId): TemplateLembrete =>
  templatesLembreteMock.find((template) => template.id === id) ?? templatesLembreteMock[3];
