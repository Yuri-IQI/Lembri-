/**
 * Config plugin: no Windows, compila o código C++ com o CMake 3.31.6 em vez do 3.22.1 padrão.
 *
 * Por quê? O CMake gera caminhos de arquivos com mais de 260 caracteres (ex.: o codegen
 * do react-native-safe-area-context passa de 270 mesmo com o projeto direto em C:\).
 * O ninja 1.10 que vem no CMake 3.22.1 não suporta caminhos longos e falha com
 * "Filename longer than 260 characters"; o ninja do CMake 3.31 suporta.
 *
 * Requisito, uma vez por máquina Windows: instalar o CMake 3.31.6 no Android Studio
 * (Settings → Languages & Frameworks → Android SDK → aba SDK Tools → marcar
 * "Show Package Details" → CMake → 3.31.6). O Gradle NÃO baixa o CMake sozinho;
 * sem ele o build falha com "[CXX1300] CMake '3.31.6' was not found in SDK".
 * Não é preciso ativar LongPathsEnabled no Windows (testado com ele desligado).
 *
 * No macOS/Linux nada muda.
 */
const { withProjectBuildGradle } = require('expo/config-plugins');

const MARCADOR = '// [with-windows-cmake]';
const CMAKE_VERSION = '3.31.6';

const BLOCO = `
${MARCADOR}
if (System.getProperty('os.name').toLowerCase().contains('windows')) {
  subprojects {
    ['com.android.application', 'com.android.library'].each { id ->
      plugins.withId(id) {
        android.externalNativeBuild.cmake.version = '${CMAKE_VERSION}'
      }
    }
  }
}
`;

// O plugin rootproject do React Native força a avaliação dos subprojetos; o bloco
// precisa vir antes dele para a versão ser definida a tempo.
const ROOTPROJECT = 'apply plugin: "com.facebook.react.rootproject"';

module.exports = function withWindowsCmake(config) {
  return withProjectBuildGradle(config, (cfg) => {
    const contents = cfg.modResults.contents;
    if (contents.includes(MARCADOR)) return cfg;

    cfg.modResults.contents = contents.includes(ROOTPROJECT)
      ? contents.replace(ROOTPROJECT, `${BLOCO.trim()}\n\n${ROOTPROJECT}`)
      : contents + BLOCO;
    return cfg;
  });
};
