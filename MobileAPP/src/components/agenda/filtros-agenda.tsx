import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BotaoFiltro } from '@/components/agenda/botao-filtro';
import { ThemedText } from '@/components/themed-text';
import { Spacing, TouchTarget } from '@/constants/theme';
import type { ChaveSecao } from '@/hooks/use-agenda';
import { useTheme } from '@/hooks/use-theme';

type FiltrosAgendaProps = {
  ativa: ChaveSecao;
  pausados: number;
  onSelecionar: (chave: ChaveSecao) => void;
};

type Filtro = { chave: ChaveSecao; rotulo: string };

/**
 * Abas da agenda: "A seguir" e "Já passaram" sempre visíveis; "Pausados" e "Todos" aparecem
 * em "Mais opções".
 */
export const FiltrosAgenda = ({ ativa, pausados, onSelecionar }: FiltrosAgendaProps) => {
  const theme = useTheme();
  const principais: Filtro[] = [
    { chave: 'proximas', rotulo: 'A seguir' },
    { chave: 'passadas', rotulo: 'Já passaram' },
  ];
  const extras: Filtro[] = [
    { chave: 'pausados', rotulo: `Pausados (${pausados})` },
    { chave: 'todos', rotulo: 'Todos' },
  ];
  const ativaEhExtra = extras.some((filtro) => filtro.chave === ativa);
  const [aberto, setAberto] = useState(ativaEhExtra);

  const alternar = () => {
    if (aberto && ativaEhExtra) onSelecionar('proximas');
    setAberto(!aberto);
  };

  const linha = (filtros: Filtro[]) => (
    <View style={styles.linha} accessibilityRole="tablist">
      {filtros.map((filtro) => (
        <BotaoFiltro
          key={filtro.chave}
          rotulo={filtro.rotulo}
          selecionado={filtro.chave === ativa}
          onPress={() => onSelecionar(filtro.chave)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {linha(principais)}
      {aberto && linha(extras)}
      <Pressable
        onPress={alternar}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        accessibilityLabel={aberto ? 'Menos opções de filtro' : 'Mais opções de filtro'}
        style={({ pressed }) => [styles.mais, { opacity: pressed ? 0.7 : 1 }]}>
        <ThemedText type="smallBold">{aberto ? 'Menos opções' : 'Mais opções'}</ThemedText>
        <SymbolView
          name={{ android: aberto ? 'expand_less' : 'expand_more' }}
          size={24}
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  mais: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
  },
});
