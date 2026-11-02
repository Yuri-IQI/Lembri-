package com.borabill.lembriwearable.presentation.comum

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.Text
import com.borabill.lembriwearable.presentation.theme.Dimensoes

@Composable
fun TextoCentral(
    texto: String,
    modifier: Modifier = Modifier,
    estilo: TextStyle = MaterialTheme.typography.bodyLarge,
    cor: Color = MaterialTheme.colorScheme.onSurface,
    anunciar: Boolean = false,
) {
    Text(
        text = texto,
        style = estilo,
        color = cor,
        textAlign = TextAlign.Center,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = Dimensoes.margemTexto)
            .semantics { if (anunciar) liveRegion = LiveRegionMode.Polite },
    )
}
