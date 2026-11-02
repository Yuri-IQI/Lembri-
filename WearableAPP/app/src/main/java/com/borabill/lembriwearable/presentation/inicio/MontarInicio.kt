package com.borabill.lembriwearable.presentation.inicio

import com.borabill.lembriwearable.data.model.LembreteAgenda
import com.borabill.lembriwearable.data.repository.EstadoAgenda
import java.time.Duration
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private const val MINUTOS_POR_HORA = 60L
private val FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm")

enum class Vazio { SemDados, SemLembretes, TudoFeito }

data class InicioUiState(
    val proximo: LembreteAgenda? = null,
    val tempoRelativo: String = "",
    val aguardandoDesfazer: Boolean = false,
    val maisTarde: List<LembreteAgenda> = emptyList(),
    val vazio: Vazio? = null,
    val exemplo: Boolean = false,
    val conectado: Boolean = false,
    val atualizadoEm: String? = null,
)

fun montarInicio(estado: EstadoAgenda, agora: LocalDateTime): InicioUiState {
    val deHoje = estado.lembretes.filter { estado.exemplo || it.quando.toLocalDate() == agora.toLocalDate() }
    val pendentes = deHoje
        .filterNot { it.feito || it.chave in estado.feitos }
        .sortedBy { it.quando }
    val proximo = pendentes.firstOrNull()
    return InicioUiState(
        proximo = proximo,
        tempoRelativo = proximo?.let { tempoRelativo(it.quando, agora) }.orEmpty(),
        aguardandoDesfazer = proximo != null && proximo.chave == estado.pendente,
        maisTarde = pendentes.drop(1),
        vazio = when {
            proximo != null -> null
            !estado.temDados -> Vazio.SemDados
            deHoje.isEmpty() -> Vazio.SemLembretes
            else -> Vazio.TudoFeito
        },
        exemplo = estado.exemplo,
        conectado = estado.conectado,
        atualizadoEm = estado.atualizadoEm?.format(FORMATO_HORA),
    )
}

fun tempoRelativo(quando: LocalDateTime, agora: LocalDateTime): String {
    val minutos = Duration.between(agora, quando).toMinutes()
    return when {
        minutos == 0L -> "Agora"
        minutos > 0 -> "Em ${duracao(minutos)}"
        else -> "Atrasado ${duracao(-minutos)}"
    }
}

private fun duracao(minutos: Long): String {
    val horas = minutos / MINUTOS_POR_HORA
    val resto = minutos % MINUTOS_POR_HORA
    return when {
        horas == 0L -> "$resto min"
        resto == 0L -> "$horas h"
        else -> "$horas h $resto min"
    }
}
