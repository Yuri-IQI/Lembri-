package com.borabill.lembriwearable.presentation.inicio

import androidx.compose.runtime.Composable
import androidx.wear.compose.foundation.lazy.ScalingLazyListScope
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.TelaRolavel
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao

@Composable
fun InicioScreen(
    state: InicioUiState,
    onFeito: (String) -> Unit,
    onDesfazer: () -> Unit,
    onSequencia: () -> Unit,
    onGuardar: () -> Unit,
) {
    TelaRolavel {
        state.proximo?.let { proximo ->
            item {
                ProximoLembreteCard(
                    lembrete = proximo,
                    tempoRelativo = state.tempoRelativo,
                    aguardandoDesfazer = state.aguardandoDesfazer,
                    onFeito = { onFeito(proximo.chave) },
                    onDesfazer = onDesfazer,
                )
            }
        }
        state.vazio?.let { vazio -> estadoVazio(vazio) }
        maisTarde(state)
        item { TextoCentral("Praticar", estilo = MaterialTheme.typography.titleSmall) }
        item {
            BotaoLargo(
                texto = "Sequência",
                onClick = onSequencia,
                variante = VarianteBotao.Secundario,
                descricao = "Praticar o exercício Sequência rápida",
            )
        }
        item {
            BotaoLargo(
                texto = "Guardar no lugar",
                onClick = onGuardar,
                variante = VarianteBotao.Secundario,
                descricao = "Praticar o exercício Guardar no lugar",
            )
        }
        item { RodapeConexao(state) }
    }
}

private fun ScalingLazyListScope.estadoVazio(vazio: Vazio) {
    if (vazio == Vazio.TudoFeito) {
        item { TextoCentral("✓", estilo = MaterialTheme.typography.displayLarge) }
    }
    item {
        TextoCentral(
            texto = when (vazio) {
                Vazio.SemDados -> "Abra o Lembri no celular"
                Vazio.SemLembretes -> "Nenhum lembrete para hoje"
                Vazio.TudoFeito -> "Tudo feito por hoje!"
            },
            estilo = MaterialTheme.typography.titleMedium,
        )
    }
}

private fun ScalingLazyListScope.maisTarde(state: InicioUiState) {
    if (state.maisTarde.isEmpty()) return
    item { TextoCentral("Mais tarde", estilo = MaterialTheme.typography.titleSmall) }
    items(state.maisTarde, key = { it.chave }) { lembrete ->
        TextoCentral(
            texto = "${lembrete.quando.toLocalTime()} ${lembrete.titulo}",
            estilo = MaterialTheme.typography.bodyMedium,
        )
    }
}
