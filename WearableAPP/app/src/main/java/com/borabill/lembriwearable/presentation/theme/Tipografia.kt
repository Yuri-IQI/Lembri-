package com.borabill.lembriwearable.presentation.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material3.Typography

private const val ENTRELINHA_TEXTO = 1.5f
private const val ENTRELINHA_DESTAQUE = 1.2f

private fun estilo(
    tamanho: Int,
    peso: FontWeight = FontWeight.Normal,
    entrelinha: Float = ENTRELINHA_TEXTO,
) = TextStyle(
    fontSize = tamanho.sp,
    lineHeight = (tamanho * entrelinha).sp,
    fontWeight = peso,
)

private fun destaque(tamanho: Int, peso: FontWeight = FontWeight.Bold) =
    estilo(tamanho, peso, ENTRELINHA_DESTAQUE)

val TipografiaLembri = Typography(
    displayLarge = destaque(40),
    displayMedium = destaque(32),
    displaySmall = destaque(28),
    titleLarge = destaque(22),
    titleMedium = destaque(18),
    titleSmall = destaque(16),
    labelLarge = destaque(18, FontWeight.SemiBold),
    labelMedium = destaque(16, FontWeight.SemiBold),
    labelSmall = destaque(14, FontWeight.SemiBold),
    bodyLarge = estilo(18),
    bodyMedium = estilo(16),
    bodySmall = estilo(14),
    bodyExtraSmall = estilo(14),
)
