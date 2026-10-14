package expo.modules.wearconnector

import android.content.Context
import com.google.android.gms.wearable.CapabilityClient
import com.google.android.gms.wearable.MessageClient
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.NodeClient
import com.google.android.gms.wearable.Wearable
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.tasks.await

/**
 * Ponte entre o JavaScript e a Wearable Data Layer API do Android.
 *
 * Este módulo é propositalmente "genérico": só sabe enviar/receber
 * (path + payload em texto). As regras do Lembri (quais paths existem,
 * formato do JSON) ficam no TypeScript, em src/services/wear/.
 * Assim, adicionar uma nova mensagem não exige mexer em código nativo.
 */
class WearConnectorModule : Module() {

  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private val messageClient: MessageClient by lazy { Wearable.getMessageClient(context) }
  private val capabilityClient: CapabilityClient by lazy { Wearable.getCapabilityClient(context) }
  private val nodeClient: NodeClient by lazy { Wearable.getNodeClient(context) }

  /** Repassa cada mensagem recebida do relógio para o JS como evento. */
  private val listener = MessageClient.OnMessageReceivedListener { event: MessageEvent ->
    sendEvent(
      EVENTO_MENSAGEM,
      mapOf(
        "path" to event.path,
        "payload" to String(event.data),
        "origemId" to event.sourceNodeId,
      )
    )
  }

  override fun definition() = ModuleDefinition {
    // Nome usado no JS: requireOptionalNativeModule('WearConnector')
    Name("WearConnector")

    Events(EVENTO_MENSAGEM)

    // Só escuta o relógio enquanto houver algum listener no JS (economiza bateria).
    // Obs.: com o app fechado nada é recebido aqui; para isso seria preciso um
    // WearableListenerService nativo (ver README).
    OnStartObserving { messageClient.addListener(listener) }
    OnStopObserving { messageClient.removeListener(listener) }

    /**
     * Lista os relógios pareados e alcançáveis.
     * 1. Preferência: nós que anunciam a `capability` (app Lembri instalado lá).
     * 2. Fallback: qualquer nó conectado. A propagação de capabilities às vezes
     *    falha/atrasa (comum em emuladores); mensagens para um nó sem o app são
     *    apenas descartadas, então o fallback é seguro.
     * Retorna: [{ id, nome, proximo }]
     */
    AsyncFunction("listarRelogios") Coroutine { capability: String ->
      capabilityClient
        .getCapability(capability, CapabilityClient.FILTER_REACHABLE)
        .await()
        .nodes
        .ifEmpty { nodeClient.connectedNodes.await().toSet() }
        .map { no -> mapOf("id" to no.id, "nome" to no.displayName, "proximo" to no.isNearby) }
    }

    /**
     * Envia uma mensagem para um nó específico (relógio).
     * Mensagens são "fire and forget": não há fila se o relógio estiver offline.
     */
    AsyncFunction("enviarMensagem") Coroutine { noId: String, path: String, payload: String ->
      messageClient.sendMessage(noId, path, payload.toByteArray()).await()
      Unit
    }
  }

  private companion object {
    const val EVENTO_MENSAGEM = "onMensagemRecebida"
  }
}
