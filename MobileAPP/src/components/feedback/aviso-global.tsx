import { useShallow } from 'zustand/react/shallow';

import { AvisoSucesso } from '@/components/feedback/aviso-sucesso';
import { useAvisoStore } from '@/stores/useAvisoStore';

export const AvisoGlobal = () => {
  const { mensagem, fechar } = useAvisoStore(
    useShallow((state) => ({ mensagem: state.mensagem, fechar: state.fechar })),
  );
  return <AvisoSucesso mensagem={mensagem} onFechar={fechar} />;
};
