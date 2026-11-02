package com.borabill.lembriwearable.presentation.sequencia

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

const val TOTAL_RODADAS = 5

enum class EtapaSequencia { Instrucao, Memorizar, Pergunta, Fim }

data class SequenciaUiState(
    val etapa: EtapaSequencia = EtapaSequencia.Instrucao,
    val indice: Int = 0,
    val rodada: Rodada = gerarRodada(),
    val escolha: Int? = null,
    val acertos: Int = 0,
    val inicioMs: Long = 0L,
    val duracaoSeg: Long = 0L,
)

class SequenciaViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(SequenciaUiState())
    val uiState: StateFlow<SequenciaUiState> = _uiState.asStateFlow()

    fun comecar() = _uiState.update {
        it.copy(etapa = EtapaSequencia.Memorizar, inicioMs = System.currentTimeMillis())
    }

    fun memorizei() = _uiState.update { it.copy(etapa = EtapaSequencia.Pergunta) }

    fun escolher(opcao: Int) = _uiState.update {
        if (it.escolha != null) return@update it
        it.copy(escolha = opcao, acertos = it.acertos + if (opcao == it.rodada.certa) 1 else 0)
    }

    fun proxima() = _uiState.update {
        if (it.indice + 1 < TOTAL_RODADAS) {
            it.copy(
                etapa = EtapaSequencia.Memorizar,
                indice = it.indice + 1,
                rodada = gerarRodada(),
                escolha = null,
            )
        } else {
            it.copy(
                etapa = EtapaSequencia.Fim,
                duracaoSeg = (System.currentTimeMillis() - it.inicioMs) / 1000,
            )
        }
    }
}
