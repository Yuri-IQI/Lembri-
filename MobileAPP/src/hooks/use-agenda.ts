import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAgora } from '@/hooks/use-agora';
import {
  DIAS_PROXIMO_LEMBRETE,
  ateAmanha,
  descreverQuando,
  lembretesPausados,
  ocorrenciasFuturas,
  ocorrenciasPassadas,
  podeMarcarFeito,
} from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';
import { agruparPorDia, type DiaAgenda, type GrupoAgenda } from '@/utils/agrupar-agenda';

export type ChaveSecao = 'proximas' | 'passadas' | 'pausados';

export type SecaoAgenda = {
  chave: ChaveSecao;
  vazio: string;
  dias: DiaAgenda[];
};

/** Uma lista só, um card por lembrete, sem horários do dia. */
const listaDeLembretes = (chave: ChaveSecao, titulo: string, lembretes: Lembrete[]): DiaAgenda[] =>
  lembretes.length > 0
    ? [
        {
          chave,
          titulo,
          data: lembretes.map((lembrete) => ({
            chave: `${lembrete.id}@${chave}`,
            lembrete,
            ocorrencias: [],
          })),
        },
      ]
    : [];

export const useAgenda = () => {
  const agora = useAgora();
  const { lembretes, registros, ocultos, marcarFeito, desmarcarFeito, ocultarDaAgenda } =
    useLembretesStore(
      useShallow((state) => ({
        lembretes: state.lembretes,
        registros: state.registros,
        ocultos: state.ocultosDaAgenda,
        marcarFeito: state.marcarFeito,
        desmarcarFeito: state.desmarcarFeito,
        ocultarDaAgenda: state.ocultarDaAgenda,
      }))
    );

  const feitos = useMemo(() => new Set(registros.map((registro) => registro.chave)), [registros]);
  const futuras = useMemo(
    () => ocorrenciasFuturas(lembretes, agora, DIAS_PROXIMO_LEMBRETE),
    [lembretes, agora]
  );
  const passadas = useMemo(() => ocorrenciasPassadas(lembretes, agora), [lembretes, agora]);
  const pausados = useMemo(() => lembretesPausados(lembretes), [lembretes]);
  const proxima = futuras.find((o) => !feitos.has(o.chave)) ?? null;

  const todoFeito = (grupo: GrupoAgenda) => grupo.ocorrencias.every((o) => feitos.has(o.chave));
  const visivel = (grupo: GrupoAgenda) => !(ocultos.includes(grupo.chave) && todoFeito(grupo));

  const aSeguir = agruparPorDia(
    futuras.filter((o) => ateAmanha(o, agora)),
    agora
  )
    .map((dia) => ({ ...dia, data: dia.data.filter(visivel) }))
    .filter((dia) => dia.data.length > 0);

  const secoes: SecaoAgenda[] = [
    {
      chave: 'proximas',
      vazio: 'Nenhum alerta programado para hoje e amanhã.',
      dias: aSeguir,
    },
    {
      chave: 'passadas',
      vazio: 'Nenhum alerta passou hoje nem ontem.',
      dias: agruparPorDia(passadas, agora),
    },
    {
      chave: 'pausados',
      vazio: 'Nenhum lembrete pausado. Para pausar, abra o lembrete e desligue o “Alertar”.',
      dias: listaDeLembretes('pausados', 'Pausados', pausados),
    },
  ];

  const alternarFeito = (ocorrencia: OcorrenciaLembrete) =>
    feitos.has(ocorrencia.chave) ? desmarcarFeito(ocorrencia.chave) : marcarFeito(ocorrencia);

  const acaoFeito = (ocorrencia?: OcorrenciaLembrete) =>
    ocorrencia && podeMarcarFeito(ocorrencia, agora) ? () => alternarFeito(ocorrencia) : undefined;

  return {
    agora,
    lembretes,
    secoes,
    pausados,
    proxima,
    quandoProxima: proxima ? descreverQuando(proxima.quando, agora) : '',
    feitos,
    acaoFeito,
    todoFeito,
    ocultarDaAgenda,
  };
};
