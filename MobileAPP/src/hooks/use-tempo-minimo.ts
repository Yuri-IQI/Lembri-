import { useEffect, useState } from 'react';

/** `true` depois que a tela ficou aberta por `ms` milissegundos. */
export const useTempoMinimo = (ms: number): boolean => {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setPassou(true), ms);
    return () => clearTimeout(temporizador);
  }, [ms]);

  return passou;
};
