package com.borabill.lembriwearable.data.avisos

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.borabill.lembriwearable.LembriWearApplication

class AvisoReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        (context.applicationContext as LembriWearApplication).container.avisos.mostrar(intent)
    }
}

// Aviso: basta o processo iniciar. O AgendaRepository lê a agenda salva e refaz os alarmes.
class RestaurarAvisosReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) = Unit
}
