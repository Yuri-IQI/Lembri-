package com.borabill.lembriwearable.data.avisos

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import com.borabill.lembriwearable.data.model.LembreteAgenda
import java.time.LocalDateTime
import java.time.ZoneId

private const val ARQUIVO = "avisos_lembretes"
private const val AGENDADOS = "agendados"
private const val ESQUEMA = "lembri"
private const val ID_NOTIFICACAO = 1

class AvisosLembretes(private val context: Context) {
    private val alarmes = context.getSystemService(AlarmManager::class.java)
    private val notificacoes = context.getSystemService(NotificationManager::class.java)
    private val preferencias = context.getSharedPreferences(ARQUIVO, Context.MODE_PRIVATE)

    init {
        notificacoes.createNotificationChannel(
            NotificationChannel(CANAL_AVISOS, "Lembretes", NotificationManager.IMPORTANCE_HIGH)
                .apply { enableVibration(true) },
        )
    }

    fun reprogramar(lembretes: List<LembreteAgenda>, feitos: Set<String>) {
        val aguardando = lembretes.filterNot { it.feito || it.chave in feitos }
        val chaves = aguardando.map { it.chave }.toSet()
        val agendados = preferencias.getStringSet(AGENDADOS, emptySet()).orEmpty()
        (agendados - chaves).forEach(::cancelar)
        val agora = LocalDateTime.now()
        aguardando.filter { it.quando.isAfter(agora) }.forEach(::agendar)
        preferencias.edit().putStringSet(AGENDADOS, chaves).apply()
    }

    fun cancelar(chave: String) {
        alarmes.cancel(alarme(chave, null))
        notificacoes.cancel(chave, ID_NOTIFICACAO)
    }

    fun mostrar(intent: Intent) {
        val chave = intent.data?.schemeSpecificPart ?: return
        notificacoes.notify(chave, ID_NOTIFICACAO, criarNotificacao(context, intent))
    }

    private fun agendar(lembrete: LembreteAgenda) {
        val instante = lembrete.quando.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        alarmes.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            instante,
            alarme(lembrete.chave, lembrete),
        )
    }

    private fun alarme(chave: String, lembrete: LembreteAgenda?): PendingIntent {
        val intent = Intent(context, AvisoReceiver::class.java)
            .setData(Uri.fromParts(ESQUEMA, chave, null))
        lembrete?.let {
            intent.putExtra(EXTRA_TITULO, it.titulo)
                .putExtra(EXTRA_HORARIO, it.quando.toLocalTime().toString())
                .putExtra(EXTRA_DETALHE, it.detalhe)
        }
        return PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
    }
}
