import IconeAssociacao from '@/assets/exercicios/associacao.svg';
import IconeCompras from '@/assets/exercicios/compras.svg';
import IconeContexto from '@/assets/exercicios/contexto.svg';
import IconeGuardar from '@/assets/exercicios/guardar.svg';
import IconeNumeros from '@/assets/exercicios/numeros.svg';
import IconeOrdem from '@/assets/exercicios/ordem.svg';
import IconePalavras from '@/assets/exercicios/palavras.svg';
import IconeSequencia from '@/assets/exercicios/sequencia.svg';
import type { Exercicio } from '@/types/exercicio';

const ICONES = {
  associacao: IconeAssociacao,
  compras: IconeCompras,
  contexto: IconeContexto,
  guardar: IconeGuardar,
  numeros: IconeNumeros,
  ordem: IconeOrdem,
  palavras: IconePalavras,
  sequencia: IconeSequencia,
};

export const IconeExercicio = ({ icone }: { icone: Exercicio['icone'] }) => {
  const Icone = ICONES[icone];
  return <Icone width={36} height={36} />;
};
