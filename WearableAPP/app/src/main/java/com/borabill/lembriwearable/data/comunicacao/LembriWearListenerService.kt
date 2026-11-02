package com.borabill.lembriwearable.data.comunicacao

import com.borabill.lembriwearable.LembriWearApplication
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.WearableListenerService

class LembriWearListenerService : WearableListenerService() {
    private val repositorio by lazy {
        (application as LembriWearApplication).container.agendaRepository
    }

    override fun onDataChanged(eventos: DataEventBuffer) {
        eventos
            .filter { it.type == DataEvent.TYPE_CHANGED }
            .filter { it.dataItem.uri.path == ContratoComunicacao.PATH_AGENDA }
            .forEach { evento -> evento.dataItem.data?.let { repositorio.receberAgenda(String(it)) } }
    }
}
