import type { Lembrete } from '@/types/lembrete';
import { horariosDoLembrete } from '@/utils/lembrete';

import { enviarLembrete, wearDisponivel } from './wear-service';

/**
 * Manda o lembrete salvo para os relógios conectados, com o primeiro horário dele. Falhas não
 * atrapalham o salvar: o relógio recebe de novo na próxima edição.
 */
export const enviarAoRelogio = (lembrete: Lembrete) => {
  const [horario] = horariosDoLembrete(lembrete);
  if (!wearDisponivel || !horario) return;
  enviarLembrete({ id: lembrete.id, titulo: lembrete.titulo, horario }).catch((erro) =>
    console.warn('[wear] falha ao enviar lembrete', erro)
  );
};
