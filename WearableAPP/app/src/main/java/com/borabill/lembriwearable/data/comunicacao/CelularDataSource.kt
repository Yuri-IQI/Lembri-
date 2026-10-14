package com.borabill.lembriwearable.data.comunicacao

import android.content.Context
import android.util.Log
import com.google.android.gms.wearable.CapabilityClient
import com.google.android.gms.wearable.Node
import com.google.android.gms.wearable.Wearable
import kotlinx.coroutines.tasks.await

/**
 * Fonte de dados "remota" do relógio: o celular.
 *
 * Encapsula toda a API do Google Play Services (Wearable Data Layer), para que
 * o resto do app (repositório, ViewModel, telas) não dependa dela diretamente.
 * Se um dia a comunicação mudar (ex.: servidor na nuvem), só esta classe muda.
 *
 * Recebimento de mensagens NÃO fica aqui: ele é feito pelo
 * [LembriWearListenerService], que o sistema acorda mesmo com o app fechado.
 */
class CelularDataSource(context: Context) {

    private val messageClient = Wearable.getMessageClient(context)
    private val capabilityClient = Wearable.getCapabilityClient(context)
    private val nodeClient = Wearable.getNodeClient(context)

    /**
     * Procura celulares pareados e alcançáveis.
     *
     * 1. Preferência: nós que anunciam a capability [ContratoComunicacao.CAPABILITY_MOBILE]
     *    (garante que o app Lembri está instalado lá).
     * 2. Fallback: qualquer nó conectado. A propagação de capabilities às vezes
     *    falha/atrasa (comum em emuladores); mensagens enviadas a um nó sem o app
     *    são apenas descartadas, então o fallback é seguro.
     */
    suspend fun buscarCelulares(): Set<Node> = try {
        capabilityClient
            .getCapability(ContratoComunicacao.CAPABILITY_MOBILE, CapabilityClient.FILTER_REACHABLE)
            .await()
            .nodes
            .ifEmpty {
                Log.d(TAG, "Capability não encontrada; usando nós conectados")
                nodeClient.connectedNodes.await().toSet()
            }
    } catch (e: Exception) {
        Log.w(TAG, "Falha ao buscar celulares conectados", e)
        emptySet()
    }

    /**
     * Envia uma mensagem para todos os celulares encontrados.
     * @return `true` se ao menos um celular recebeu a mensagem.
     */
    suspend fun enviar(path: String, payload: String): Boolean {
        val celulares = buscarCelulares()
        if (celulares.isEmpty()) return false

        var enviou = false
        celulares.forEach { no ->
            try {
                messageClient.sendMessage(no.id, path, payload.toByteArray()).await()
                enviou = true
            } catch (e: Exception) {
                Log.w(TAG, "Falha ao enviar $path para ${no.displayName}", e)
            }
        }
        return enviou
    }

    private companion object {
        const val TAG = "CelularDataSource"
    }
}
