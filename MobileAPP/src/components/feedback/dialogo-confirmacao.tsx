import { CaixaDialogo, type CaixaDialogoProps } from '@/components/feedback/caixa-dialogo';
import { ThemedText } from '@/components/themed-text';

export type DialogoConfirmacaoProps = Omit<CaixaDialogoProps, 'children'> & {
  mensagem: string;
};

export const DialogoConfirmacao = ({ mensagem, ...props }: DialogoConfirmacaoProps) => (
  <CaixaDialogo {...props}>
    <ThemedText>{mensagem}</ThemedText>
  </CaixaDialogo>
);
