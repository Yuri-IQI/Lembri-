plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.borabill.lembriwearable"
    compileSdk {
        version = release(37)
    }

    defaultConfig {
        // IMPORTANTE: o Data Layer só entrega mensagens entre apps com o MESMO applicationId
        // e assinados com a MESMA chave. O app mobile (Expo) usa este mesmo id em app.json
        // (android.package) e o plugin `with-shared-debug-keystore` alinha a chave de debug.
        applicationId = "com.borabill.lembriwearable"
        minSdk = 30
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"

    }

    buildTypes {
        release {
            optimization {
                enable = false
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    useLibrary("wear-sdk")
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.activity.compose)
    implementation(libs.compose.foundation)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui.tooling)
    implementation(libs.core.splashscreen)
    // Data Layer API (MessageClient/CapabilityClient): comunicação com o celular
    implementation(libs.play.services.wearable)
    // Permite usar `.await()` nas Tasks do Google Play Services dentro de coroutines
    implementation(libs.kotlinx.coroutines.play.services)
    // ViewModel + coleta de StateFlow respeitando o ciclo de vida no Compose
    implementation(libs.lifecycle.viewmodel.compose)
    implementation(libs.lifecycle.runtime.compose)
    implementation(libs.ui)
    implementation(libs.ui.graphics)
    implementation(libs.ui.tooling.preview)
    implementation(libs.wear.tooling.preview)
    implementation(libs.wear.compose.navigation)
    testImplementation(libs.junit)
    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.ui.test.junit4)
    debugImplementation(libs.ui.test.manifest)
    debugImplementation(libs.ui.tooling)
}