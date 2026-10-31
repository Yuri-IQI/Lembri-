import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { ChipHorario } from '@/components/chip-horario';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorDias } from '@/components/formulario/seletor-dias';
import { SeletorHorario } from '@/components/formulario/seletor-horario';
import { Interruptor } from '@/components/interruptor';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import {
  BorderWidth,
  Radius,
  Spacing,
  TouchTarget,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { CriarLembreteInput, DiaSemana } from '@/types/lembrete';

export type FormularioLembreteProps = {
  dadosIniciais?: Partial<CriarLembreteInput>;
  onSalvar: (dados: CriarLembreteInput) => void;
  rotuloBotao?: string;
};

/**
 * Componente oficial de Formulário de Lembrete (Frame Figma 152:1551 - CARD-33).
 *
 * Características WCAG 2.2 AAA:
 * - Validação inline com mensagens de alto contraste em Colors.danger;
 * - Alvos de toque TouchTarget = 56dp em todos os campos, chips e seletores;
 * - Atalho com borda tracejada "+ Novo Tipo" que navega para gerenciador de categorias;
 * - Card aglutinado de Horários e Repetição de Dias com contraste aprimorado.
 */
export const FormularioLembrete = ({
  dadosIniciais,
  onSalvar,
  rotuloBotao = 'SALVAR',
}: FormularioLembreteProps) => {
  const theme = useTheme();
  const tipos = useTiposLembreteStore((state) => state.tipos);

  const [titulo, setTitulo] = useState(dadosIniciais?.titulo ?? '');
  const [tipoId, setTipoId] = useState<string | undefined>(dadosIniciais?.tipoId);
  const [horarios, setHorarios] = useState<string[]>(
    dadosIniciais?.horarios && dadosIniciais.horarios.length > 0
      ? dadosIniciais.horarios
      : ['08:00']
  );
  const [novoHorarioTemp, setNovoHorarioTemp] = useState('12:00');
  const [exibindoSeletorHorario, setExibindoSeletorHorario] = useState(false);
  const [dias, setDias] = useState<DiaSemana[]>(
    dadosIniciais?.dias && dadosIniciais.dias.length > 0
      ? dadosIniciais.dias
      : [0, 1, 2, 3, 4, 5, 6]
  );
  const [descricao, setDescricao] = useState(dadosIniciais?.descricao ?? '');
  const [exigeConfirmacao, setExigeConfirmacao] = useState(
    dadosIniciais?.exigeConfirmacao ?? false
  );

  const [erroTitulo, setErroTitulo] = useState<string | null>(null);
  const [erroHorarios, setErroHorarios] = useState<string | null>(null);

  const handleNovoTipo = () => {
    router.push('/tipos-lembrete' as const);
  };

  const adicionarHorario = (h: string) => {
    if (!horarios.includes(h)) {
      const novos = [...horarios, h].sort();
      setHorarios(novos);
      setErroHorarios(null);
    }
    setExibindoSeletorHorario(false);
  };

  const removerHorario = (h: string) => {
    if (horarios.length <= 1) {
      setErroHorarios('O lembrete precisa ter pelo menos um horário.');
      return;
    }
    setHorarios(horarios.filter((item) => item !== h));
  };

  const handleSubmeter = () => {
    let temErro = false;

    if (!titulo.trim()) {
      setErroTitulo('Informe um título para o lembrete.');
      temErro = true;
    } else {
      setErroTitulo(null);
    }

    if (horarios.length === 0) {
      setErroHorarios('Adicione pelo menos um horário.');
      temErro = true;
    } else {
      setErroHorarios(null);
    }

    if (temErro) return;

    onSalvar({
      titulo: titulo.trim(),
      tipoId,
      horarios,
      dias: dias.length > 0 ? dias : [0, 1, 2, 3, 4, 5, 6],
      descricao: descricao.trim() || undefined,
      exigeConfirmacao,
      templateOrigem: dadosIniciais?.templateOrigem,
    });
  };

  return (
    <View style={styles.formulario}>
      {/* Campo Título */}
      <CampoTexto
        rotulo="Título"
        placeholder="Ex.: Tomar remédio, Jantar"
        valor={titulo}
        onAlterar={(txt) => {
          setTitulo(txt);
          if (erroTitulo) setErroTitulo(null);
        }}
        erro={erroTitulo ?? undefined}
      />

      {/* Seção Tipo com Chips + Botão Tracejado + Novo Tipo */}
      <View style={styles.blocoSecao}>
        <ThemedText type="label">Tipo</ThemedText>
        <View style={styles.gradeTipos}>
          {tipos.map((tipo) => {
            const selecionado = tipoId === tipo.id;
            return (
              <Pressable
                key={tipo.id}
                onPress={() => setTipoId(selecionado ? undefined : tipo.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: selecionado }}
                accessibilityLabel={`Categoria ${tipo.nome}`}
                style={({ pressed }) => [
                  styles.chipTipo,
                  {
                    backgroundColor: selecionado ? theme.primary : theme.surface,
                    borderColor: selecionado ? theme.primary : theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}>
                <View
                  style={[
                    styles.pontoCor,
                    { backgroundColor: tipo.corHex },
                  ]}
                />
                <ThemedText
                  type={selecionado ? 'defaultBold' : 'default'}
                  style={{ color: selecionado ? theme.onPrimary : theme.text }}>
                  {tipo.nome}
                </ThemedText>
              </Pressable>
            );
          })}

          {/* Botão tracejado + Novo Tipo (Figma 152:1551) */}
          <Pressable
            onPress={handleNovoTipo}
            accessibilityRole="button"
            accessibilityLabel="+ Novo Tipo"
            accessibilityHint="Navega para a tela de gerenciamento de tipos de lembrete"
            style={({ pressed }) => [
              styles.botaoNovoTipoTracejado,
              { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
            ]}>
            <SymbolView name={{ android: 'add' }} size={20} tintColor={theme.text} />
            <ThemedText type="defaultBold">+ Novo Tipo</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Card Aglutinado: Horário + Repetir Dias */}
      <Card style={[styles.cardAglutinado, { borderColor: theme.border }]}>
        {/* Horários */}
        <View style={styles.subSecaoHorarios}>
          <View style={styles.linhaCabecalhoHorario}>
            <View style={styles.iconeETitulo}>
              <SymbolView name={{ android: 'schedule' }} size={22} tintColor={theme.text} />
              <ThemedText type="label">Horário</ThemedText>
            </View>

            <Pressable
              onPress={() => setExibindoSeletorHorario(!exibindoSeletorHorario)}
              accessibilityRole="button"
              accessibilityLabel={
                exibindoSeletorHorario ? 'Fechar seletor de horário' : 'Adicionar outro horário'
              }
              style={styles.botaoAdicionarHorario}>
              <SymbolView
                name={{ android: exibindoSeletorHorario ? 'close' : 'add' }}
                size={22}
                tintColor={theme.primary}
              />
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                {exibindoSeletorHorario ? 'Fechar' : '+ Horário'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Chips de Horários Ativos com ação de exclusão */}
          <View style={styles.chipsAtivos}>
            {horarios.map((h) => (
              <View key={h} style={styles.chipComExcluir}>
                <ChipHorario horario={h} destacado={true} />
                <Pressable
                  onPress={() => removerHorario(h)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover horário ${h}`}
                  hitSlop={Spacing.two}
                  style={styles.botaoRemoverChip}>
                  <SymbolView name={{ android: 'close' }} size={16} tintColor={theme.text} />
                </Pressable>
              </View>
            ))}
          </View>

          {erroHorarios ? (
            <ThemedText type="smallBold" style={{ color: theme.danger }}>
              {erroHorarios}
            </ThemedText>
          ) : null}

          {/* Seletor inline quando aberto */}
          {exibindoSeletorHorario && (
            <View style={styles.caixaSeletorInline}>
              <SeletorHorario
                rotulo="Escolha o horário a incluir"
                valor={novoHorarioTemp}
                onAlterar={setNovoHorarioTemp}
              />
              <Botao
                rotulo="Adicionar este horário"
                variante="secundario"
                onPress={() => adicionarHorario(novoHorarioTemp)}
                accessibilityLabel={`Confirmar e incluir horário ${novoHorarioTemp}`}
              />
            </View>
          )}
        </View>

        <View style={[styles.divisor, { borderColor: theme.borderSubtle }]} />

        {/* Repetir Dias */}
        <SeletorDias
          rotulo="Repetir Dias"
          selecionados={dias}
          onAlterar={setDias}
        />
      </Card>

      {/* Campo Descrição (textarea multiline) */}
      <CampoTexto
        rotulo="Descrição:"
        placeholder="Instruções ou detalhes adicionais..."
        valor={descricao}
        onAlterar={setDescricao}
        multiline={true}
        numberOfLines={3}
        inputStyle={styles.textarea}
      />

      {/* Switch Exige Confirmação */}
      <View style={styles.linhaConfirmacao}>
        <View style={styles.textosConfirmacao}>
          <ThemedText type="defaultBold">Exige confirmação</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Alerta no celular e no relógio até você marcar como feito
          </ThemedText>
        </View>
        <Interruptor
          ligado={exigeConfirmacao}
          onAlternar={() => setExigeConfirmacao(!exigeConfirmacao)}
          accessibilityLabel={`Exigir confirmação deste lembrete: ${exigeConfirmacao ? 'ativado' : 'desativado'}`}
        />
      </View>

      {/* Botão SALVAR rodapé */}
      <Botao
        rotulo={rotuloBotao}
        variante="primario"
        onPress={handleSubmeter}
        accessibilityLabel={rotuloBotao}
        style={styles.botaoSalvar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formulario: {
    gap: Spacing.four,
    paddingBottom: Spacing.four * 2,
  },
  blocoSecao: {
    gap: Spacing.two,
  },
  gradeTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chipTipo: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.thin,
  },
  pontoCor: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
  },
  botaoNovoTipoTracejado: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderWidth: BorderWidth.thin,
    borderStyle: 'dashed',
  },
  cardAglutinado: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
  subSecaoHorarios: {
    gap: Spacing.two,
  },
  linhaCabecalhoHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconeETitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  botaoAdicionarHorario: {
    minHeight: TouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  chipsAtivos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    alignItems: 'center',
  },
  chipComExcluir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  botaoRemoverChip: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caixaSeletorInline: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  divisor: {
    borderBottomWidth: 1,
    marginVertical: Spacing.one,
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  linhaConfirmacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  textosConfirmacao: {
    flex: 1,
    gap: Spacing.one,
  },
  botaoSalvar: {
    minHeight: TouchTarget,
    marginTop: Spacing.two,
  },
});
