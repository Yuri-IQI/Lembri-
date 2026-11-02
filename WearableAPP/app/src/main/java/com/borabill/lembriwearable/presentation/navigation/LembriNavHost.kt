package com.borabill.lembriwearable.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.currentBackStackEntryAsState
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.borabill.lembriwearable.LembriWearApplication
import com.borabill.lembriwearable.data.comunicacao.ContratoComunicacao
import com.borabill.lembriwearable.presentation.guardar.GuardarScreen
import com.borabill.lembriwearable.presentation.inicio.InicioScreen
import com.borabill.lembriwearable.presentation.inicio.InicioViewModel
import com.borabill.lembriwearable.presentation.resumo.ResumoScreen
import com.borabill.lembriwearable.presentation.sequencia.SequenciaScreen

@Composable
fun LembriNavHost() {
    val nav = rememberSwipeDismissableNavController()
    val atual by nav.currentBackStackEntryAsState()
    val agenda = (LocalContext.current.applicationContext as LembriWearApplication).container.agendaRepository
    val concluir = { origem: String, exercicioId: String, acertos: Int, total: Int, duracao: Long ->
        agenda.registrarExercicio(exercicioId, acertos, total, duracao)
        nav.abrirResumo(origem, acertos, total, duracao)
    }

    SwipeDismissableNavHost(
        navController = nav,
        startDestination = Rotas.INICIO,
        userSwipeEnabled = atual?.destination?.route !in Rotas.EXERCICIOS,
    ) {
        composable(Rotas.INICIO) {
            val viewModel: InicioViewModel = viewModel(factory = InicioViewModel.Factory)
            val state by viewModel.uiState.collectAsStateWithLifecycle()
            InicioScreen(
                state = state,
                onFeito = viewModel::marcarFeito,
                onDesfazer = viewModel::desfazer,
                onSequencia = { nav.navigate(Rotas.SEQUENCIA) },
                onGuardar = { nav.navigate(Rotas.GUARDAR) },
            )
        }
        composable(Rotas.SEQUENCIA) {
            SequenciaScreen(
                onSair = { nav.popBackStack(Rotas.INICIO, inclusive = false) },
                onFim = { acertos, total, duracao ->
                    concluir(Rotas.SEQUENCIA, ContratoComunicacao.EXERCICIO_SEQUENCIA, acertos, total, duracao)
                },
            )
        }
        composable(Rotas.GUARDAR) {
            GuardarScreen(
                onSair = { nav.popBackStack(Rotas.INICIO, inclusive = false) },
                onFim = { acertos, total, duracao ->
                    concluir(Rotas.GUARDAR, ContratoComunicacao.EXERCICIO_GUARDAR, acertos, total, duracao)
                },
            )
        }
        composable(Rotas.RESUMO) { entrada ->
            val argumentos = entrada.arguments
            val origem = argumentos?.getString(Rotas.ARG_ORIGEM) ?: Rotas.SEQUENCIA
            ResumoScreen(
                acertos = argumentos?.getString(Rotas.ARG_ACERTOS)?.toIntOrNull() ?: 0,
                total = argumentos?.getString(Rotas.ARG_TOTAL)?.toIntOrNull() ?: 0,
                duracaoSeg = argumentos?.getString(Rotas.ARG_DURACAO)?.toLongOrNull() ?: 0L,
                onRepetir = {
                    nav.navigate(origem) { popUpTo(Rotas.INICIO) }
                },
                onVoltar = { nav.popBackStack(Rotas.INICIO, inclusive = false) },
            )
        }
    }
}

private fun NavHostController.abrirResumo(origem: String, acertos: Int, total: Int, duracaoSeg: Long) {
    navigate(Rotas.resumo(origem, acertos, total, duracaoSeg)) { popUpTo(Rotas.INICIO) }
}
