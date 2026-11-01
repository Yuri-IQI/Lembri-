import type { Exercicio } from '@/types/exercicio';

/**
 * Catálogo inicial mockado de exercícios cognitivos alinhado ao protótipo do Figma.
 */
export const exerciciosIniciaisMock: Exercicio[] = [
  {
    id: 'exercicio-1',
    titulo: 'Sequências',
    descricao: 'Pratique memorização com sequências de números.',
    instrucoes: [
      'Veja os cartões com as sequências e tente memorizar a ordem exata dos números.',
      'Após cada erro, será mostrada uma correção antes de avançar para a próxima rodada.',
    ],
    icone: 'format_list_numbered',
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
    id: 'exercicio-2',
    titulo: 'Ordenação',
    descricao: 'Organize as etapas da rotina na ordem correta.',
    instrucoes: [
      'Observe a ordem correta das atividades apresentadas em cada cartão.',
      'Na etapa de resposta, selecione as opções na sequência cronológica certa.',
    ],
    icone: 'swap_vert',
    tituloMemorizacao: 'Lembre-se da Ordem!',
    modoResposta: 'opcoes',
    nivel: 'medio',
    duracaoEstimadaMinutos: 8,
    rodadas: [
      {
        id: 'ord-1',
        rotulo: 'ORDEM',
        itens: ['Acordar', 'Escovar dentes', 'Tomar café', 'Sair de casa'],
      },
      {
        id: 'ord-2',
        rotulo: 'ORDEM',
        itens: ['Almoçar', 'Lavar louça', 'Caminhar', 'Descansar'],
      },
      {
        id: 'ord-3',
        rotulo: 'ORDEM',
        itens: ['Tomar banho', 'Jantar', 'Ler livro', 'Dormir'],
      },
    ],
  },
  {
    id: 'exercicio-3',
    titulo: 'Associações',
    descricao: 'Relacione cada conceito ao seu par correspondente.',
    instrucoes: [
      'Memorize quais palavras formam pares em cada rodada.',
      'Na resposta, selecione a palavra correta para cada dica exibida.',
    ],
    icone: 'link',
    tituloMemorizacao: 'Lembre-se dos Pares!',
    modoResposta: 'opcoes',
    nivel: 'facil',
    duracaoEstimadaMinutos: 5,
    rodadas: [
      {
        id: 'assoc-1',
        rotulo: 'PARES',
        itens: ['Manteiga', 'Xícara', 'Cinto', 'Colher'],
        dicas: ['Pão', 'Café', 'Calça', 'Sopa'],
        distratores: ['Garfo', 'Prato'],
      },
      {
        id: 'assoc-2',
        rotulo: 'PARES',
        itens: ['Chave', 'Caneta', 'Meia', 'Travesseiro'],
        dicas: ['Fechadura', 'Papel', 'Tênis', 'Cama'],
        distratores: ['Porta', 'Mesa'],
      },
      {
        id: 'assoc-3',
        rotulo: 'PARES',
        itens: ['Sol', 'Chuva', 'Pincel', 'Martelo'],
        dicas: ['Dia', 'Guarda-chuva', 'Tinta', 'Prego'],
        distratores: ['Nuvem', 'Alicate'],
      },
    ],
  },
  {
    id: 'exercicio-4',
    titulo: 'Lista de compras',
    descricao: 'Pratique memorização com itens de supermercado.',
    instrucoes: [
      'Memorize os itens da lista de compras apresentados no cartão.',
      'Depois, encontre os itens certos entre as opções disponíveis.',
    ],
    icone: 'shopping_cart',
    tituloMemorizacao: 'Lembre-se da Lista!',
    modoResposta: 'opcoes',
    nivel: 'medio',
    duracaoEstimadaMinutos: 10,
    rodadas: [
      {
        id: 'comp-1',
        rotulo: 'LISTA',
        itens: ['Maçã', 'Leite', 'Pão francês', 'Arroz', 'Sabão em pó para roupas'],
        distratores: ['Banana', 'Feijão', 'Açúcar'],
      },
      {
        id: 'comp-2',
        rotulo: 'LISTA',
        itens: ['Café', 'Queijo', 'Ovos', 'Manteiga', 'Suco de uva'],
        distratores: ['Chá', 'Iogurte', 'Biscoito'],
      },
      {
        id: 'comp-3',
        rotulo: 'LISTA',
        itens: ['Cenoura', 'Tomate', 'Batata', 'Azeite', 'Macarrão'],
        distratores: ['Cebola', 'Alface', 'Sal'],
      },
    ],
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
  icone: 'star',
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
