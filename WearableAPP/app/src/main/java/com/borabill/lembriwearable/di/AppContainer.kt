package com.borabill.lembriwearable.di

import android.content.Context
import com.borabill.lembriwearable.BuildConfig
import com.borabill.lembriwearable.data.avisos.AvisosLembretes
import com.borabill.lembriwearable.data.comunicacao.CelularDataSource
import com.borabill.lembriwearable.data.repository.AgendaRepository
import com.borabill.lembriwearable.data.repository.FeitosLocais

class AppContainer(context: Context) {
    val avisos = AvisosLembretes(context)

    // Aviso: dados de exemplo nunca aparecem em release, para não mostrar um remédio falso.
    val agendaRepository = AgendaRepository(
        feitosLocais = FeitosLocais(context),
        celular = CelularDataSource(context),
        avisos = avisos,
        usarExemplo = BuildConfig.DEBUG,
    )
}
