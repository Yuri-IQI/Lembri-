import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Botao } from '@/components/botao';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { SeletorCor } from '@/components/formulario/seletor-cor';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { BorderWidth, PaletaTipos, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTiposLembreteStore } from '@/stores/useTiposLembreteStore';
import type { TipoLembrete } from '@/types/tipo-lembrete';
import { normalizarBusca } from '@/utils/texto';

type CriarTipoProps = {
  /** Nomes já usados, inclusive o tipo padrão do template que ainda não foi criado. */
  nomesExistentes: string[];
  onCriado: (tipo: TipoLembrete) => void;
};

/**
 * Card "Criar Tipo" (Figma 152:1608): nome e cor, com aviso de nome vazio ou repetido.
 */
export const CriarTipo = ({ nomesExistentes, onCriado }: CriarTipoProps) => {
  const theme = useTheme();
  const adicionarTipo = useTiposLembreteStore((state) => state.adicionarTipo);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState<string>(PaletaTipos[0].corHex);
  const [erro, setErro] = useState<string>();

  const adicionar = () => {
    const limpo = nome.trim();
    if (!limpo) return setErro('Escreva o nome do tipo.');
    if (nomesExistentes.some((item) => normalizarBusca(item) === normalizarBusca(limpo))) {
      return setErro('Já existe um tipo com esse nome.');
    }
    onCriado(adicionarTipo({ nome: limpo, corHex: cor }));
    setNome('');
  };

  return (
    <Card style={[styles.card, { borderColor: theme.border }]}>
      <ThemedText type="subheading">Criar Tipo</ThemedText>
      <CampoTexto
        rotulo="Nome"
        valor={nome}
        onAlterar={(texto) => {
          setNome(texto);
          setErro(undefined);
        }}
        placeholder="Ex.: Saúde, Casa, Família"
        maxLength={24}
        erro={erro}
      />
      <SeletorCor rotulo="Cor" valor={cor} onAlterar={setCor} />
      <Botao
        rotulo="Adicionar"
        icone="add"
        onPress={adicionar}
        accessibilityLabel="Adicionar novo tipo"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.thin,
  },
});
