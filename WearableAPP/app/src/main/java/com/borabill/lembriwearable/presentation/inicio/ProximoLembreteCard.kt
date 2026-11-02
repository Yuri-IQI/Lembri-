package com.borabill.lembriwearable.presentation.inicio

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.wear.compose.material3.MaterialTheme
import com.borabill.lembriwearable.data.model.LembreteAgenda
import com.borabill.lembriwearable.presentation.comum.BotaoLargo
import com.borabill.lembriwearable.presentation.comum.TextoCentral
import com.borabill.lembriwearable.presentation.comum.VarianteBotao
import com.borabill.lembriwearable.presentation.comum.vibrarUmaVez
import com.borabill.lembriwearable.presentation.theme.Dimensoes

@Composable
fun ProximoLembreteCard(
    lembrete: LembreteAgenda,
    tempoRelativo: String,
    aguardandoDesfazer: Boolean,
    onFeito: () -> Unit,
    onDesfazer: () -> Unit,
) {
    val contexto = LocalContext.current
    val cores = MaterialTheme.colorScheme
    val forma = RoundedCornerShape(Dimensoes.raioCard)
    val horario = lembrete.quando.toLocalTime().toString()
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(cores.surfaceContainer, forma)
            .border(Dimensoes.bordaDestaque, cores.primary, forma)
            .padding(Dimensoes.espacoInterno),
        verticalArrangement = Arrangement.spacedBy(Dimensoes.espacoCard),
    ) {
        TextoCentral(horario, estilo = MaterialTheme.typography.displaySmall)
        TextoCentral(tempoRelativo, estilo = MaterialTheme.typography.labelMedium, cor = cores.primary)
        TextoCentral(lembrete.titulo, estilo = MaterialTheme.typography.titleMedium)
        if (aguardandoDesfazer) {
            TextoCentral("Feito ✓", estilo = MaterialTheme.typography.bodySmall, anunciar = true)
            BotaoLargo(
                texto = "Desfazer",
                onClick = onDesfazer,
                variante = VarianteBotao.Secundario,
                descricao = "Desfazer: ${lembrete.titulo}, $horario",
            )
        } else {
            lembrete.detalhe?.let {
                TextoCentral(it, estilo = MaterialTheme.typography.bodySmall, cor = cores.onSurfaceVariant)
            }
            BotaoLargo(
                texto = "Feito",
                onClick = {
                    contexto.vibrarUmaVez()
                    onFeito()
                },
                descricao = "Marcar como feito: ${lembrete.titulo}, $horario",
            )
        }
    }
}
