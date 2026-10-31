import { DialogoConfirmacao } from '@/components/dialogo-confirmacao';
import { useSettingsStore } from '@/stores/useSettingsStore';

type DialogoLimiteProps = {
  visivel: boolean;
  onFechar: () => void;
};

/**
 * Aviso de que o limite de lembretes foi atingido.
 */
export const DialogoLimite = ({ visivel, onFechar }: DialogoLimiteProps) => {
  const limite = useSettingsStore((state) => state.reminderLimit);

  return (
    <DialogoConfirmacao
      visivel={visivel}
      titulo="Limite de lembretes"
      mensagem={`Você já tem ${limite} lembretes, o máximo permitido. Exclua algum que não usa mais para criar outro.`}
      rotuloConfirmar="Entendi"
      somenteConfirmar
      onConfirmar={onFechar}
      onCancelar={onFechar}
    />
  );
};
