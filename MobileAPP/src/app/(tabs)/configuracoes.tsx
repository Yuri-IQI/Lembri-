import { SecaoDesenvolvimento } from '@/components/ajustes/secao-desenvolvimento';
import { CartaoAjuste } from '@/components/cartao-ajuste';
import { MainContainer } from '@/components/main-container';
import { ThemedText } from '@/components/themed-text';
import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Tela de configurações e preferências de acessibilidade do Lembri (CARD-27).
 *
 * Oferece controle direto sobre o modo "Texto ampliado" via CartaoAjuste colapsável,
 * propagando reativamente o aumento de 20% na escala tipográfica em todo o aplicativo.
 */
const ConfiguracoesScreen = () => {
  const isLargeText = useSettingsStore((state) => state.isLargeText);
  const toggleLargeText = useSettingsStore((state) => state.toggleLargeText);
  const showExerciseHints = useSettingsStore((state) => state.showExerciseHints);
  const toggleExerciseHints = useSettingsStore((state) => state.toggleExerciseHints);

  return (
    <MainContainer>
      <ThemedText type="label">Preferências Visuais e Acessibilidade</ThemedText>

      <CartaoAjuste
        titulo="Texto ampliado"
        descricao="Aumenta em 20% o tamanho de todos os textos do Lembri para melhorar o conforto visual e a legibilidade."
        ligado={isLargeText}
        onAlternar={toggleLargeText}
      />

      <CartaoAjuste
        titulo="Dicas nos exercícios"
        descricao="Depois de conferir a resposta, mostra se o número está acima ou abaixo do valor certo e marca em amarelo o que é de outra posição. Desligado, cada casa mostra só certo ou errado."
        ligado={showExerciseHints}
        onAlternar={toggleExerciseHints}
      />

      {__DEV__ && <SecaoDesenvolvimento />}
    </MainContainer>
  );
};

export default ConfiguracoesScreen;
