package com.borabill.lembriwearable.presentation.sequencia

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.foundation.lazy.rememberScalingLazyListState
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.TelaRolavel
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao

@Composable
fun PerguntaSequencia(
    state: SequenciaUiState,
    onEscolher: (Int) -> Unit,
    onProxima: () -> Unit,
    onSair: () -> Unit,
) {
    val rodada = state.rodada
    val escolha = state.escolha
    val lista = rememberScalingLazyListState(initialCenterItemIndex = 0)
    LaunchedEffect(escolha) { lista.scrollToItem(0) }

    TelaRolavel(lista) {
        if (escolha == null) {
            item {
                TextoCentral(
                    "Rodada ${state.indice + 1} de $TOTAL_RODADAS",
                    estilo = MaterialTheme.typography.labelSmall,
                )
            }
        }
        item {
            TextoCentral(
                texto = when (escolha) {
                    null -> "Qual vinha depois do ${rodada.referencia}?"
                    rodada.certa -> "Certo!"
                    else -> "Era o ${rodada.certa}"
                },
                estilo = MaterialTheme.typography.titleMedium,
                anunciar = escolha != null,
            )
        }
        val opcoes = rodada.opcoes.filter { escolha == null || it == escolha || it == rodada.certa }
        items(opcoes, key = { it }) { opcao ->
            BotaoResposta(opcao, rodada.certa, escolha, onClick = { onEscolher(opcao) })
        }
        if (escolha != null) {
            item {
                BotaoLargo(
                    texto = if (state.indice + 1 < TOTAL_RODADAS) "Próxima" else "Ver resumo",
                    onClick = onProxima,
                )
            }
            item {
                BotaoLargo(
                    "Sair",
                    onSair,
                    variante = VarianteBotao.Secundario,
                    descricao = "Sair do exercício",
                )
            }
        }
    }
}

@Composable
private fun BotaoResposta(opcao: Int, certa: Int, escolha: Int?, onClick: () -> Unit) {
    val (variante, marca) = when {
        escolha != null && opcao == certa -> VarianteBotao.Acerto to "✓ "
        escolha == opcao -> VarianteBotao.Erro to "✗ "
        else -> VarianteBotao.Secundario to ""
    }
    val descricao = when (variante) {
        VarianteBotao.Acerto -> "$opcao, resposta certa"
        VarianteBotao.Erro -> "$opcao, resposta errada"
        else -> "Responder $opcao"
    }
    BotaoLargo(
        texto = "$marca$opcao",
        onClick = { if (escolha == null) onClick() },
        variante = variante,
        descricao = descricao,
    )
}
