package com.borabill.lembriwearable.data.repository

import com.borabill.lembriwearable.data.model.LembreteAgenda
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

private const val MULTIPLO_MINUTOS = 5

// A data na chave faz os exemplos voltarem a ficar pendentes no dia seguinte.
fun gerarLembretesExemplo(agora: LocalDateTime): List<LembreteAgenda> {
    val base = agora
        .truncatedTo(ChronoUnit.MINUTES)
        .minusMinutes((agora.minute % MULTIPLO_MINUTOS).toLong())
    val dia = agora.toLocalDate()
    return listOf(
        LembreteAgenda("exemplo-1@$dia", base.minusMinutes(10), "Tomar remédio", "1 comprimido"),
        LembreteAgenda("exemplo-2@$dia", base.plusHours(1), "Consulta no cardiologista", "Clínica São José"),
        LembreteAgenda("exemplo-3@$dia", base.plusHours(3), "Lavar roupas", "Tarefa doméstica"),
        LembreteAgenda("exemplo-4@$dia", base.plusHours(5), "Regar as plantas", "Tarefa doméstica"),
    )
}
