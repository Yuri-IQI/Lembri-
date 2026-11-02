package com.borabill.lembriwearable.presentation.sequencia

import kotlin.random.Random

private val FAIXA_NUMEROS = 10..99
private const val QUANTIDADE_NUMEROS = 3

data class Rodada(
    val numeros: List<Int>,
    val referencia: Int,
    val certa: Int,
    val opcoes: List<Int>,
)

fun gerarRodada(random: Random = Random.Default): Rodada {
    val numeros = FAIXA_NUMEROS.shuffled(random).take(QUANTIDADE_NUMEROS)
    val indice = random.nextInt(QUANTIDADE_NUMEROS - 1)
    val referencia = numeros[indice]
    val certa = numeros[indice + 1]
    val outro = (numeros - referencia - certa).single()
    val novo = (FAIXA_NUMEROS - numeros.toSet()).random(random)
    return Rodada(numeros, referencia, certa, listOf(certa, outro, novo).shuffled(random))
}
