package com.borabill.lembriwearable.data.model

import java.time.LocalDateTime

data class LembreteAgenda(
    val chave: String,
    val quando: LocalDateTime,
    val titulo: String,
    val detalhe: String? = null,
    val feito: Boolean = false,
)
