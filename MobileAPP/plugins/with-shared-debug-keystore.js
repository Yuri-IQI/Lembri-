/**
 * Config plugin: faz o build DEBUG do app Expo usar a chave de debug padrão do
 * Android (~/.android/debug.keystore), a mesma que o Android Studio usa para
 * assinar o WearableAPP.
 *
 * Por quê? A Wearable Data Layer API só entrega mensagens entre apps com o
 * mesmo applicationId E a mesma assinatura. Por padrão o Expo assina com
 * `android/app/debug.keystore` (gerado no prebuild), que é diferente.
 *
 * Release: configure a MESMA chave de upload/release nos dois projetos.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

const KEYSTORE_PADRAO = "file(System.getProperty('user.home') + '/.android/debug.keystore')";

module.exports = function withSharedDebugKeystore(config) {
  return withAppBuildGradle(config, (cfg) => {
    const original = cfg.modResults.contents;
    // No template do Expo: signingConfigs { debug { storeFile file('debug.keystore') ... } }
    const alterado = original.replace(/storeFile file\(['"]debug\.keystore['"]\)/, `storeFile ${KEYSTORE_PADRAO}`);

    if (alterado === original && !original.includes(KEYSTORE_PADRAO)) {
      console.warn(
        '[with-shared-debug-keystore] signingConfig de debug não encontrado em app/build.gradle; ' +
          'confira manualmente se celular e relógio usam a mesma chave.',
      );
    }
    cfg.modResults.contents = alterado;
    return cfg;
  });
};
