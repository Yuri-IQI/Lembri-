package com.borabill.lembriwearable.data.avisos

import android.app.Notification
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.borabill.lembriwearable.R
import com.borabill.lembriwearable.presentation.MainActivity

const val CANAL_AVISOS = "lembretes"
const val EXTRA_TITULO = "titulo"
const val EXTRA_HORARIO = "horario"
const val EXTRA_DETALHE = "detalhe"

fun criarNotificacao(context: Context, intent: Intent): Notification {
    val abrirApp = PendingIntent.getActivity(
        context,
        0,
        Intent(context, MainActivity::class.java),
        PendingIntent.FLAG_IMMUTABLE,
    )
    val texto = listOfNotNull(intent.getStringExtra(EXTRA_HORARIO), intent.getStringExtra(EXTRA_DETALHE))
        .joinToString(" · ")
    return Notification.Builder(context, CANAL_AVISOS)
        .setSmallIcon(R.drawable.ic_aviso)
        .setContentTitle(intent.getStringExtra(EXTRA_TITULO))
        .setContentText(texto)
        .setCategory(Notification.CATEGORY_REMINDER)
        .setContentIntent(abrirApp)
        .setAutoCancel(true)
        .build()
}
