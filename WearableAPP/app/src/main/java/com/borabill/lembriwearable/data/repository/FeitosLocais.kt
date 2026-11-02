package com.borabill.lembriwearable.data.repository

import android.content.Context

data class FeitoPendente(val chave: String, val expiraEm: Long)

class FeitosLocais(context: Context) {
    private val preferencias = context.getSharedPreferences(ARQUIVO, Context.MODE_PRIVATE)

    fun feitos(): Set<String> = preferencias.getStringSet(FEITOS, emptySet()).orEmpty().toSet()

    fun pendente(): FeitoPendente? {
        val chave = preferencias.getString(PENDENTE_CHAVE, null) ?: return null
        return FeitoPendente(chave, preferencias.getLong(PENDENTE_EXPIRA, 0L))
    }

    fun salvarPendente(pendente: FeitoPendente) {
        preferencias.edit()
            .putString(PENDENTE_CHAVE, pendente.chave)
            .putLong(PENDENTE_EXPIRA, pendente.expiraEm)
            .apply()
    }

    fun limparPendente() {
        preferencias.edit().remove(PENDENTE_CHAVE).remove(PENDENTE_EXPIRA).apply()
    }

    fun confirmar(chave: String) {
        preferencias.edit()
            .putStringSet(FEITOS, feitos() + chave)
            .remove(PENDENTE_CHAVE)
            .remove(PENDENTE_EXPIRA)
            .apply()
    }

    fun manterApenas(chaves: Set<String>): Set<String> {
        val mantidos = feitos().intersect(chaves)
        preferencias.edit().putStringSet(FEITOS, mantidos).apply()
        return mantidos
    }

    private companion object {
        const val ARQUIVO = "feitos_locais"
        const val FEITOS = "feitos"
        const val PENDENTE_CHAVE = "pendente_chave"
        const val PENDENTE_EXPIRA = "pendente_expira"
    }
}
