package com.borabill.lembriwearable.presentation.guardar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.InstrucaoExercicio
import com.borabill.lembriwearable.presentation.comum.SaidaExercicio
import com.borabill.lembriwearable.presentation.comum.TelaRolavel
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao
import com.borabill.lembriwearable.presentation.comum.vibrarResposta
import com.borabill.lembriwearable.presentation.theme.CoresLembri
import com.borabill.lembriwearable.presentation.theme.Dimensoes

@Composable
fun GuardarScreen(
    onSair: () -> Unit,
    onFim: (acertos: Int, total: Int, duracaoSeg: Long) -> Unit,
    viewModel: GuardarViewModel = viewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val contexto = LocalContext.current

    LaunchedEffect(state.etapa) {
        when (state.etapa) {
            EtapaGuardar.Feedback -> contexto.vibrarResposta(state.acertou)
            EtapaGuardar.Fim -> onFim(state.acertos, state.total, state.duracaoSeg)
            else -> Unit
        }
    }

    SaidaExercicio(onSair) { pedirSaida ->
        when (state.etapa) {
            EtapaGuardar.Instrucao -> InstrucaoExercicio(
                texto = "Guarde cada objeto no lugar certo",
                onComecar = viewModel::comecar,
                onVoltar = onSair,
            )
            EtapaGuardar.Memorizar -> MemorizarObjetos(
                objetos = state.partida.memorizar,
                onMemorizei = viewModel::memorizei,
                onSair = pedirSaida,
            )
            EtapaGuardar.Jogar -> JogarGuardar(state.objeto, viewModel::guardar)
            EtapaGuardar.Feedback -> FeedbackGuardar(
                objeto = state.objeto,
                acertou = state.acertou,
                onProximo = viewModel::proximo,
                onSair = pedirSaida,
            )
            EtapaGuardar.Fim -> Unit
        }
    }
}

@Composable
private fun MemorizarObjetos(objetos: List<Objeto>, onMemorizei: () -> Unit, onSair: () -> Unit) {
    TelaRolavel {
        items(objetos, key = { it.nome }) { objeto ->
            TextoCentral(
                "${objeto.nome} → ${objeto.lugar.nome}",
                estilo = MaterialTheme.typography.bodyMedium,
            )
        }
        item { BotaoLargo("Memorizei", onMemorizei, descricao = "Memorizei os lugares") }
        item {
            BotaoLargo("Sair", onSair, variante = VarianteBotao.Secundario, descricao = "Sair do exercício")
        }
    }
}

@Composable
private fun FeedbackGuardar(objeto: Objeto, acertou: Boolean, onProximo: () -> Unit, onSair: () -> Unit) {
    val cor = if (acertou) CoresLembri.verde else CoresLembri.vermelho
    val forma = RoundedCornerShape(Dimensoes.raioCard)
    TelaRolavel {
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surfaceContainer, forma)
                    .border(Dimensoes.bordaDestaque, cor, forma)
                    .padding(Dimensoes.espacoInterno),
            ) {
                TextoCentral(objeto.nome, estilo = MaterialTheme.typography.titleSmall)
                TextoCentral(
                    texto = if (acertou) "✓ Certo!" else "✗ Era ${objeto.lugar.comPreposicao}",
                    estilo = MaterialTheme.typography.titleMedium,
                    cor = cor,
                    anunciar = true,
                )
            }
        }
        item { BotaoLargo("Próximo", onProximo, descricao = "Próximo objeto") }
        item {
            BotaoLargo("Sair", onSair, variante = VarianteBotao.Secundario, descricao = "Sair do exercício")
        }
    }
}
