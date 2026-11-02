package expo.modules.wearconnector

import android.content.Context
import android.net.Uri
import com.google.android.gms.wearable.CapabilityClient
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.NodeClient
import com.google.android.gms.wearable.PutDataRequest
import com.google.android.gms.wearable.Wearable
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.tasks.await

/**
 * Ponte entre o JavaScript e a Wearable Data Layer API do Android.
 *
 * Este módulo é propositalmente "genérico": só sabe gravar, listar e apagar
 * (path + payload em texto). As regras do Lembri (quais paths existem,
 * formato do JSON) ficam no TypeScript, em src/services/wear/.
 */
class WearConnectorModule : Module() {

  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private val capabilityClient: CapabilityClient by lazy { Wearable.getCapabilityClient(context) }
  private val nodeClient: NodeClient by lazy { Wearable.getNodeClient(context) }
  private val dataClient: DataClient by lazy { Wearable.getDataClient(context) }

  override fun definition() = ModuleDefinition {
    // Nome usado no JS: requireOptionalNativeModule('WearConnector')
    Name("WearConnector")

    /**
     * Lista os relógios pareados e alcançáveis.
     * 1. Preferência: nós que anunciam a `capability` (app Lembri instalado lá).
     * 2. Fallback: qualquer nó conectado. A propagação de capabilities às vezes
     *    falha/atrasa (comum em emuladores).
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

    // Aviso: sem setUrgent, a entrega pode atrasar até cerca de 30 minutos.
    AsyncFunction("publicarDado") Coroutine { path: String, payload: String ->
      val pedido = PutDataRequest.create(path).setData(payload.toByteArray()).setUrgent()
      dataClient.putDataItem(pedido).await()
      Unit
    }

    AsyncFunction("listarDados") Coroutine { prefixo: String ->
      val uri = Uri.Builder().scheme(ESQUEMA_WEAR).path(prefixo).build()
      val itens = dataClient.getDataItems(uri, DataClient.FILTER_PREFIX).await()
      try {
        itens.map { item ->
          mapOf("uri" to item.uri.toString(), "payload" to String(item.data ?: ByteArray(0)))
        }
      } finally {
        itens.release()
      }
    }

    AsyncFunction("apagarDado") Coroutine { uri: String ->
      dataClient.deleteDataItems(Uri.parse(uri)).await()
      Unit
    }
  }

  private companion object {
    const val ESQUEMA_WEAR = "wear"
  }
}
