import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { TelaFormulario } from '@/components/forms/tela-formulario';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { Lembrete } from '@/types/lembrete';
import { dadosDoLembrete } from '@/utils/dados-iniciais';

const FormularioEdicao = ({ lembrete }: { lembrete: Lembrete }) => {
  const [original] = useState(() => dadosDoLembrete(lembrete));

  return (
    <TelaFormulario
      titulo="Editar lembrete"
      inicial={original}
      edicao={{ id: lembrete.id, original }}
    />
  );
};

const EditarLembreteScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lembrete = useLembretesStore((state) => state.lembretes.find((item) => item.id === id));
  if (!lembrete) return <Redirect href="/" />;
  return <FormularioEdicao lembrete={lembrete} />;
};

export default EditarLembreteScreen;
