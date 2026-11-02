import { useEffect, useState } from 'react';

export const useAgora = () => {
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const intervalo = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(intervalo);
  }, []);
  return agora;
};
