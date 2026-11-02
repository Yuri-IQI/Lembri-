package com.borabill.lembriwearable.presentation.sequencia

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.InstrucaoExercicio
import com.borabill.lembriwearable.presentation.comum.SaidaExercicio
import com.borabill.lembriwearable.presentation.comum.TelaRolavel
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao
import com.borabill.lembriwearable.presentation.comum.vibrarResposta

@Composable
fun SequenciaScreen(
    onSair: () -> Unit,
    onFim: (acertos: Int, total: Int, duracaoSeg: Long) -> Unit,
    viewModel: SequenciaViewModel = viewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val contexto = LocalContext.current

    LaunchedEffect(state.etapa) {
        if (state.etapa == EtapaSequencia.Fim) onFim(state.acertos, TOTAL_RODADAS, state.duracaoSeg)
    }

    SaidaExercicio(onSair) { pedirSaida ->
        when (state.etapa) {
            EtapaSequencia.Instrucao -> InstrucaoExercicio(
                texto = "Memorize os 3 números",
                onComecar = viewModel::comecar,
                onVoltar = onSair,
            )
            EtapaSequencia.Memorizar -> MemorizarNumeros(
                numeros = state.rodada.numeros,
                onMemorizei = viewModel::memorizei,
                onSair = pedirSaida,
            )
            EtapaSequencia.Pergunta -> PerguntaSequencia(
                state = state,
                onEscolher = { opcao ->
                    contexto.vibrarResposta(opcao == state.rodada.certa)
                    viewModel.escolher(opcao)
                },
                onProxima = viewModel::proxima,
                onSair = pedirSaida,
            )
            EtapaSequencia.Fim -> Unit
        }
    }
}

@Composable
private fun MemorizarNumeros(numeros: List<Int>, onMemorizei: () -> Unit, onSair: () -> Unit) {
    TelaRolavel {
        item {
            Column {
                numeros.forEach { numero ->
                    TextoCentral("$numero", estilo = MaterialTheme.typography.displayMedium)
                }
            }
        }
        item { BotaoLargo("Memorizei", onMemorizei, descricao = "Memorizei os números") }
        item {
            BotaoLargo("Sair", onSair, variante = VarianteBotao.Secundario, descricao = "Sair do exercício")
        }
    }
}
