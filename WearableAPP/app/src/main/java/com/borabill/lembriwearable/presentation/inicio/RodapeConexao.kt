package com.borabill.lembriwearable.presentation.inicio

import androidx.compose.runtime.Composable
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.TextoCentral

@Composable
fun RodapeConexao(state: InicioUiState) {
    val atualizado = state.atualizadoEm?.let { "Atualizado às $it" }
    val texto = when {
        state.exemplo -> "Exemplo"
        state.conectado -> atualizado.orEmpty()
        else -> listOfNotNull("Sem conexão com o celular", atualizado).joinToString("\n")
    }
    if (texto.isNotEmpty()) {
        TextoCentral(
            texto = texto,
            estilo = MaterialTheme.typography.bodySmall,
            cor = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
