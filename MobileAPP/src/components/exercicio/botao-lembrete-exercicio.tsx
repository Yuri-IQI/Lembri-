import { router } from 'expo-router';

import { Botao } from '@/components/controles/botao';

type BotaoLembreteExercicioProps = {
  titulo: string;
};

export const BotaoLembreteExercicio = ({ titulo }: BotaoLembreteExercicioProps) => (
  <Botao
    rotulo="Criar lembrete"
    variante="secundario"
    icone="notifications"
    accessibilityLabel={`Criar lembrete para o exercício ${titulo}`}
    onPress={() =>
      router.push({
        pathname: '/lembrete/novo/[template]',
        params: {
          template: 'livre',
          titulo: `Exercício: ${titulo}`,
          descricao: `Fazer o exercício ${titulo} no Lembri.`,
        },
      })
    }
  />
);
