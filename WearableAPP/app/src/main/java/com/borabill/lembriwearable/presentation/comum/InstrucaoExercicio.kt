package com.borabill.lembriwearable.presentation.comum

import androidx.compose.runtime.Composable
import androidx.wear.compose.material3.MaterialTheme

@Composable
fun InstrucaoExercicio(texto: String, onComecar: () -> Unit, onVoltar: () -> Unit) {
    TelaRolavel {
        item { TextoCentral(texto, estilo = MaterialTheme.typography.titleMedium) }
        item { BotaoLargo("Começar", onComecar, descricao = "Começar o exercício") }
        item {
            BotaoLargo("Voltar", onVoltar, variante = VarianteBotao.Secundario, descricao = "Voltar ao início")
        }
    }
}
