import { useExerciciosStore } from '@/stores/useExerciciosStore';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSugestoesStore } from '@/stores/useSugestoesStore';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';

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
