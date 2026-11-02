import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { CampoTexto } from '@/components/formulario/texto/campo-texto';
import { ListaChips } from '@/components/formulario/selecao/lista-chips';
import { ListaSugestoes } from '@/components/formulario/texto/lista-sugestoes';
import { Spacing } from '@/constants/theme';
import { useSugestoesDoCampo } from '@/hooks/formulario/use-sugestoes-do-campo';
import type { FonteSugestao } from '@/types/sugestao';
import { normalizarBusca } from '@/utils/texto/texto';

type Base = {
  fonte: FonteSugestao;
  rotulo: string;
  placeholder: string;
  erro?: string;
  obrigatorio?: boolean;
  rotuloOculto?: boolean;
};

export type CampoAutocompletarProps = Base &
  (
    | { modo: 'unico'; valor: string; onAlterar: (valor: string) => void }
    | { modo: 'multiplo'; valores: string[]; onAlterar: (valores: string[]) => void }
  );

export const CampoAutocompletar = (props: CampoAutocompletarProps) => {
  const [aberta, setAberta] = useState(false);
  const [rascunho, setRascunho] = useState('');
  const texto = props.modo === 'unico' ? props.valor : rascunho;
  const escolhidos = props.modo === 'multiplo' ? props.valores : [];
  const { visiveis, novo, esquecer } = useSugestoesDoCampo(props.fonte, texto, escolhidos);

  const digitar = (valor: string) => {
    setAberta(true);
    if (props.modo === 'unico') props.onAlterar(valor);
    else setRascunho(valor);
  };

  const escolher = (valor: string) => {
    if (props.modo === 'unico') {
      props.onAlterar(valor);
      setAberta(false);
      Keyboard.dismiss();
      return;
    }
    if (!props.valores.some((v) => normalizarBusca(v) === normalizarBusca(valor))) {
      props.onAlterar([...props.valores, valor.trim()]);
    }
    setRascunho('');
  };

  return (
    <View style={styles.container}>
      <CampoTexto
        rotulo={props.rotulo}
        valor={texto}
        onAlterar={digitar}
        placeholder={props.placeholder}
        erro={props.erro}
        obrigatorio={props.obrigatorio}
        rotuloOculto={props.rotuloOculto}
        onFocus={() => setAberta(true)}
        onBlur={() => setAberta(false)}
        onSubmitEditing={() => novo && escolher(novo)}
        submitBehavior={props.modo === 'multiplo' ? 'submit' : 'blurAndSubmit'}
        returnKeyType={props.modo === 'multiplo' ? 'next' : 'done'}
      />
      {aberta && (
        <ListaSugestoes
          sugestoes={visiveis}
          novo={novo}
          onEscolher={escolher}
          onEsquecer={esquecer}
        />
      )}
      {props.modo === 'multiplo' && (
        <ListaChips
          itens={props.valores}
          onRemover={(item) => props.onAlterar(props.valores.filter((v) => v !== item))}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
