import type { ThemeColor } from '@/constants/theme';
import type { RodadaExercicio } from '@/types/exercicio';
import { embaralhar } from '@/utils/exercicio';

const TOTAL_RODADAS = 3;

const ATIVIDADES: readonly { nome: string; passos: readonly string[] }[] = [
  { nome: 'Fazer café', passos: ['Ferver a água', 'Colocar o pó no filtro', 'Passar o café', 'Servir na xícara'] },
  { nome: 'Lavar roupa', passos: ['Separar as roupas', 'Colocar na máquina', 'Estender no varal', 'Guardar no armário'] },
  { nome: 'Regar as plantas', passos: ['Encher o regador', 'Molhar a terra', 'Guardar o regador', 'Lavar as mãos'] },
  { nome: 'Preparar arroz', passos: ['Lavar o arroz', 'Refogar o alho', 'Colocar a água', 'Cozinhar em fogo baixo'] },
  { nome: 'Tomar remédio', passos: ['Pegar a caixa', 'Conferir o horário', 'Tomar com água', 'Guardar a caixa'] },
  { nome: 'Arrumar a cama', passos: ['Tirar o lençol', 'Colocar lençol limpo', 'Esticar as cobertas', 'Ajeitar o travesseiro'] },
];

interface Contexto {
  nome: string;
  cor: ThemeColor;
  pares: readonly (readonly [dica: string, item: string])[];
}

const CONTEXTOS: readonly Contexto[] = [
  { nome: 'Cozinha', cor: 'tagLaranja', pares: [['Pão', 'Manteiga'], ['Café', 'Xícara'], ['Sopa', 'Colher'], ['Bife', 'Garfo']] },
  { nome: 'Roupas', cor: 'tagAzul', pares: [['Calça', 'Cinto'], ['Tênis', 'Meia'], ['Cabeça', 'Chapéu'], ['Mão', 'Luva']] },
  { nome: 'Quarto', cor: 'tagLilas', pares: [['Cama', 'Travesseiro'], ['Noite', 'Pijama'], ['Janela', 'Cortina'], ['Manhã', 'Despertador']] },
  { nome: 'Ferramentas', cor: 'tagSaude', pares: [['Prego', 'Martelo'], ['Tinta', 'Pincel'], ['Parafuso', 'Chave'], ['Madeira', 'Serrote']] },
  { nome: 'Banheiro', cor: 'tag', pares: [['Dentes', 'Escova'], ['Cabelo', 'Pente'], ['Banho', 'Sabonete'], ['Rosto', 'Toalha']] },
  { nome: 'Escritório', cor: 'accent', pares: [['Papel', 'Caneta'], ['Carta', 'Envelope'], ['Folhas', 'Clipe'], ['Erro', 'Borracha']] },
];

const SECOES_MERCADO: readonly Contexto[] = [
  { nome: 'Feira', cor: 'tag', pares: [['Fruta', 'Maçã'], ['Legume', 'Cenoura'], ['Verdura', 'Alface'], ['Tempero', 'Cebola']] },
  { nome: 'Padaria', cor: 'tagLaranja', pares: [['Café da manhã', 'Pão francês'], ['Lanche', 'Biscoito'], ['Festa', 'Bolo'], ['Recheio', 'Presunto']] },
  { nome: 'Mercearia', cor: 'tagAzul', pares: [['Almoço', 'Arroz'], ['Caldo', 'Feijão'], ['Molho', 'Macarrão'], ['Salada', 'Azeite']] },
  { nome: 'Limpeza', cor: 'tagLilas', pares: [['Roupas', 'Sabão em pó'], ['Louça', 'Detergente'], ['Chão', 'Desinfetante'], ['Pia', 'Esponja']] },
  { nome: 'Laticínios', cor: 'tagSaude', pares: [['Vitamina', 'Leite'], ['Sobremesa', 'Iogurte'], ['Torrada', 'Requeijão'], ['Pizza', 'Queijo']] },
];

const FRASES: readonly { palavras: readonly string[]; distratores: readonly string[] }[] = [
  { palavras: ['Maria', 'rega', 'flores', 'amarelas'], distratores: ['Joana', 'lava', 'plantas'] },
  { palavras: ['João', 'bebe', 'café', 'quente'], distratores: ['Pedro', 'toma', 'frio'] },
  { palavras: ['Cachorro', 'pequeno', 'late', 'alto'], distratores: ['Gato', 'corre', 'baixo'] },
  { palavras: ['Vovó', 'prepara', 'bolo', 'gostoso'], distratores: ['Vovô', 'compra', 'torta'] },
  { palavras: ['Chuva', 'forte', 'molha', 'cidade'], distratores: ['Vento', 'fraco', 'praia'] },
  { palavras: ['Rosa', 'estuda', 'livro', 'antigo'], distratores: ['Clara', 'compra', 'jornal'] },
  { palavras: ['Pedro', 'caminha', 'parque', 'florido'], distratores: ['Paulo', 'corre', 'jardim'] },
  { palavras: ['Sol', 'quente', 'ilumina', 'praia'], distratores: ['Lua', 'gelado', 'clareia'] },
];

type Aleatorio = () => number;

const gerarSequencias = (aleatorio: Aleatorio): RodadaExercicio[] => {
  const numeros = Array.from({ length: 90 }, (_, i) => String(i + 10));
  const ordenar = [
    (itens: string[]) => [...itens].sort(),
    (itens: string[]) => [...itens].sort().reverse(),
    (itens: string[]) => itens,
  ];
  return ordenar.map((ordem, i) => ({
    id: `seq-${i + 1}`,
    rotulo: 'SEQUÊNCIA',
    itens: ordem(embaralhar(numeros, aleatorio).slice(0, 5)),
  }));
};

const gerarFrases = (aleatorio: Aleatorio): RodadaExercicio[] =>
  embaralhar(FRASES, aleatorio)
    .slice(0, TOTAL_RODADAS)
    .map(({ palavras, distratores }, i) => ({
      id: `frase-${i + 1}`,
      rotulo: 'FRASE',
      itens: [...palavras],
      distratores: [...distratores],
    }));

const gerarOrdenacao = (aleatorio: Aleatorio): RodadaExercicio[] =>
  embaralhar(ATIVIDADES, aleatorio)
    .slice(0, TOTAL_RODADAS)
    .map(({ nome, passos }, i) => ({
      id: `ord-${i + 1}`,
      rotulo: nome.toUpperCase(),
      itens: [...passos],
      numerada: true,
    }));

const gerarPorContexto =
  (contextos: readonly Contexto[], prefixo: string) =>
  (aleatorio: Aleatorio): RodadaExercicio[] => {
    const sorteados = embaralhar(contextos, aleatorio);
    const distratores = embaralhar(
      sorteados.slice(TOTAL_RODADAS).flatMap(({ pares }) => pares.map(([, item]) => item)),
      aleatorio
    );
    return sorteados.slice(0, TOTAL_RODADAS).map(({ nome, cor, pares }, i) => ({
      id: `${prefixo}-${i + 1}`,
      rotulo: nome.toUpperCase(),
      cor,
      itens: pares.map(([, item]) => item),
      dicas: pares.map(([dica]) => dica),
      distratores: distratores.slice(i * 2, (i + 1) * 2),
    }));
  };

const GERADORES: Record<string, (aleatorio: Aleatorio) => RodadaExercicio[]> = {
  'exercicio-1': gerarSequencias,
  'exercicio-2': gerarOrdenacao,
  'exercicio-3': gerarPorContexto(CONTEXTOS, 'assoc'),
  'exercicio-4': gerarPorContexto(SECOES_MERCADO, 'comp'),
  'exercicio-5': gerarFrases,
};

/**
 * Sorteia as rodadas de uma partida.
 *
 * @param exercicioId - Identificador do exercício.
 * @param aleatorio - Função que retorna um número entre 0 e 1 (padrão Math.random).
 * @returns Rodadas sorteadas, ou null se o exercício não tiver gerador.
 */
export const gerarRodadas = (
  exercicioId: string,
  aleatorio: Aleatorio = Math.random
): RodadaExercicio[] | null => GERADORES[exercicioId]?.(aleatorio) ?? null;
