package com.borabill.lembriwearable.presentation.guardar

import kotlin.random.Random

private const val OBJETOS_POR_LUGAR = 2

enum class Lugar(val nome: String, val comPreposicao: String) {
    Cozinha("Cozinha", "na Cozinha"),
    Quarto("Quarto", "no Quarto"),
}

data class Objeto(val nome: String, val lugar: Lugar)

data class Partida(val memorizar: List<Objeto>, val jogar: List<Objeto>)

private val BANCO = listOf(
    Objeto("Xícara", Lugar.Cozinha),
    Objeto("Panela", Lugar.Cozinha),
    Objeto("Colher", Lugar.Cozinha),
    Objeto("Prato", Lugar.Cozinha),
    Objeto("Óculos", Lugar.Quarto),
    Objeto("Travesseiro", Lugar.Quarto),
    Objeto("Chinelo", Lugar.Quarto),
    Objeto("Relógio", Lugar.Quarto),
)

fun sortearPartida(random: Random = Random.Default): Partida {
    val sorteados = Lugar.entries.flatMap { lugar ->
        BANCO.filter { it.lugar == lugar }.shuffled(random).take(OBJETOS_POR_LUGAR)
    }
    val memorizar = sorteados.shuffled(random)
    var jogar = memorizar.shuffled(random)
    while (jogar == memorizar) jogar = memorizar.shuffled(random)
    return Partida(memorizar, jogar)
}
