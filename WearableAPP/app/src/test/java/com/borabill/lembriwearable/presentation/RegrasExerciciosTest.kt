package com.borabill.lembriwearable.presentation

import com.borabill.lembriwearable.presentation.guardar.Lugar
import com.borabill.lembriwearable.presentation.guardar.sortearPartida
import com.borabill.lembriwearable.presentation.sequencia.gerarRodada
import kotlin.random.Random
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RegrasExerciciosTest {

    @Test
    fun rodadaSegueAsRegrasDeGeracao() {
        repeat(500) { semente ->
            val rodada = gerarRodada(Random(semente))
            assertEquals(3, rodada.numeros.toSet().size)
            assertTrue(rodada.numeros.all { it in 10..99 })
            val indice = rodada.numeros.indexOf(rodada.referencia)
            assertTrue(indice in 0..1)
            assertEquals(rodada.numeros[indice + 1], rodada.certa)
            assertEquals(3, rodada.opcoes.toSet().size)
            assertTrue(rodada.certa in rodada.opcoes)
            assertTrue(rodada.referencia !in rodada.opcoes)
            assertEquals(1, rodada.opcoes.count { it !in rodada.numeros })
        }
    }

    @Test
    fun partidaTemDoisObjetosPorLugarEmOutraOrdem() {
        repeat(500) { semente ->
            val partida = sortearPartida(Random(semente))
            assertEquals(4, partida.memorizar.toSet().size)
            Lugar.entries.forEach { lugar ->
                assertEquals(2, partida.memorizar.count { it.lugar == lugar })
            }
            assertEquals(partida.memorizar.toSet(), partida.jogar.toSet())
            assertNotEquals(partida.memorizar, partida.jogar)
        }
    }
}
