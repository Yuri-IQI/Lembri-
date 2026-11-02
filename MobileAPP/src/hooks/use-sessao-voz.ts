import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useEscutaVoz } from '@/hooks/use-escuta-voz';
import { useVozStore } from '@/stores/useVozStore';
import type { ComandoVoz } from '@/types/comando-voz';
import { comandosGerais } from '@/utils/comandos-gerais';
import { reconhecerComando } from '@/utils/reconhecer-comando';

export const useSessaoVoz = () => {
  const { voltar, saidaProtegida, comandosTela, fechar } = useVozStore(
    useShallow((state) => ({
      voltar: state.voltar,
      saidaProtegida: state.saidaProtegida,
      comandosTela: state.comandosTela,
      fechar: state.fechar,
    }))
  );
  const gerais = useMemo(
    () => comandosGerais({ voltar, saidaProtegida }),
    [voltar, saidaProtegida]
  );
  const disponiveis = useMemo(() => [...comandosTela, ...gerais], [comandosTela, gerais]);
  const frases = useMemo(() => disponiveis.flatMap((comando) => comando.frases), [disponiveis]);

  const [opcoes, setOpcoes] = useState<ComandoVoz[]>([]);
  const [naoEntendido, setNaoEntendido] = useState<string | null>(null);

  const executar = (comando: ComandoVoz) => {
    fechar();
    comando.executar();
  };

  const { estado, parcial, volume, ouvirDeNovo } = useEscutaVoz(frases, (falas) => {
    const resultado = reconhecerComando(falas, comandosTela, gerais);
    if (resultado.tipo === 'comando') executar(resultado.comando);
    else if (resultado.tipo === 'opcoes') setOpcoes(resultado.opcoes);
    else setNaoEntendido(falas[0] ?? '');
  });

  const tentarDeNovo = () => {
    setOpcoes([]);
    setNaoEntendido(null);
    ouvirDeNovo();
  };

  return {
    estado,
    parcial,
    volume,
    opcoes,
    naoEntendido,
    disponiveis,
    executar,
    tentarDeNovo,
    fechar,
  };
};
