package com.borabill.lembriwearable.presentation.theme

import androidx.compose.runtime.Composable
import androidx.wear.compose.material3.MaterialTheme

@Composable
fun LembriWearableTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = EsquemaCoresLembri,
        typography = TipografiaLembri,
        content = content,
    )
}
