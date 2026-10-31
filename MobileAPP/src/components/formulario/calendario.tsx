import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BotaoIcone } from '@/components/botao-icone';
import { DiaCalendario } from '@/components/formulario/dia-calendario';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { chaveData, inicioDoDia, lerData, NOMES_MES, semanasDoMes } from '@/utils/data';
import { capitalizar } from '@/utils/texto';

const LETRAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export type CalendarioProps = {
  /** Data escolhida (AAAA-MM-DD) ou vazio. */
  valor: string;
  onEscolher: (data: string) => void;
  minimo?: Date;
  maximo?: Date;
};

/**
 * Calendário mensal simples, com navegação entre meses e dias fora do intervalo desabilitados.
 */
export const Calendario = ({ valor, onEscolher, minimo, maximo }: CalendarioProps) => {
  const inicial = lerData(valor) ?? new Date();
  const [mes, setMes] = useState({ ano: inicial.getFullYear(), mes: inicial.getMonth() });
  const hoje = chaveData(new Date());
  const tituloMes = `${capitalizar(NOMES_MES[mes.mes])} de ${mes.ano}`;

  const mudarMes = (delta: number) => {
    const alvo = new Date(mes.ano, mes.mes + delta, 1);
    setMes({ ano: alvo.getFullYear(), mes: alvo.getMonth() });
  };

  const dentroDoIntervalo = (dia: Date) =>
    (!minimo || dia >= inicioDoDia(minimo)) && (!maximo || dia <= inicioDoDia(maximo));

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <BotaoIcone
          icone="chevron_left"
          accessibilityLabel="Mês anterior"
          onPress={() => mudarMes(-1)}
        />
        <ThemedText type="defaultBold" accessibilityRole="header" accessibilityLiveRegion="polite">
          {tituloMes}
        </ThemedText>
        <BotaoIcone
          icone="chevron_right"
          accessibilityLabel="Próximo mês"
          onPress={() => mudarMes(1)}
        />
      </View>
      <View style={styles.semana} importantForAccessibility="no-hide-descendants">
        {LETRAS_SEMANA.map((letra, i) => (
          <ThemedText key={i} type="smallBold" themeColor="textSecondary" style={styles.letra}>
            {letra}
          </ThemedText>
        ))}
      </View>
      {semanasDoMes(mes.ano, mes.mes).map((semana, i) => (
        <View key={i} style={styles.semana}>
          {semana.map((dia, j) => (
            <DiaCalendario
              key={j}
              dia={dia}
              hoje={!!dia && chaveData(dia) === hoje}
              selecionado={!!dia && chaveData(dia) === valor}
              disponivel={!!dia && dentroDoIntervalo(dia)}
              rotulo={dia ? `${dia.getDate()} de ${NOMES_MES[dia.getMonth()]}` : ''}
              onEscolher={() => dia && onEscolher(chaveData(dia))}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  semana: {
    flexDirection: 'row',
  },
  letra: {
    flex: 1,
    textAlign: 'center',
  },
});
