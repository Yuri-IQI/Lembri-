import { useCallback, useState } from 'react';

/**
 * Hook para gerenciamento do estado de mensagens temporárias e avisos de confirmação (Toast).
 *
 * Utilizado por formulários e telas para disparar feedback acessível após salvar ou atualizar itens.
 */
export function useAvisoTemporario() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const mostrar = useCallback((texto: string) => {
    setMensagem(texto);
  }, []);

  const fechar = useCallback(() => {
    setMensagem(null);
  }, []);

  return {
    mensagem,
    mostrar,
    fechar,
  };
}
