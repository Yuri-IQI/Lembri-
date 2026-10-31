import { useShallow } from 'zustand/react/shallow';

import { AvisoSucesso } from '@/components/aviso-sucesso';
import { useAvisoStore } from '@/stores/useAvisoStore';

/**
 * Mostra o aviso de sucesso deixado por outra tela (ex.: "Pronto! Seu lembrete foi salvo.").
 */
export const AvisoGlobal = () => {
  const { mensagem, fechar } = useAvisoStore(
    useShallow((state) => ({ mensagem: state.mensagem, fechar: state.fechar })),
  );
  return <AvisoSucesso mensagem={mensagem} onFechar={fechar} />;
};
