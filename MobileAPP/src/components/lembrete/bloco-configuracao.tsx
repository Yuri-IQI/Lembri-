import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChipHorario } from '@/components/chip-horario';
import { ValorDetalhe } from '@/components/lembrete/valor-detalhe';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Lembrete } from '@/types/lembrete';
import { detalhesDoLembrete } from '@/utils/detalhes-lembrete';
import { descreverAgenda, horariosDoLembrete } from '@/utils/lembrete';

type BlocoConfiguracaoProps = {
  lembrete: Lembrete;
  horarioDestacado?: string;
  /** Horários de hoje já marcados como feitos. */
  feitosHoje?: string[];
};

const Secao = ({
  rotulo,
  divisor,
  children,
}: {
  rotulo: string;
  divisor: boolean;
  children: ReactNode;
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.secao, divisor && [styles.divisor, { borderColor: theme.borderSubtle }]]}
      accessible>
      <ThemedText type="label" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      {children}
    </View>
  );
};

export const BlocoConfiguracao = ({
  lembrete,
  horarioDestacado,
  feitosHoje = [],
}: BlocoConfiguracaoProps) => {
  const detalhes = detalhesDoLembrete(lembrete);

  return (
    <Card style={styles.bloco}>
      <Secao rotulo="Horários" divisor>
        <View style={styles.chips}>
          {horariosDoLembrete(lembrete).map((horario) => (
            <ChipHorario
              key={horario}
              horario={horario}
              destacado={horario === horarioDestacado}
              feito={feitosHoje.includes(horario)}
            />
          ))}
        </View>
      </Secao>
      <Secao
        rotulo={lembrete.template === 'compromisso' ? 'Data' : 'Repete'}
        divisor={detalhes.length > 0}>
        <ThemedText type="defaultBold">{descreverAgenda(lembrete)}</ThemedText>
      </Secao>
      {detalhes.map(({ rotulo, valor, numerada }, indice) => (
        <Secao key={rotulo} rotulo={rotulo} divisor={indice < detalhes.length - 1}>
          <ValorDetalhe valor={valor} numerada={numerada} />
        </Secao>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  bloco: {
    gap: Spacing.three - Spacing.one,
    padding: Spacing.three - Spacing.one,
    borderWidth: BorderWidth.thick - 0.5,
  },
  secao: {
    gap: Spacing.two,
  },
  divisor: {
    paddingBottom: Spacing.three - Spacing.one,
    borderBottomWidth: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
