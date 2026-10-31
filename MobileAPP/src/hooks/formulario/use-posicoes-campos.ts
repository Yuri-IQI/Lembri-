import { useRef } from 'react';
import type { LayoutChangeEvent, ScrollViewInstance } from 'react-native';

import type { CampoComErro } from '@/utils/validar-lembrete';

/**
 * Guarda onde cada campo está no formulário para rolar até o primeiro erro.
 */
export const usePosicoesCampos = () => {
  const rolagem = useRef<ScrollViewInstance>(null);
  const posicoes = useRef<Partial<Record<CampoComErro, number>>>({});

  const registrar = (campo: CampoComErro) => (evento: LayoutChangeEvent) => {
    posicoes.current[campo] = evento.nativeEvent.layout.y;
  };

  const rolarPara = (campo: CampoComErro) => {
    const y = posicoes.current[campo];
    if (y !== undefined) rolagem.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
  };

  return { rolagem, registrar, rolarPara };
};
