package com.borabill.lembriwearable.presentation

import com.borabill.lembriwearable.data.model.LembreteAgenda
import com.borabill.lembriwearable.data.repository.EstadoAgenda
import com.borabill.lembriwearable.presentation.inicio.Vazio
import com.borabill.lembriwearable.presentation.inicio.montarInicio
import com.borabill.lembriwearable.presentation.inicio.tempoRelativo
import java.time.LocalDateTime
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MontarInicioTest {
    private val agora = LocalDateTime.of(2026, 11, 2, 9, 0)
    private val atrasado = LembreteAgenda("a", agora.minusMinutes(10), "Atrasado")
    private val depois = LembreteAgenda("b", agora.plusHours(1), "Depois")

    @Test
    fun proximoEOPrimeiroPendenteIncluindoAtrasado() {
        val state = montarInicio(EstadoAgenda(listOf(depois, atrasado), temDados = true), agora)
        assertEquals("a", state.proximo?.chave)
        assertEquals(listOf("b"), state.maisTarde.map { it.chave })
        assertEquals("Atrasado 10 min", state.tempoRelativo)
    }

    @Test
    fun feitoLocalPromoveOSeguinte() {
        val estado = EstadoAgenda(listOf(atrasado, depois), feitos = setOf("a"), temDados = true)
        assertEquals("b", montarInicio(estado, agora).proximo?.chave)
    }

    @Test
    fun pendenteContinuaComoProximoAguardandoDesfazer() {
        val estado = EstadoAgenda(listOf(atrasado, depois), pendente = "a", temDados = true)
        val state = montarInicio(estado, agora)
        assertEquals("a", state.proximo?.chave)
        assertTrue(state.aguardandoDesfazer)
    }

    @Test
    fun estadosVazios() {
        assertEquals(Vazio.SemDados, montarInicio(EstadoAgenda(), agora).vazio)
        assertEquals(Vazio.SemLembretes, montarInicio(EstadoAgenda(temDados = true), agora).vazio)
        val tudoFeito = EstadoAgenda(listOf(atrasado), feitos = setOf("a"), temDados = true)
        assertEquals(Vazio.TudoFeito, montarInicio(tudoFeito, agora).vazio)
    }

    @Test
    fun textosDeTempoRelativo() {
        assertEquals("Agora", tempoRelativo(agora, agora))
        assertEquals("Em 25 min", tempoRelativo(agora.plusMinutes(25), agora))
        assertEquals("Em 1 h", tempoRelativo(agora.plusHours(1), agora))
        assertEquals("Atrasado 1 h 5 min", tempoRelativo(agora.minusMinutes(65), agora))
    }
}
