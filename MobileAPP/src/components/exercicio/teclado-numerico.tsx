import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface TecladoNumericoProps {
  aoDigitar: (digito: string) => void;
  aoApagar: () => void;
}

/**
 * Teclado numérico padronizado; os dígitos aparecem direto na casa ativa (Figma exercicios_exec / decisão D8).
 *
 * Grade acessível 3×4 com dígitos de 1 a 9, 0 e tecla Apagar, todos com alvos de toque ≥ 56dp (WCAG 2.5.5).
 */
export const TecladoNumerico = ({
  aoDigitar,
  aoApagar,
}: TecladoNumericoProps) => {
  const theme = useTheme();

  const renderTecla = (digito: string) => (
    <Pressable
      key={`tecla-${digito}`}
      onPress={() => aoDigitar(digito)}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Tecla ${digito}`}
      style={[
        styles.tecla,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.borderSubtle,
        },
      ]}>
      <ThemedText type="subheading" style={styles.textoTecla}>
        {digito}
      </ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grade}>
        <View style={styles.linha}>
          {renderTecla('1')}
          {renderTecla('2')}
          {renderTecla('3')}
        </View>
        <View style={styles.linha}>
          {renderTecla('4')}
          {renderTecla('5')}
          {renderTecla('6')}
        </View>
        <View style={styles.linha}>
          {renderTecla('7')}
          {renderTecla('8')}
          {renderTecla('9')}
        </View>
        <View style={styles.linha}>
          <View style={styles.teclaVazia} />
          {renderTecla('0')}
          <Pressable
            onPress={aoApagar}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Apagar último dígito"
            style={[
              styles.tecla,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.borderSubtle,
              },
            ]}>
            <SymbolView
              name={{ android: 'backspace' }}
              size={26}
              tintColor={theme.text}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    alignItems: 'center',
    width: '100%',
  },
  grade: {
    gap: Spacing.two,
    width: '100%',
    maxWidth: 340,
  },
  linha: {
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  tecla: {
    flex: 1,
    minHeight: TouchTarget,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teclaVazia: {
    flex: 1,
    minHeight: TouchTarget,
  },
  textoTecla: {
    textAlign: 'center',
  },
});
