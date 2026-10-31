import { CaixaDialogo, type CaixaDialogoProps } from '@/components/caixa-dialogo';
import { ThemedText } from '@/components/themed-text';

export type DialogoConfirmacaoProps = Omit<CaixaDialogoProps, 'children'> & {
  mensagem: string;
};

/**
 * Diálogo modal acessível de confirmação de ações críticas (WCAG 2.2 AAA — Prevenção de Erros 3.3.6).
 *
 * Apresenta o título, mensagem explicativa da consequência e dois botões de tamanho TouchTarget = 56dp:
 * - Cancelar (sempre secundário para manter o estado sem alteração)
 * - Confirmar (primário ou perigo para ações destrutivas como exclusão).
 */
export const DialogoConfirmacao = ({ mensagem, ...props }: DialogoConfirmacaoProps) => (
  <CaixaDialogo {...props}>
    <ThemedText>{mensagem}</ThemedText>
  </CaixaDialogo>
);
