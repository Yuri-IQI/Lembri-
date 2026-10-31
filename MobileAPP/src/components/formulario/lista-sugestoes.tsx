import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { ItemSugestao } from '@/components/formulario/item-sugestao';
import { BorderWidth, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Sugestao } from '@/types/sugestao';

type ListaSugestoesProps = {
  sugestoes: Sugestao[];
  /** Texto digitado que ainda não existe nas sugestões; vira a opção "Adicionar". */
  novo?: string;
  onEscolher: (valor: string) => void;
  onEsquecer: (valor: string) => void;
};

/**
 * Sugestões logo abaixo do campo (sem sobrepor a tela), com "Adicionar" no topo e
 * "Esquecer" com confirmação em cada sugestão.
 */
export const ListaSugestoes = ({
  sugestoes,
  novo,
  onEscolher,
  onEsquecer,
}: ListaSugestoesProps) => {
  const theme = useTheme();
  const [esquecendo, setEsquecendo] = useState<string | null>(null);

  if (!novo && sugestoes.length === 0) return null;

  return (
    <View style={[styles.lista, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {novo ? (
        <ItemSugestao
          texto={`Adicionar "${novo}"`}
          icone="add"
          rotuloAcessivel={`Adicionar ${novo}`}
          onEscolher={() => onEscolher(novo)}
        />
      ) : null}
      {sugestoes.map((sugestao) => (
        <ItemSugestao
          key={sugestao.valor}
          texto={sugestao.valor}
          icone="history"
          rotuloAcessivel={`Usar ${sugestao.valor}`}
          onEscolher={() => onEscolher(sugestao.valor)}
          onEsquecer={() => setEsquecendo(sugestao.valor)}
        />
      ))}
      <DialogoConfirmacao
        visivel={esquecendo !== null}
        titulo="Esquecer sugestão?"
        mensagem={`"${esquecendo ?? ''}" não vai mais aparecer como sugestão. Os lembretes salvos não mudam.`}
        rotuloConfirmar="Esquecer"
        varianteConfirmar="perigo"
        onConfirmar={() => {
          if (esquecendo) onEsquecer(esquecendo);
          setEsquecendo(null);
        }}
        onCancelar={() => setEsquecendo(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lista: {
    overflow: 'hidden',
    borderRadius: Radius.sm,
    borderWidth: BorderWidth.regular,
  },
});
