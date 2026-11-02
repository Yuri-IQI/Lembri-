package com.borabill.lembriwearable.presentation.navigation

object Rotas {
    const val INICIO = "inicio"
    const val SEQUENCIA = "sequencia"
    const val GUARDAR = "guardar"

    const val ARG_ORIGEM = "origem"
    const val ARG_ACERTOS = "acertos"
    const val ARG_TOTAL = "total"
    const val ARG_DURACAO = "duracao"
    const val RESUMO = "resumo/{$ARG_ORIGEM}/{$ARG_ACERTOS}/{$ARG_TOTAL}/{$ARG_DURACAO}"

    val EXERCICIOS = setOf(SEQUENCIA, GUARDAR)

    fun resumo(origem: String, acertos: Int, total: Int, duracaoSeg: Long) =
        "resumo/$origem/$acertos/$total/$duracaoSeg"
}
