import type { FaqItem } from '@/types/help';

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
  {
    id: 'edit-reminder',
    question: 'Como editar ou pausar um lembrete?',
    answer: 'Na página Lembretes, toque no lembrete e depois em Editar. Para pausar os avisos sem excluir, desligue o interruptor ao lado do lembrete. Ligue de novo quando quiser.',
  },
  {
    id: 'complete-reminder',
    question: 'Como marcar que já fiz?',
    answer: 'Na página Home, toque em Marcar como tomado ou Marcar como feito no próximo lembrete, ou no horário de um lembrete da lista. Você também pode usar os botões da notificação.',
  },
  {
    id: 'exercise',
    question: 'Como fazer um exercício?',
    answer: 'Na página Exercícios, escolha um exercício e toque em COMEÇAR. Memorize o que aparece e toque em CONTINUAR. Depois preencha as casas. Ao continuar, cada casa mostra se a resposta está certa. Você pode corrigir ou seguir para a próxima rodada.',
  },
  {
    id: 'large-text',
    question: 'Como aumentar as letras?',
    answer: 'Acesse a página Ajustes e ligue Texto ampliado.',
  },
  {
    id: 'delete-data',
    question: 'Como apagar meus dados?',
    answer: 'Acesse a página Ajustes e toque em Apagar todos os dados. Depois de confirmar, não é possível desfazer.',
  },
];

export const watchHelpMock: readonly FaqItem[] = [
  {
    id: 'watch-start',
    question: 'Como começar a usar o relógio?',
    answer: 'Instale o Lembri no celular e no relógio e conecte os dois pelo app do relógio no celular. Depois abra o Lembri no celular: os lembretes de hoje aparecem no relógio sozinhos. Abra o Lembri no relógio e toque em Permitir para ele avisar na hora de cada lembrete. Para criar ou mudar um lembrete, use o celular.',
  },
  {
    id: 'watch-complete-reminder',
    question: 'Como marcar que já fiz pelo relógio?',
    answer: 'Abra o Lembri no relógio e toque em Feito no próximo lembrete. Se tocou sem querer, você tem 10 segundos para tocar em Desfazer. Depois disso, o lembrete também fica marcado no celular.',
  },
  {
    id: 'watch-exercise',
    question: 'Como fazer um exercício no relógio?',
    answer: 'Na tela inicial do relógio, deslize para baixo até Praticar e toque em Sequência ou em Guardar no lugar. O resultado aparece no histórico do exercício no celular, com a palavra Relógio.',
  },
  {
    id: 'watch-missing-reminders',
    question: 'O relógio não mostra meus lembretes. O que fazer?',
    answer: 'Abra o Lembri no celular e deixe o relógio por perto. Confira também se a data do relógio está certa, porque ele mostra só os lembretes de hoje.',
  },
  {
    id: 'watch-offline',
    question: 'O que significa Sem conexão com o celular?',
    answer: 'O relógio e o celular não estão se comunicando. Deixe os dois por perto e confira se o Bluetooth do celular está ligado. Enquanto isso, você pode continuar usando o relógio: o que fizer nele é enviado ao celular quando a conexão voltar.',
  },
];
