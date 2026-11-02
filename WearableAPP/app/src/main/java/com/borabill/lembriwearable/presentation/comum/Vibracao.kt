package com.borabill.lembriwearable.presentation.comum

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator

private const val DURACAO_MS = 80L
private const val PAUSA_MS = 100L
private const val SEM_REPETICAO = -1

fun Context.vibrarUmaVez() {
    getSystemService(Vibrator::class.java)
        ?.vibrate(VibrationEffect.createOneShot(DURACAO_MS, VibrationEffect.DEFAULT_AMPLITUDE))
}

fun Context.vibrarDuasVezes() {
    getSystemService(Vibrator::class.java)?.vibrate(
        VibrationEffect.createWaveform(longArrayOf(0, DURACAO_MS, PAUSA_MS, DURACAO_MS), SEM_REPETICAO),
    )
}

fun Context.vibrarResposta(acertou: Boolean) {
    if (acertou) vibrarUmaVez() else vibrarDuasVezes()
}
