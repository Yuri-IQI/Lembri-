package com.borabill.lembriwearable.data.model

import com.borabill.lembriwearable.data.comunicacao.ContratoComunicacao
import java.time.Instant
import org.json.JSONObject

object EventoRelogio {
    fun feito(chave: String, feitoEm: Instant): String = base("feito")
        .put("chave", chave)
        .put("feitoEm", feitoEm.toString())
        .toString()

    fun exercicio(
        exercicioId: String,
        iniciadaEm: Instant,
        duracaoSeg: Long,
        acertos: Int,
        total: Int,
    ): String = base("exercicio")
        .put("exercicioId", exercicioId)
        .put("iniciadaEm", iniciadaEm.toString())
        .put("duracaoSeg", duracaoSeg)
        .put("acertos", acertos)
        .put("total", total)
        .toString()

    private fun base(tipo: String) = JSONObject()
        .put("v", ContratoComunicacao.VERSAO)
        .put("tipo", tipo)
}
