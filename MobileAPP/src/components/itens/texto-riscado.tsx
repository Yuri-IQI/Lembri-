import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ComponentSize } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextoRiscadoProps = {
  riscado: boolean;
  children: ReactNode;
};

// AVISO: textDecorationLine não aparece no Android com a fonte Inter; o risco é desenhado por cima.
export const TextoRiscado = ({ riscado, children }: TextoRiscadoProps) => {
  const theme = useTheme();

  return (
    <View style={styles.caixa}>
      {children}
      {riscado && <View style={[styles.linha, { backgroundColor: theme.textSecondary }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  caixa: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  linha: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ComponentSize.strikethroughHeight,
  },
});
