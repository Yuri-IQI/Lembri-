package expo.modules.wearconnector

import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.WearableListenerService

private const val TAREFA_EVENTOS = "lembri-eventos-relogio"
private const val TEMPO_LIMITE_MS = 30_000L
private const val TAG = "EventosRelogio"

class EventosRelogioService : WearableListenerService() {
  override fun onDataChanged(eventos: DataEventBuffer) {
    if (eventos.none { it.type == DataEvent.TYPE_CHANGED }) return
    // Aviso: se o serviço não puder iniciar, os eventos continuam guardados e são lidos ao abrir o app.
    runCatching {
      HeadlessJsTaskService.acquireWakeLockNow(this)
      startService(Intent(this, EventosRelogioTaskService::class.java))
    }.onFailure { Log.w(TAG, "Não foi possível iniciar a tarefa de eventos", it) }
  }
}

class EventosRelogioTaskService : HeadlessJsTaskService() {
  override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig =
    HeadlessJsTaskConfig(TAREFA_EVENTOS, Arguments.createMap(), TEMPO_LIMITE_MS, true)
}
