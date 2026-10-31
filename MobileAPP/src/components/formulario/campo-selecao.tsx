import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CaixaDialogo } from '@/components/caixa-dialogo';
import { CampoRotulado } from '@/components/formulario/campo-rotulado';
import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type OpcaoSelecao<T> = { valor: T; rotulo: string };

type CampoSelecaoProps<T> = {
  rotulo: string;
  opcoes: OpcaoSelecao<T>[];
  valor: T;
  onAlterar: (valor: T) => void;
};

/**
 * Select simples: mostra a opção escolhida e abre a lista para trocar.
 */
export const CampoSelecao = <T,>({ rotulo, opcoes, valor, onAlterar }: CampoSelecaoProps<T>) => {
  const theme = useTheme();
  const [aberta, setAberta] = useState(false);
  const atual = opcoes.find((opcao) => opcao.valor === valor)?.rotulo ?? '';

  return (
    <CampoRotulado rotulo={rotulo}>
      <Pressable
        onPress={() => setAberta(true)}
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${atual}`}
        accessibilityHint="Abre a lista de opções"
        style={({ pressed }) => [
          styles.campo,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}>
        <ThemedText style={styles.texto}>{atual}</ThemedText>
        <SymbolView name={{ android: 'expand_more' }} size={28} tintColor={theme.text} />
      </Pressable>
      <CaixaDialogo
        visivel={aberta}
        titulo={rotulo}
        rotuloConfirmar="Fechar"
        somenteConfirmar
        onConfirmar={() => setAberta(false)}
        onCancelar={() => setAberta(false)}>
        <View accessibilityRole="radiogroup">
          {opcoes.map((opcao) => {
            const escolhida = opcao.valor === valor;
            return (
              <Pressable
                key={opcao.rotulo}
                onPress={() => {
                  onAlterar(opcao.valor);
                  setAberta(false);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: escolhida }}
                style={styles.opcao}>
                <SymbolView
                  name={{ android: escolhida ? 'radio_button_checked' : 'radio_button_unchecked' }}
                  size={28}
                  tintColor={theme.text}
                />
                <ThemedText type={escolhida ? 'defaultBold' : 'default'}>{opcao.rotulo}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      </CaixaDialogo>
    </CampoRotulado>
  );
};

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.regular,
  },
  texto: {
    flex: 1,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: TouchTarget,
  },
});
