import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSugestoesStore } from '@/stores/useSugestoesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';

/**
 * Apaga o que a pessoa guardou no aparelho: lembretes, marcações, tipos, sugestões, histórico de
 * exercícios e preferências. Os lembretes e o histórico ficam vazios, sem os exemplos de
 * demonstração; tipos e sugestões voltam aos iniciais. As notificações agendadas somem na
 * sincronização seguinte, pois não há mais lembretes.
 */
export const apagarTodosOsDados = () => {
  useLembretesStore.setState({
    lembretes: [],
    registros: [],
    ocultosDaAgenda: [],
    ultimoExcluido: null,
  });
  useExerciciosStore.setState({ historico: [], sessao: null });
  useTiposLembreteStore.getState().resetarParaMocks();
  useSugestoesStore.getState().resetarParaMocks();
  useSettingsStore.getState().resetPreferences();
};
