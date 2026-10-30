import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAgora } from '@/hooks/use-agora';
import {
  descreverDia,
  descreverQuando,
  lembretesPausados,
  ocorrenciasPassadas,
  podeMarcarFeito,
  proximasOcorrencias,
} from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';
import { capitalizar } from '@/utils/texto';

export type ChaveSecao = 'proximas' | 'passadas' | 'pausados';

export type ItemAgenda = {
  chave: string;
  lembrete: Lembrete;
  ocorrencia?: OcorrenciaLembrete;
  rotuloDia?: string;
};

export type SecaoAgenda = {
  chave: ChaveSecao;
  titulo: string;
  vazio: string;
  data: ItemAgenda[];
};

const paraItem = (ocorrencia: OcorrenciaLembrete, rotuloDia?: string): ItemAgenda => ({
  chave: ocorrencia.chave,
  lembrete: ocorrencia.lembrete,
  ocorrencia,
  rotuloDia,
});

export const useAgenda = () => {
  const agora = useAgora();
  const { lembretes, registros, marcarFeito, desmarcarFeito } = useLembretesStore(
    useShallow((state) => ({
      lembretes: state.lembretes,
      registros: state.registros,
      marcarFeito: state.marcarFeito,
      desmarcarFeito: state.desmarcarFeito,
    }))
  );

  const feitos = useMemo(() => new Set(registros.map((registro) => registro.chave)), [registros]);
  const proximas = useMemo(() => proximasOcorrencias(lembretes, agora), [lembretes, agora]);
  const passadas = useMemo(() => ocorrenciasPassadas(lembretes, agora), [lembretes, agora]);
  const pausados = useMemo(() => lembretesPausados(lembretes), [lembretes]);
  const proxima = proximas?.ocorrencias[0] ?? null;
  const dia = proximas ? descreverDia(proximas.dia, agora) : 'hoje';

  const secoes = useMemo<SecaoAgenda[]>(
    () => [
      {
        chave: 'proximas',
        titulo: proximas ? `Também ${dia}` : 'A seguir',
        vazio: proximas
          ? `Nenhum outro alerta ${dia} além do próximo lembrete.`
          : 'Nenhum alerta programado para os próximos 7 dias.',
        data: proximas?.ocorrencias.slice(1).map((o) => paraItem(o)) ?? [],
      },
      {
        chave: 'passadas',
        titulo: passadas.periodo === 'hoje' ? 'Já passaram hoje' : 'Já passaram nesta semana',
        vazio: 'Nenhum alerta passou nesta semana ainda.',
        data: passadas.ocorrencias.map((o) =>
          paraItem(o, passadas.periodo === 'semana' ? capitalizar(descreverDia(o.quando, agora)) : undefined)
        ),
      },
      {
        chave: 'pausados',
        titulo: 'Pausados',
        vazio: 'Nenhum lembrete pausado. Para pausar, abra o lembrete e desligue o “Alertar”.',
        data: pausados.map((lembrete) => ({ chave: `${lembrete.id}@pausado`, lembrete })),
      },
    ],
    [proximas, passadas, pausados, dia, agora]
  );

  const alternarFeito = (ocorrencia: OcorrenciaLembrete) =>
    feitos.has(ocorrencia.chave) ? desmarcarFeito(ocorrencia.chave) : marcarFeito(ocorrencia);

  const acaoFeito = (ocorrencia?: OcorrenciaLembrete) =>
    ocorrencia && podeMarcarFeito(ocorrencia, proxima, agora)
      ? () => alternarFeito(ocorrencia)
      : undefined;

  return {
    lembretes,
    secoes,
    pausados,
    proxima,
    quandoProxima: proxima ? descreverQuando(proxima.quando, agora) : '',
    feitos,
    acaoFeito,
  };
};
