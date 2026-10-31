import { router } from 'expo-router';

import { useAvisoStore } from '@/stores/useAvisoStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSugestoesStore } from '@/stores/useSugestoesStore';
import type { DadosLembrete } from '@/types/lembrete';
import { pedirPermissaoNotificacoes } from '@/utils/preparar-notificacoes';

export const MENSAGEM_SALVO = 'Pronto! Seu lembrete foi salvo.';

const registrarSugestoes = (dados: DadosLembrete) => {
  const { registrar } = useSugestoesStore.getState();
  if (dados.template === 'remedio') {
    registrar('remedios', [dados.titulo]);
    registrar('unidades', [dados.quantidade.unidade]);
    registrar('comoTomar', dados.comoTomar ? [dados.comoTomar] : []);
  }
  if (dados.template === 'compromisso') {
    registrar('compromissos', [dados.titulo]);
    registrar('participantes', dados.participantes);
    registrar('locais', dados.local ? [dados.local] : []);
    registrar('itensLevar', dados.oQueLevar);
  }
  if (dados.template === 'tarefa') {
    registrar('tarefas', [dados.titulo]);
    registrar('materiais', dados.materiais);
  }
};

/**
 * Salva o lembrete (novo ou editado), guarda as sugestões e volta com o aviso de sucesso.
 * Retorna false quando o limite de lembretes impede criar.
 */
export const useSalvarLembrete = (idEditado?: string) => {
  const mostrarAviso = useAvisoStore((state) => state.mostrar);

  return (dados: DadosLembrete): boolean => {
    const { adicionarLembrete, editarLembrete } = useLembretesStore.getState();
    if (idEditado) {
      editarLembrete(idEditado, dados);
    } else if (!adicionarLembrete(dados)) {
      return false;
    }
    registrarSugestoes(dados);
    mostrarAviso(MENSAGEM_SALVO);
    pedirPermissaoNotificacoes().catch(() => undefined);
    if (idEditado) router.back();
    else router.dismissTo('/');
    return true;
  };
};
