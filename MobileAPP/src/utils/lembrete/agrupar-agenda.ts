import { descreverDia } from '@/stores/agenda-lembretes';
import type { Lembrete, OcorrenciaLembrete } from '@/types/lembrete';
import { chaveData } from '@/utils/tempo/data';
import { capitalizar } from '@/utils/texto/texto';

export type GrupoAgenda = {
  chave: string;
  lembrete: Lembrete;
  ocorrencias: OcorrenciaLembrete[];
};

export type DiaAgenda = {
  chave: string;
  titulo: string;
  data: GrupoAgenda[];
};

export const agruparPorDia = (ocorrencias: OcorrenciaLembrete[], agora: Date): DiaAgenda[] => {
  const dias: DiaAgenda[] = [];

  for (const ocorrencia of ocorrencias) {
    const chaveDia = chaveData(ocorrencia.quando);
    let dia = dias.find((item) => item.chave === chaveDia);
    if (!dia) {
      dia = {
        chave: chaveDia,
        titulo: capitalizar(descreverDia(ocorrencia.quando, agora)),
        data: [],
      };
      dias.push(dia);
    }
    const chave = `${ocorrencia.lembrete.id}@${chaveDia}`;
    const grupo = dia.data.find((item) => item.chave === chave);
    if (grupo) grupo.ocorrencias.push(ocorrencia);
    else dia.data.push({ chave, lembrete: ocorrencia.lembrete, ocorrencias: [ocorrencia] });
  }

  for (const dia of dias) {
    for (const grupo of dia.data)
      grupo.ocorrencias.sort((a, b) => a.quando.getTime() - b.quando.getTime());
  }
  return dias;
};
