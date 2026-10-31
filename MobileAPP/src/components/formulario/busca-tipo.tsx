import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { CampoTexto } from '@/components/formulario/campo-texto';
import { ItemSugestao } from '@/components/formulario/item-sugestao';
import type { OpcaoTipo } from '@/components/formulario/seletor-tipo';
import { BorderWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { normalizarBusca } from '@/utils/texto';

type BuscaTipoProps = {
  /** Tipos que ainda podem ser escolhidos. */
  opcoes: OpcaoTipo[];
  onEscolher: (chave: string) => void;
  /** Abre o cadastro, já com o texto digitado como nome. */
  onCriar: (nome: string) => void;
};

/**
 * Busca de tipos com sugestões abaixo do campo e, ao lado, o botão de criar um tipo novo.
 * A tela que o usa precisa de `keyboardShouldPersistTaps="handled"` no ScrollView.
 */
export const BuscaTipo = ({ opcoes, onEscolher, onCriar }: BuscaTipoProps) => {
  const theme = useTheme();
  const [texto, setTexto] = useState('');
  const [aberta, setAberta] = useState(false);
  const busca = normalizarBusca(texto);
  const encontrados = opcoes.filter((opcao) => normalizarBusca(opcao.nome).includes(busca));
  const semIgual = texto.trim() !== '' && !opcoes.some((o) => normalizarBusca(o.nome) === busca);

  const escolher = (chave: string) => {
    onEscolher(chave);
    setTexto('');
  };

  const criar = () => {
    onCriar(texto.trim());
    setTexto('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <View style={styles.campo}>
          <CampoTexto
            rotulo="Buscar tipo"
            rotuloOculto
            valor={texto}
            onAlterar={(valor) => {
              setTexto(valor);
              setAberta(true);
            }}
            placeholder="Buscar tipo"
            onFocus={() => setAberta(true)}
            onBlur={() => setAberta(false)}
          />
        </View>
        <Botao
          rotulo="Criar"
          icone="add"
          variante="secundario"
          accessibilityLabel="Criar novo tipo"
          onPress={criar}
        />
      </View>
      {aberta && (encontrados.length > 0 || semIgual) && (
        <View style={[styles.lista, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {semIgual && (
            <ItemSugestao
              texto={`Criar "${texto.trim()}"`}
              icone="add"
              rotuloAcessivel={`Criar o tipo ${texto.trim()}`}
              onEscolher={criar}
            />
          )}
          {encontrados.map((opcao) => (
            <ItemSugestao
              key={opcao.chave}
              texto={opcao.nome}
              icone="sell"
              rotuloAcessivel={`Usar o tipo ${opcao.nome}`}
              onEscolher={() => escolher(opcao.chave)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  campo: {
    flex: 1,
  },
  lista: {
    overflow: 'hidden',
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.regular,
  },
});
