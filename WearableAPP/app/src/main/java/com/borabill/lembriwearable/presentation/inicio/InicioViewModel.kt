package com.borabill.lembriwearable.presentation.inicio

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.borabill.lembriwearable.LembriWearApplication
import com.borabill.lembriwearable.data.repository.AgendaRepository
import java.time.LocalDateTime
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.stateIn

private const val MS_POR_MINUTO = 60_000L
private const val MANTER_ASSINATURA_MS = 5_000L

class InicioViewModel(private val repositorio: AgendaRepository) : ViewModel() {

    private val relogio = flow {
        while (true) {
            repositorio.atualizarConexao()
            emit(LocalDateTime.now())
            delay(MS_POR_MINUTO - System.currentTimeMillis() % MS_POR_MINUTO)
        }
    }

    val uiState: StateFlow<InicioUiState> = combine(repositorio.estado, relogio, ::montarInicio)
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(MANTER_ASSINATURA_MS),
            montarInicio(repositorio.estado.value, LocalDateTime.now()),
        )

    fun marcarFeito(chave: String) = repositorio.marcarFeito(chave)

    fun desfazer() = repositorio.desfazer()

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app = this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY]
                    as LembriWearApplication
                InicioViewModel(app.container.agendaRepository)
            }
        }
    }
}
