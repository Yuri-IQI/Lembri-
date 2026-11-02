package com.borabill.lembriwearable.presentation

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.wear.compose.material3.AppScaffold
import com.borabill.lembriwearable.presentation.navigation.LembriNavHost
import com.borabill.lembriwearable.presentation.theme.LembriWearableTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        pedirPermissaoDeAvisos()
        setContent {
            LembriWearableTheme {
                AppScaffold {
                    LembriNavHost()
                }
            }
        }
    }

    private fun pedirPermissaoDeAvisos() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val permissao = Manifest.permission.POST_NOTIFICATIONS
        if (checkSelfPermission(permissao) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(permissao), 0)
        }
    }
}
