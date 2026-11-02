package com.borabill.lembriwearable.presentation.comum

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.wear.compose.material3.Button
import androidx.wear.compose.material3.ButtonDefaults
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.Text
import com.borabill.lembriwearable.presentation.theme.CoresLembri
import com.borabill.lembriwearable.presentation.theme.Dimensoes

enum class VarianteBotao { Primario, Secundario, Acerto, Erro }

@Composable
fun BotaoLargo(
    texto: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variante: VarianteBotao = VarianteBotao.Primario,
    descricao: String = texto,
) {
    val cor = when (variante) {
        VarianteBotao.Primario -> CoresLembri.amarelo
        VarianteBotao.Secundario -> CoresLembri.superficieAlta
        VarianteBotao.Acerto -> CoresLembri.verde
        VarianteBotao.Erro -> CoresLembri.vermelho
    }
    val corTexto = if (variante == VarianteBotao.Secundario) CoresLembri.branco else CoresLembri.preto
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = Dimensoes.alvoToque)
            .semantics { contentDescription = descricao },
        colors = ButtonDefaults.buttonColors(containerColor = cor, contentColor = corTexto),
    ) {
        Text(
            text = texto,
            style = MaterialTheme.typography.labelLarge,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}
