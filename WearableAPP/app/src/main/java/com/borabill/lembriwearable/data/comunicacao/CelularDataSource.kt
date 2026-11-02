package com.borabill.lembriwearable.data.comunicacao

import android.content.Context
import android.net.Uri
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.PutDataRequest
import com.google.android.gms.wearable.Wearable
import java.util.UUID
import kotlinx.coroutines.tasks.await

private const val ESQUEMA_WEAR = "wear"

class CelularDataSource(context: Context) {
    private val dataClient = Wearable.getDataClient(context)
    private val nodeClient = Wearable.getNodeClient(context)

    // Aviso: capabilities não se propagam entre os AVDs, por isso a conexão usa os nós conectados.
    suspend fun conectado(): Boolean = nodeClient.connectedNodes.await().isNotEmpty()

    suspend fun lerAgenda(): String? {
        val uri = Uri.Builder().scheme(ESQUEMA_WEAR).path(ContratoComunicacao.PATH_AGENDA).build()
        val itens = dataClient.getDataItems(uri, DataClient.FILTER_LITERAL).await()
        return try {
            itens.firstOrNull()?.data?.let { String(it) }
        } finally {
            itens.release()
        }
    }

    // Aviso: sem setUrgent, a entrega pode atrasar até cerca de 30 minutos.
    suspend fun publicarEvento(json: String) {
        val path = "${ContratoComunicacao.PATH_EVENTOS}/${UUID.randomUUID()}"
        val pedido = PutDataRequest.create(path).setData(json.toByteArray()).setUrgent()
        dataClient.putDataItem(pedido).await()
    }
}
