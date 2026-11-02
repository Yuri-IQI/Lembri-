package com.borabill.lembriwearable

import android.app.Application
import com.borabill.lembriwearable.di.AppContainer

class LembriWearApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
