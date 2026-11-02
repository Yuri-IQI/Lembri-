package com.borabill.lembriwearable.presentation.comum

import androidx.activity.compose.BackHandler
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.wear.compose.material3.MaterialTheme

@Composable
fun SaidaExercicio(
    onSair: () -> Unit,
    conteudo: @Composable (pedirSaida: () -> Unit) -> Unit,
) {
    var confirmando by remember { mutableStateOf(false) }
    BackHandler { confirmando = !confirmando }

    if (confirmando) {
        ConfirmarSaida(onContinuar = { confirmando = false }, onSair = onSair)
    } else {
        conteudo { confirmando = true }
    }
}

@Composable
private fun ConfirmarSaida(onContinuar: () -> Unit, onSair: () -> Unit) {
    TelaRolavel {
        item { TextoCentral("Sair do exercício?", estilo = MaterialTheme.typography.titleMedium) }
        item { BotaoLargo("Continuar", onContinuar, descricao = "Continuar o exercício") }
        item {
            BotaoLargo(
                texto = "Sair",
                onClick = onSair,
                variante = VarianteBotao.Secundario,
                descricao = "Sair do exercício e perder o progresso",
            )
        }
    }
}
