package com.borabill.lembriwearable.presentation.guardar

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

enum class EtapaGuardar { Instrucao, Memorizar, Jogar, Feedback, Fim }

data class GuardarUiState(
    val etapa: EtapaGuardar = EtapaGuardar.Instrucao,
    val partida: Partida = sortearPartida(),
    val indice: Int = 0,
    val acertou: Boolean = false,
    val acertos: Int = 0,
    val inicioMs: Long = 0L,
    val duracaoSeg: Long = 0L,
) {
    val objeto: Objeto get() = partida.jogar[indice]
    val total: Int get() = partida.jogar.size
}

class GuardarViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(GuardarUiState())
    val uiState: StateFlow<GuardarUiState> = _uiState.asStateFlow()

    fun comecar() = _uiState.update {
        it.copy(etapa = EtapaGuardar.Memorizar, inicioMs = System.currentTimeMillis())
    }

    fun memorizei() = _uiState.update { it.copy(etapa = EtapaGuardar.Jogar) }

    fun guardar(lugar: Lugar) = _uiState.update {
        if (it.etapa != EtapaGuardar.Jogar) return@update it
        val acertou = lugar == it.objeto.lugar
        it.copy(
            etapa = EtapaGuardar.Feedback,
            acertou = acertou,
            acertos = it.acertos + if (acertou) 1 else 0,
        )
    }

    fun proximo() = _uiState.update {
        if (it.indice + 1 < it.total) {
            it.copy(etapa = EtapaGuardar.Jogar, indice = it.indice + 1)
        } else {
            it.copy(
                etapa = EtapaGuardar.Fim,
                duracaoSeg = (System.currentTimeMillis() - it.inicioMs) / 1000,
            )
        }
    }
}
