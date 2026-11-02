package com.borabill.lembriwearable.data.model

import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import org.json.JSONObject

data class AgendaRelogio(val geradoEm: LocalDateTime, val lembretes: List<LembreteAgenda>) {
    companion object {
        fun fromJson(json: String): AgendaRelogio {
            val raiz = JSONObject(json)
            val itens = raiz.getJSONArray("lembretes")
            return AgendaRelogio(
                geradoEm = LocalDateTime.ofInstant(
                    Instant.parse(raiz.getString("geradoEm")),
                    ZoneId.systemDefault(),
                ),
                lembretes = List(itens.length()) { indice ->
                    val item = itens.getJSONObject(indice)
                    LembreteAgenda(
                        chave = item.getString("chave"),
                        quando = LocalDateTime.parse(item.getString("quando")),
                        titulo = item.getString("titulo"),
                        detalhe = item.optString("detalhe").ifEmpty { null },
                        feito = item.getBoolean("feito"),
                    )
                },
            )
        }
    }
}
