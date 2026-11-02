import { useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, type ViewProps } from 'react-native';

import { CaixaDialogo } from '@/components/feedback/caixa-dialogo';
import { CampoTexto } from '@/components/formulario/texto/campo-texto';
import { ListaChips } from '@/components/formulario/selecao/lista-chips';
import { SeletorHorario } from '@/components/formulario/data-hora/seletor-horario';
import { Spacing } from '@/constants/theme';
import { lerHorario } from '@/utils/tempo/data';
import { mascararHorario } from '@/utils/texto/mascara';
import { normalizarHorarios } from '@/utils/lembrete/normalizar-lembrete';

export type CampoHorariosProps = Pick<ViewProps, 'onLayout'> & {
  horarios: string[];
  onAlterar: (horarios: string[]) => void;
  unico?: boolean;
  erro?: string;
};

const MAXIMO_HORARIOS = 8;
const HORARIO_INICIAL = '08:00';

export const CampoHorarios = ({
  horarios,
  onAlterar,
  unico = false,
  erro,
  onLayout,
}: CampoHorariosProps) => {
  const [texto, setTexto] = useState(unico ? (horarios[0] ?? '') : '');
  const [erroDigitado, setErroDigitado] = useState<string>();
  const [rascunho, setRascunho] = useState<string | null>(null);

  const usar = (horario: string) => {
    if (unico) {
      setTexto(horario);
      onAlterar([horario]);
      return;
    }
    if (horarios.length >= MAXIMO_HORARIOS) {
      setErroDigitado(`Use no máximo ${MAXIMO_HORARIOS} horários.`);
      return;
    }
    setTexto('');
    onAlterar(normalizarHorarios([...horarios, horario]));
    AccessibilityInfo.announceForAccessibility(`Horário ${horario} adicionado`);
  };

  const digitar = (novo: string) => {
    const mascarado = mascararHorario(novo);
    setTexto(mascarado);
    setErroDigitado(undefined);
    if (mascarado.length < 5) {
      if (unico) onAlterar([]);
      return;
    }
    if (lerHorario(mascarado)) usar(mascarado);
    else setErroDigitado('Esse horário não existe. Use de 00:00 a 23:59.');
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <CampoTexto
        rotulo={unico ? 'Horário' : 'Horários'}
        obrigatorio
        valor={texto}
        onAlterar={digitar}
        placeholder={unico ? 'Ex.: 14:30' : 'Digite um horário. Ex.: 08:00'}
        keyboardType="number-pad"
        maxLength={5}
        erro={erroDigitado ?? erro}
        acao={{
          icone: 'schedule',
          rotulo: 'Escolher o horário no relógio',
          onPress: () => setRascunho(lerHorario(texto) ? texto : HORARIO_INICIAL),
        }}
      />
      {!unico && (
        <ListaChips
          itens={horarios}
          onRemover={(horario) => onAlterar(horarios.filter((h) => h !== horario))}
        />
      )}
      <CaixaDialogo
        visivel={rascunho !== null}
        titulo={unico ? 'Horário' : 'Adicionar horário'}
        rotuloConfirmar={unico ? 'Escolher' : 'Adicionar'}
        onConfirmar={() => {
          if (rascunho) usar(rascunho);
          setRascunho(null);
        }}
        onCancelar={() => setRascunho(null)}>
        <SeletorHorario valor={rascunho ?? HORARIO_INICIAL} onAlterar={setRascunho} />
      </CaixaDialogo>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
