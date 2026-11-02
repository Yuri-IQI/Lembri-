import { useEffect, useState } from 'react';

export const useTempoMinimo = (ms: number): boolean => {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setPassou(true), ms);
    return () => clearTimeout(temporizador);
  }, [ms]);

  return passou;
};
