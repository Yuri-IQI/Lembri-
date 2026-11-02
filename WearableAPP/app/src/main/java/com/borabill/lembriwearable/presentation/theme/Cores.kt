package com.borabill.lembriwearable.presentation.theme

import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material3.ColorScheme

object CoresLembri {
    val preto = Color(0xFF000000)
    val branco = Color(0xFFFFFFFF)
    val amarelo = Color(0xFFEAE28A)
    val verde = Color(0xFFA8D5A2)
    val vermelho = Color(0xFFFF8181)
    val superficie = Color(0xFF1C1C1C)
    val superficieAlta = Color(0xFF2E2E2E)
    val textoSecundario = Color(0xFFCCCCCC)
}

val EsquemaCoresLembri = ColorScheme(
    primary = CoresLembri.amarelo,
    primaryDim = CoresLembri.amarelo,
    primaryContainer = CoresLembri.superficieAlta,
    onPrimary = CoresLembri.preto,
    onPrimaryContainer = CoresLembri.branco,
    secondary = CoresLembri.branco,
    secondaryDim = CoresLembri.textoSecundario,
    secondaryContainer = CoresLembri.superficieAlta,
    onSecondary = CoresLembri.preto,
    onSecondaryContainer = CoresLembri.branco,
    tertiary = CoresLembri.verde,
    tertiaryDim = CoresLembri.verde,
    tertiaryContainer = CoresLembri.superficieAlta,
    onTertiary = CoresLembri.preto,
    onTertiaryContainer = CoresLembri.branco,
    surfaceContainerLow = CoresLembri.superficie,
    surfaceContainer = CoresLembri.superficie,
    surfaceContainerHigh = CoresLembri.superficieAlta,
    onSurface = CoresLembri.branco,
    onSurfaceVariant = CoresLembri.textoSecundario,
    outline = CoresLembri.textoSecundario,
    outlineVariant = CoresLembri.superficieAlta,
    background = CoresLembri.preto,
    onBackground = CoresLembri.branco,
    error = CoresLembri.vermelho,
    errorDim = CoresLembri.vermelho,
    errorContainer = CoresLembri.vermelho,
    onError = CoresLembri.preto,
    onErrorContainer = CoresLembri.preto,
)
