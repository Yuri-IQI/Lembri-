package com.borabill.lembriwearable.data.comunicacao

/**
 * Contrato de comunicação entre o relógio e o celular (Wearable Data Layer API).
 *
 * Aviso: este arquivo tem um "espelho" no app mobile:
 *    MobileAPP/src/services/wear/contrato.ts
 * Qualquer mudança aqui (paths ou formato do JSON) precisa ser
 * replicada lá, senão os dois lados deixam de se entender.
 */
object ContratoComunicacao {
    const val PATH_PREFIXO = "/lembri"
    const val PATH_AGENDA = "$PATH_PREFIXO/agenda"
    const val PATH_EVENTOS = "$PATH_PREFIXO/eventos"
    const val VERSAO = 1
    const val EXERCICIO_SEQUENCIA = "exercicio-1"
    const val EXERCICIO_GUARDAR = "exercicio-relogio-guardar"
}
