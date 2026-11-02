import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/botao';
import { CaixaDialogo } from '@/components/caixa-dialogo';
import { ThemedText } from '@/components/themed-text';
import { FalaAoVivo } from '@/components/voz/fala-ao-vivo';
import { Spacing } from '@/constants/theme';
import type { EstadoEscuta } from '@/hooks/use-escuta-voz';
import { useSessaoVoz } from '@/hooks/use-sessao-voz';
import { useVozStore } from '@/stores/useVozStore';

const FALHAS: Partial<Record<EstadoEscuta, { titulo: string; mensagem: string }>> = {
  'sem-fala': {
    titulo: 'Não ouvi nada',
    mensagem: 'Toque em "Ouvir de novo" e fale perto do celular.',
  },
  'sem-permissao': {
    titulo: 'Microfone sem permissão',
    mensagem: 'Permita o uso do microfone nas configurações do celular para usar comandos de voz.',
  },
  indisponivel: {
    titulo: 'Voz indisponível',
    mensagem: 'Este celular não tem reconhecimento de fala em português disponível.',
  },
  'sem-internet': {
    titulo: 'Sem conexão',
    mensagem: 'O reconhecimento de fala precisa de internet. Confira a conexão e tente de novo.',
  },
  erro: {
    titulo: 'Não consegui ouvir',
    mensagem: 'Algo deu errado com o microfone. Tente de novo.',
  },
};

const Sugestoes = ({ rotulos }: { rotulos: string[] }) => (
  <ThemedText themeColor="textSecondary">Você pode dizer: {rotulos.join(', ')}.</ThemedText>
);

const ConteudoVoz = () => {
  const {
    estado,
    parcial,
    volume,
    opcoes,
    naoEntendido,
    disponiveis,
    executar,
    tentarDeNovo,
    fechar,
  } = useSessaoVoz();
  const falha = FALHAS[estado];
  const rotulos = disponiveis.map((comando) => comando.rotulo);

  if (opcoes.length > 0) {
    return (
      <CaixaDialogo
        visivel
        titulo="Qual deles?"
        rotuloConfirmar="Ouvir de novo"
        onConfirmar={tentarDeNovo}
        onCancelar={fechar}>
        <ThemedText>Entendi &quot;{parcial}&quot;.</ThemedText>
        <View style={styles.opcoes}>
          {opcoes.map((opcao) => (
            <Botao
              key={opcao.id}
              rotulo={opcao.rotulo}
              variante="secundario"
              onPress={() => executar(opcao)}
            />
          ))}
        </View>
      </CaixaDialogo>
    );
  }

  if (naoEntendido !== null || falha) {
    return (
      <CaixaDialogo
        visivel
        titulo={falha?.titulo ?? 'Não entendi'}
        rotuloConfirmar="Ouvir de novo"
        onConfirmar={tentarDeNovo}
        onCancelar={fechar}>
        <ThemedText>
          {falha?.mensagem ?? `Entendi "${naoEntendido}", mas esse comando não existe aqui.`}
        </ThemedText>
        {!falha && <Sugestoes rotulos={rotulos} />}
      </CaixaDialogo>
    );
  }

  return (
    <CaixaDialogo
      visivel
      titulo="Estou ouvindo..."
      rotuloConfirmar="Cancelar"
      somenteConfirmar
      onConfirmar={fechar}
      onCancelar={fechar}>
      <FalaAoVivo texto={parcial} volume={volume} />
      <Sugestoes rotulos={rotulos} />
    </CaixaDialogo>
  );
};

export const DialogoVoz = () => {
  const aberto = useVozStore((state) => state.aberto);
  return aberto ? <ConteudoVoz /> : null;
};

const styles = StyleSheet.create({
  opcoes: {
    gap: Spacing.two,
  },
});
