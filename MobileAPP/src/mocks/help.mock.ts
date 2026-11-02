import type { FaqItem } from '@/types/help';

/** Instruções correspondentes aos fluxos disponíveis no aplicativo. */
export const helpMock: readonly FaqItem[] = [
  {
    id: 'create-reminder',
    question: 'Como criar um lembrete?',
    answer: 'Abra Lembretes e toque no botão de adicionar. Escolha o tipo de lembrete, preencha os campos indicados e toque em Salvar.',
  },
  {
    id: 'enable-notifications',
    question: 'Como ativar notificações?',
    answer: 'Abra Ajustes e ative Avisos de Lembretes ou Avisos de Exercícios. Se o celular solicitar, permita as notificações. Se estiverem bloqueadas, abra as configurações do celular e permita os avisos do Lembri. Os avisos de exercícios são às 09h e deixam de ser enviados naquele dia quando você conclui um exercício. Abra o Lembri pelo menos uma vez a cada 7 dias para renovar os avisos agendados.',
  },
  {
    id: 'delete-reminder',
    question: 'Como excluir lembrete?',
    answer: 'Abra Lembretes e deslize o lembrete para excluir. Confira o nome e confirme a exclusão. Se mudar de ideia, use Desfazer na lista. Você também pode abrir o lembrete e usar o botão Excluir, ou usar a ação Excluir lembrete do leitor de tela.',
  },
];
