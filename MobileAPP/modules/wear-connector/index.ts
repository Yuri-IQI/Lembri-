/**
 * API JavaScript do módulo nativo `WearConnector`.
 *
 * Use pelo serviço em `src/services/wear/` e não diretamente nas telas:
 * o serviço aplica o contrato do Lembri (paths + JSON) por cima deste transporte.
 */
import { NativeModule, requireOptionalNativeModule } from 'expo';

export type RelogioConectado = {
  id: string;
  nome: string;
  /** `true` quando conectado diretamente por Bluetooth (não via nuvem). */
  proximo: boolean;
};

export type MensagemRecebida = {
  path: string;
  payload: string;
  origemId: string;
};

type WearConnectorEvents = {
  onMensagemRecebida(event: MensagemRecebida): void;
};

declare class WearConnectorModule extends NativeModule<WearConnectorEvents> {
  listarRelogios(capability: string): Promise<RelogioConectado[]>;
  enviarMensagem(noId: string, path: string, payload: string): Promise<void>;
}

/**
 * `null` quando o módulo não existe na plataforma atual:
 * iOS, web ou Expo Go (que não inclui código nativo customizado).
 */
export default requireOptionalNativeModule<WearConnectorModule>('WearConnector');
