import { useState, type ComponentType } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/app-bar/top-bar';
import { Botao } from '@/components/botao';
import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { DialogoLimite } from '@/components/forms/dialogo-limite';
import { FormularioCompromisso } from '@/components/forms/formulario-compromisso';
import { FormularioLivre } from '@/components/forms/formulario-livre';
import { FormularioRemedio } from '@/components/forms/formulario-remedio';
import { FormularioTarefa } from '@/components/forms/formulario-tarefa';
import type { PropsFormulario } from '@/components/forms/props-formulario';
import { Spacing } from '@/constants/theme';
import { useFormularioLembrete } from '@/hooks/formulario/use-formulario-lembrete';
import { useOpcoesTipo } from '@/hooks/formulario/use-opcoes-tipo';
import { usePosicoesCampos } from '@/hooks/formulario/use-posicoes-campos';
import { useSairSemSalvar } from '@/hooks/formulario/use-sair-sem-salvar';
import { useSalvarLembrete } from '@/hooks/formulario/use-salvar-lembrete';
import type { DadosDoTemplate, TemplateId } from '@/types/lembrete';

const CORPOS: { [T in TemplateId]: ComponentType<PropsFormulario<T>> } = {
  remedio: FormularioRemedio,
  compromisso: FormularioCompromisso,
  tarefa: FormularioTarefa,
  livre: FormularioLivre,
};

type TelaFormularioProps<T extends TemplateId> = {
  titulo: string;
  inicial: DadosDoTemplate<T>;
  /** Lembrete editado: guarda os dados salvos para validar datas que já estavam no passado. */
  edicao?: { id: string; original: DadosDoTemplate<T> };
};

/**
 * Estrutura comum aos formulários de criar e editar: barra superior com título, campos do
 * template, botão de salvar e confirmação ao sair sem salvar.
 */
export const TelaFormulario = <T extends TemplateId>({
  titulo,
  inicial,
  edicao,
}: TelaFormularioProps<T>) => {
  const form = useFormularioLembrete(inicial, edicao?.original);
  const { rolagem, registrar, rolarPara } = usePosicoesCampos();
  const { opcoes, resolverTipos } = useOpcoesTipo(inicial.template);
  const { pedirSaida, dialogo } = useSairSemSalvar(form.sujo);
  const salvar = useSalvarLembrete(edicao?.id);
  const [noLimite, setNoLimite] = useState(false);
  const Corpo = CORPOS[inicial.template as T] as ComponentType<PropsFormulario<T>>;

  const aoSalvar = () => {
    const resultado = form.validar();
    if ('erro' in resultado) {
      rolarPara(resultado.erro);
      return;
    }
    const dados = { ...resultado.dados, tipoIds: resolverTipos(resultado.dados.tipoIds) };
    if (!salvar(dados)) setNoLimite(true);
  };

  return (
    <View style={styles.tela}>
      <TopBar titulo={titulo} onVoltar={pedirSaida} />
      <ScrollView
        ref={rolagem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.conteudo}>
        <Corpo form={form} registrar={registrar} tipos={opcoes} />
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.acoes}>
        <Botao rotulo={edicao ? 'SALVAR ALTERAÇÕES' : 'SALVAR'} icone="check" onPress={aoSalvar} />
      </SafeAreaView>
      <DialogoConfirmacao
        visivel={dialogo.visivel}
        titulo="Sair sem salvar?"
        mensagem="O que você preencheu será perdido."
        rotuloCancelar="Voltar"
        descricaoCancelar="Continuar editando o lembrete"
        rotuloConfirmar="Sair"
        varianteConfirmar="perigo"
        onCancelar={dialogo.onCancelar}
        onConfirmar={dialogo.onConfirmar}
      />
      <DialogoLimite visivel={noLimite} onFechar={() => setNoLimite(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
  },
  acoes: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});
