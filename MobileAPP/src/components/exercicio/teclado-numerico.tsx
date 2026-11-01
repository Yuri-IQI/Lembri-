import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderWidth, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface TecladoNumericoProps {
  bufferDigitos: string;
  tamanhoEsperado: number;
  aoDigitar: (digito: string) => void;
  aoApagar: () => void;
}

/**
 * Teclado numérico padronizado com visor de dígitos em tempo real (Figma exercicios_exec / decisão D8).
 *
 * Grade acessível 3×4 com dígitos de 1 a 9, 0 e tecla Apagar, todos com alvos de toque ≥ 56dp (WCAG 2.5.5).
 */
export const TecladoNumerico = ({
  bufferDigitos,
  tamanhoEsperado,
  aoDigitar,
  aoApagar,
}: TecladoNumericoProps) => {
  const theme = useTheme();

  // Monta representação visual do visor: ex: '8 ?' para tamanho 2 quando buffer for '8'
  const partesVisor: string[] = [];
  for (let i = 0; i < tamanhoEsperado; i++) {
    partesVisor.push(bufferDigitos[i] ?? '?');
  }
  const textoVisor = partesVisor.join(' ');
  const labelVisor = `Dígitos digitados: ${bufferDigitos.length > 0 ? bufferDigitos : 'nenhum'}`;

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
      {/* Visor de digitação */}
      <View
        style={[
          styles.visor,
          {
            backgroundColor: theme.accentLight,
            borderColor: theme.borderSubtle,
          },
        ]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={labelVisor}>
        <ThemedText type="title" style={styles.textoVisor}>
          {textoVisor}
        </ThemedText>
      </View>

      {/* Grade numérico */}
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
  visor: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.hairline,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoVisor: {
    letterSpacing: 4,
    textAlign: 'center',
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
