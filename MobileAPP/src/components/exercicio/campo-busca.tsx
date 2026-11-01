import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface CampoBuscaProps {
  valor: string;
  aoMudar: (texto: string) => void;
  aoLimpar: () => void;
}

/**
 * Campo de busca padronizado para a listagem de exercícios (Figma exercicios_lista).
 *
 * Contém ícone de lupa, entrada de texto com contraste AAA e botão acessível de limpar (TouchTarget = 56).
 */
export const CampoBusca = ({ valor, aoMudar, aoLimpar }: CampoBuscaProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.borderSubtle,
        },
      ]}>
      <View
        style={styles.iconeLupa}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}>
        <SymbolView
          name={{ android: 'search' }}
          size={24}
          tintColor={theme.textSecondary}
        />
      </View>

      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={valor}
        onChangeText={aoMudar}
        placeholder="Buscar..."
        placeholderTextColor={theme.textSecondary}
        accessibilityRole="search"
        accessibilityLabel="Buscar exercícios pelo nome"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {valor.length > 0 && (
        <Pressable
          onPress={aoLimpar}
          style={styles.botaoLimpar}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}>
          <SymbolView
            name={{ android: 'close' }}
            size={22}
            tintColor={theme.text}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.hairline,
    minHeight: TouchTarget,
    paddingHorizontal: Spacing.two,
  },
  iconeLupa: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  botaoLimpar: {
    width: TouchTarget,
    height: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
