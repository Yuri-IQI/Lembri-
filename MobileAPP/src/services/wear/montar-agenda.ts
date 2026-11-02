import { ocorrenciasDoDia } from '@/stores/agenda-lembretes';
import type { Lembrete, OcorrenciaLembrete, RegistroFeito } from '@/types/lembrete';
import { chaveData, doisDigitos, somarDias } from '@/utils/tempo/data';
import { resumoDoLembrete } from '@/utils/lembrete/detalhes-lembrete';

import type { LembreteAgenda } from './contrato';

const dataHoraLocal = (data: Date) =>
  `${chaveData(data)}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;

const paraAgenda = (ocorrencia: OcorrenciaLembrete, feitos: Set<string>): LembreteAgenda => ({
  chave: ocorrencia.chave,
  quando: dataHoraLocal(ocorrencia.quando),
  titulo: ocorrencia.lembrete.titulo,
  detalhe: resumoDoLembrete(ocorrencia.lembrete),
  feito: feitos.has(ocorrencia.chave),
});

export const montarAgenda = (
  lembretes: Lembrete[],
  registros: RegistroFeito[],
  agora: Date
): LembreteAgenda[] => {
  const feitos = new Set(registros.map((registro) => registro.chave));
  return [agora, somarDias(agora, 1)]
    .flatMap((dia) => ocorrenciasDoDia(lembretes, dia))
    .map((ocorrencia) => paraAgenda(ocorrencia, feitos));
};
