import IconeAssociacao from '@/assets/exercicios/associacao.svg';
import IconeOrdem from '@/assets/exercicios/ordem.svg';
import IconeSequencia from '@/assets/exercicios/sequencia.svg';
import type { Exercicio } from '@/types/exercicio';

const ICONES = {
  associacao: IconeAssociacao,
  ordem: IconeOrdem,
  sequencia: IconeSequencia,
};

/**
 * Ícone da família do exercício, decorativo: o nome deve ser lido pelo elemento pai.
 */
export const IconeExercicio = ({ icone }: { icone: Exercicio['icone'] }) => {
  const Icone = ICONES[icone];
  return <Icone width={36} height={36} />;
};
