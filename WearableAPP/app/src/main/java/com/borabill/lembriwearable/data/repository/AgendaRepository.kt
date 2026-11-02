package com.borabill.lembriwearable.data.repository

import android.util.Log
import com.borabill.lembriwearable.data.avisos.AvisosLembretes
import com.borabill.lembriwearable.data.comunicacao.CelularDataSource
import com.borabill.lembriwearable.data.model.AgendaRelogio
import com.borabill.lembriwearable.data.model.EventoRelogio
import com.borabill.lembriwearable.data.model.LembreteAgenda
import java.time.Instant
import java.time.LocalDateTime
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

private const val JANELA_DESFAZER_MS = 10_000L
private const val TAG = "AgendaRepository"

data class EstadoAgenda(
    val lembretes: List<LembreteAgenda> = emptyList(),
    val feitos: Set<String> = emptySet(),
    val pendente: String? = null,
    val temDados: Boolean = false,
    val exemplo: Boolean = false,
    val atualizadoEm: LocalDateTime? = null,
    val conectado: Boolean = false,
)

class AgendaRepository(
    private val feitosLocais: FeitosLocais,
    private val celular: CelularDataSource,
    private val avisos: AvisosLembretes,
    usarExemplo: Boolean,
) {
    private val escopo = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var temporizador: Job? = null

    private val _estado = MutableStateFlow(
        EstadoAgenda(
            lembretes = if (usarExemplo) gerarLembretesExemplo(LocalDateTime.now()) else emptyList(),
            feitos = feitosLocais.feitos(),
            temDados = usarExemplo,
            exemplo = usarExemplo,
        ),
    )
    val estado: StateFlow<EstadoAgenda> = _estado.asStateFlow()

    init {
        feitosLocais.pendente()?.let(::retomar)
        escopo.launch {
            runCatching { celular.lerAgenda() }
                .onSuccess { json -> json?.let(::receberAgenda) }
                .onFailure { Log.w(TAG, "Falha ao ler a agenda salva", it) }
            atualizarConexao()
        }
    }

    fun receberAgenda(json: String) {
        val agenda = runCatching { AgendaRelogio.fromJson(json) }
            .onFailure { Log.w(TAG, "Agenda inválida", it) }
            .getOrNull() ?: return
        val aguardando = agenda.lembretes.filterNot { it.feito }.map { it.chave }.toSet()
        val feitos = feitosLocais.manterApenas(aguardando)
        _estado.update {
            it.copy(
                lembretes = agenda.lembretes,
                feitos = feitos,
                temDados = true,
                exemplo = false,
                atualizadoEm = agenda.geradoEm,
            )
        }
        avisos.reprogramar(agenda.lembretes, feitos)
    }

    suspend fun atualizarConexao() {
        val conectado = runCatching { celular.conectado() }.getOrDefault(false)
        _estado.update { it.copy(conectado = conectado) }
    }

    fun marcarFeito(chave: String) {
        if (_estado.value.pendente != null) return
        retomar(FeitoPendente(chave, System.currentTimeMillis() + JANELA_DESFAZER_MS))
    }

    fun desfazer() {
        temporizador?.cancel()
        feitosLocais.limparPendente()
        _estado.update { it.copy(pendente = null) }
    }

    fun registrarExercicio(exercicioId: String, acertos: Int, total: Int, duracaoSeg: Long) {
        val iniciadaEm = Instant.now().minusSeconds(duracaoSeg)
        publicar(EventoRelogio.exercicio(exercicioId, iniciadaEm, duracaoSeg, acertos, total))
    }

    private fun retomar(pendente: FeitoPendente) {
        feitosLocais.salvarPendente(pendente)
        _estado.update { it.copy(pendente = pendente.chave) }
        temporizador = escopo.launch {
            delay(pendente.expiraEm - System.currentTimeMillis())
            confirmar(pendente.chave)
        }
    }

    private fun confirmar(chave: String) {
        feitosLocais.confirmar(chave)
        avisos.cancelar(chave)
        _estado.update { it.copy(feitos = it.feitos + chave, pendente = null) }
        if (!_estado.value.exemplo) publicar(EventoRelogio.feito(chave, Instant.now()))
    }

    private fun publicar(json: String) {
        escopo.launch {
            runCatching { celular.publicarEvento(json) }
                .onFailure { Log.w(TAG, "Falha ao guardar o evento", it) }
        }
    }
}
