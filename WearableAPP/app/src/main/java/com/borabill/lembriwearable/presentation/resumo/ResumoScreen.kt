package com.borabill.lembriwearable.presentation.resumo

import androidx.compose.runtime.Composable
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.TelaRolavel
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao

private const val SEGUNDOS_POR_MINUTO = 60

@Composable
fun ResumoScreen(
    acertos: Int,
    total: Int,
    duracaoSeg: Long,
    onRepetir: () -> Unit,
    onVoltar: () -> Unit,
) {
    val tempo = if (duracaoSeg < SEGUNDOS_POR_MINUTO) {
        "$duracaoSeg s"
    } else {
        "${duracaoSeg / SEGUNDOS_POR_MINUTO} min"
    }
    TelaRolavel {
        item { TextoCentral("Você acertou") }
        item { TextoCentral("$acertos de $total", estilo = MaterialTheme.typography.displaySmall) }
        item { TextoCentral(tempo, estilo = MaterialTheme.typography.bodySmall) }
        item { BotaoLargo("Repetir", onRepetir, descricao = "Repetir o exercício") }
        item {
            BotaoLargo(
                "Voltar",
                onVoltar,
                variante = VarianteBotao.Secundario,
                descricao = "Voltar ao início",
            )
        }
    }
}
