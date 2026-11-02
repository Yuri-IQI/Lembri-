import type { Exercicio } from '@/types/exercicio';

/**
 * Catálogo inicial mockado de exercícios cognitivos alinhado ao protótipo do Figma.
 */
export const exerciciosIniciaisMock: Exercicio[] = [
  {
    id: 'exercicio-1',
    titulo: 'Sequência de números',
    grupo: 'Sequências',
    descricao: 'Pratique memorização com sequências de números.',
    instrucoes: [
      'A primeira sequência é crescente, a segunda é decrescente e a terceira não tem ordem.',
      'Ao continuar, cada casa mostra se o número está certo ou errado.',
    ],
    instrucaoDicas: 'As setas indicam se o número está acima ou abaixo do valor certo, e o amarelo indica um número de outra posição.',
    icone: 'sequencia',
    tituloMemorizacao: 'Lembre-se das Sequências!',
    modoResposta: 'teclado',
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    rodadas: [
      {
        id: 'seq-1',
        rotulo: 'SEQUÊNCIA',
        itens: ['80', '32', '12', '67', '55'],
      },
      {
        id: 'seq-2',
        rotulo: 'SEQUÊNCIA',
        itens: ['02', '04', '05', '06', '02'],
      },
      {
        id: 'seq-3',
        rotulo: 'SEQUÊNCIA',
        itens: ['01', '02', '03', '05', '11'],
      },
    ],
  },
  {
    id: 'exercicio-5',
    titulo: 'Sequência de palavras',
    grupo: 'Sequências',
    descricao: 'Pratique memorização com frases curtas.',
    instrucoes: [
      'Cada rodada é uma frase. Memorize as palavras na ordem em que aparecem.',
      'Ao continuar, cada casa mostra se a palavra está certa ou errada.',
    ],
    instrucaoDicas: 'O amarelo indica uma palavra de outra posição da frase.',
    icone: 'sequencia',
    tituloMemorizacao: 'Lembre-se das Palavras!',
    modoResposta: 'opcoes',
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    rodadas: [],
  },
  {
    id: 'exercicio-2',
    titulo: 'Ordenação',
    descricao: 'Organize os passos de uma atividade na ordem correta.',
    instrucoes: [
      'Cada rodada é uma atividade do dia a dia. Observe a ordem dos passos.',
      'Na resposta, toque nos passos na ordem certa. Ao continuar, cada casa mostra se o passo está certo ou errado.',
    ],
    instrucaoDicas: 'O amarelo indica um passo de outra posição e mostra qual é a posição certa.',
    icone: 'ordem',
    tituloMemorizacao: 'Lembre-se da Ordem!',
    modoResposta: 'opcoes',
    nivel: 'medio',
    duracaoEstimadaMinutos: 8,
    rodadas: [],
  },
  {
    id: 'exercicio-3',
    titulo: 'Associação por contexto',
    grupo: 'Associações',
    descricao: 'Relacione cada conceito ao seu par correspondente.',
    instrucoes: [
      'Cada rodada é um contexto, indicado por uma cor. Memorize as palavras que formam pares.',
      'Na resposta, selecione a palavra correta para cada dica. Ao continuar, cada casa mostra se está certa ou errada.',
    ],
    instrucaoDicas: 'O amarelo indica uma palavra de outro par do mesmo contexto.',
    icone: 'associacao',
    tituloMemorizacao: 'Lembre-se dos Pares!',
    modoResposta: 'opcoes',
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    rodadas: [],
  },
  {
    id: 'exercicio-4',
    titulo: 'Lista de compras',
    grupo: 'Associações',
    descricao: 'Relacione cada necessidade a um item de supermercado.',
    instrucoes: [
      'Cada rodada é uma seção do mercado, indicada por uma cor. Memorize o item de cada necessidade.',
      'Na resposta, selecione o item correto para cada dica. Ao continuar, cada casa mostra se está certa ou errada.',
    ],
    instrucaoDicas: 'O amarelo indica um item de outro par da mesma seção.',
    icone: 'associacao',
    tituloMemorizacao: 'Lembre-se da Lista!',
    modoResposta: 'opcoes',
    nivel: 'medio',
    duracaoEstimadaMinutos: 10,
    rodadas: [],
  },
];

/**
 * Fábrica de exercícios mockados para testes e geração dinâmica.
 */
export const criarExercicioMock = (override: Partial<Exercicio> = {}): Exercicio => ({
  id: `exercicio-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  titulo: 'Exercício de Teste',
  descricao: 'Descrição do exercício de estímulo cognitivo',
  instrucoes: ['Instrução 1', 'Instrução 2'],
  icone: 'sequencia',
  tituloMemorizacao: 'Lembre-se do Teste!',
  modoResposta: 'opcoes',
  rodadas: [
    {
      id: 'rodada-1',
      rotulo: 'TESTE',
      itens: ['A', 'B', 'C'],
    },
  ],
  nivel: 'facil',
  duracaoEstimadaMinutos: 5,
  ...override,
});
