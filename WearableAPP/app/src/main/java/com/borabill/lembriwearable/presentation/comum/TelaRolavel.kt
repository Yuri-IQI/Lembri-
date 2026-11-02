package com.borabill.lembriwearable.presentation.comum

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.wear.compose.foundation.lazy.ScalingLazyColumn
import androidx.wear.compose.foundation.lazy.ScalingLazyColumnDefaults
import androidx.wear.compose.foundation.lazy.ScalingLazyListScope
import androidx.wear.compose.foundation.lazy.ScalingLazyListState
import androidx.wear.compose.foundation.lazy.rememberScalingLazyListState
import androidx.wear.compose.material3.ScreenScaffold
import com.borabill.lembriwearable.presentation.theme.Dimensoes

// Sem redução nas bordas: o texto precisa continuar legível para pessoas idosas.
private const val SEM_REDUCAO = 1f

@Composable
fun TelaRolavel(
    estado: ScalingLazyListState = rememberScalingLazyListState(initialCenterItemIndex = 0),
    conteudo: ScalingLazyListScope.() -> Unit,
) {
    ScreenScaffold(scrollState = estado) {
        ScalingLazyColumn(
            modifier = Modifier.fillMaxSize(),
            state = estado,
            contentPadding = PaddingValues(
                top = Dimensoes.margemTopoTela,
                bottom = Dimensoes.margemBaseTela,
            ),
            autoCentering = null,
            verticalArrangement = Arrangement.spacedBy(Dimensoes.espacoItens),
            scalingParams = ScalingLazyColumnDefaults.scalingParams(
                edgeScale = SEM_REDUCAO,
                edgeAlpha = SEM_REDUCAO,
            ),
            content = conteudo,
        )
    }
}
