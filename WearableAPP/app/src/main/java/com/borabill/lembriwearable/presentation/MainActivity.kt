package com.borabill.lembriwearable.presentation

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
        setContent {
            LembriWearableTheme {
                AppScaffold {
                    LembriNavHost()
                }
            }
        }
    }
}
