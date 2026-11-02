import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { MensagemErro } from '@/components/formulario/base/mensagem-erro';
import { RotuloCampo } from '@/components/formulario/base/rotulo-campo';
import { Spacing } from '@/constants/theme';

export type CampoRotuladoProps = Pick<ViewProps, 'onLayout'> & {
  rotulo: string;
  obrigatorio?: boolean;
  erro?: string;
  children: ReactNode;
};

export const CampoRotulado = ({
  rotulo,
  obrigatorio,
  erro,
  children,
  onLayout,
}: CampoRotuladoProps) => (
  <View style={styles.container} onLayout={onLayout}>
    <RotuloCampo rotulo={rotulo} obrigatorio={obrigatorio} />
    {children}
    {erro ? <MensagemErro mensagem={erro} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
