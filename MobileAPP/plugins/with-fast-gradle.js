/**
 * Config plugin: ajustes no android/gradle.properties para builds mais rápidos.
 *
 * A pasta android/ é gerada pelo prebuild, então editar o arquivo à mão não
 * sobrevive a um `prebuild --clean`; por isso os ajustes ficam aqui.
 */
const { withGradleProperties } = require('expo/config-plugins');

const PROPRIEDADES = {
  // Mais memória para o Gradle e o compilador Kotlin (o padrão de 2 GB faz o GC trabalhar demais).
  'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8',
  // Reaproveita saídas de tarefas já executadas, inclusive depois de um clean.
  'org.gradle.caching': 'true',
  'org.gradle.parallel': 'true',
};

module.exports = function withFastGradle(config) {
  return withGradleProperties(config, (cfg) => {
    for (const [key, value] of Object.entries(PROPRIEDADES)) {
      const existente = cfg.modResults.find((item) => item.type === 'property' && item.key === key);
      if (existente) {
        existente.value = value;
      } else {
        cfg.modResults.push({ type: 'property', key, value });
      }
    }
    return cfg;
  });
};
