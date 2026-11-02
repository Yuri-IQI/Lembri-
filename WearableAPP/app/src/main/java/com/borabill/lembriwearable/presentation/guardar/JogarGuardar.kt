package com.borabill.lembriwearable.presentation.guardar

import androidx.compose.animation.core.Animatable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.ScreenScaffold
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao
import com.borabill.lembriwearable.presentation.theme.Dimensoes
import kotlin.math.abs
import kotlinx.coroutines.launch

private const val LARGURA_ROTULO = 0.68f

@Composable
fun JogarGuardar(objeto: Objeto, onGuardar: (Lugar) -> Unit) {
    val escopo = rememberCoroutineScope()
    val densidade = LocalDensity.current
    val limiar = with(densidade) { Dimensoes.limiarArraste.toPx() }
    val saida = with(densidade) { Dimensoes.distanciaSaidaArraste.toPx() }
    val deslocamento = remember(objeto) { Animatable(0f) }

    fun soltar(lugar: Lugar, sentido: Float) {
        escopo.launch {
            deslocamento.animateTo(sentido * saida)
            onGuardar(lugar)
        }
    }

    val arraste = rememberDraggableState { delta ->
        escopo.launch { deslocamento.snapTo(deslocamento.value + delta) }
    }

    ScreenScaffold(timeText = {}) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .draggable(
                    state = arraste,
                    orientation = Orientation.Vertical,
                    onDragStopped = {
                        val posicao = deslocamento.value
                        when {
                            abs(posicao) < limiar -> escopo.launch { deslocamento.animateTo(0f) }
                            posicao < 0 -> soltar(Lugar.Cozinha, -1f)
                            else -> soltar(Lugar.Quarto, 1f)
                        }
                    },
                ),
        ) {
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .graphicsLayer { translationY = deslocamento.value },
            ) {
                TextoCentral(objeto.nome, estilo = MaterialTheme.typography.titleMedium)
            }
            BotaoLargo(
                texto = "↑ ${Lugar.Cozinha.nome}",
                onClick = { soltar(Lugar.Cozinha, -1f) },
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .fillMaxWidth(LARGURA_ROTULO)
                    .padding(top = Dimensoes.espacoItens),
                variante = VarianteBotao.Secundario,
                descricao = "Guardar ${objeto.nome} ${Lugar.Cozinha.comPreposicao}",
            )
            BotaoLargo(
                texto = "↓ ${Lugar.Quarto.nome}",
                onClick = { soltar(Lugar.Quarto, 1f) },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth(LARGURA_ROTULO)
                    .padding(bottom = Dimensoes.espacoItens),
                variante = VarianteBotao.Secundario,
                descricao = "Guardar ${objeto.nome} ${Lugar.Quarto.comPreposicao}",
            )
        }
    }
}
