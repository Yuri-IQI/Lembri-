import { useCallback, useState } from 'react';

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
