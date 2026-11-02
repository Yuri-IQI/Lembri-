import type { ComandoVoz } from '@/types/comando-voz';
import { reconhecerComando } from '@/utils/reconhecer-comando';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const comando = (id: string, ...frases: string[]): ComandoVoz => ({
  id,
  rotulo: id,
  frases,
  executar: () => {},
});

const numeros = comando('numeros', 'Sequência de números', 'Sequências');
const palavras = comando('palavras', 'Sequência de palavras', 'Sequências');
const tela = [numeros, palavras, comando('compras', 'Lista de compras', 'Associações')];
const gerais = [
  comando('exercicios', 'exercícios'),
  comando('lembretes', 'lembretes'),
  comando('novo', 'novo lembrete', 'criar lembrete'),
  comando('voltar', 'voltar'),
];

const idDe = (fala: string, naTela = tela) => {
  const resultado = reconhecerComando([fala], naTela, gerais);
  if (resultado.tipo === 'comando') return resultado.comando.id;
  if (resultado.tipo === 'opcoes') return resultado.opcoes.map((opcao) => opcao.id).join('|');
  return null;
};

const casos: [string, string | null][] = [
  ['Sequência de números', 'numeros'],
  ['abrir a sequencia de numeros', 'numeros'],
  ['sequência', 'numeros|palavras'],
  ['sequências', 'numeros|palavras'],
  ['lista de compras', 'compras'],
  ['compras', 'compras'],
  ['quero ir para os exercícios', 'exercicios'],
  ['Lembretes', 'lembretes'],
  ['novo lembrete', 'novo'],
  ['Voltar', 'voltar'],
  ['abrir', null],
  ['qual é a previsão do tempo', null],
];

for (const [fala, esperado] of casos) {
  const obtido = idDe(fala);
  assert(obtido === esperado, `"${fala}": esperado ${esperado}, obtido ${obtido}`);
}

const naTela = reconhecerComando(['voltar'], [comando('voltar-tela', 'voltar')], gerais);
assert(naTela.tipo === 'comando' && naTela.comando.id === 'voltar-tela', 'Comando da tela vence o geral');
assert(idDe('começar', [comando('comecar', 'começar')]) === 'comecar', 'Começar funciona nos detalhes');
assert(idDe('começar') === null, 'Começar não existe fora dos detalhes');

const alternativas = reconhecerComando(['sem sentido', 'voltar'], tela, gerais);
assert(alternativas.tipo === 'comando', 'Usa as demais alternativas do reconhecedor');
