import { AppRegistry, Platform } from 'react-native';

import { processarEventos } from './processar-eventos';

// Aviso: o nome precisa ser igual a TAREFA_EVENTOS em EventosRelogioService.kt.
if (Platform.OS === 'android') {
  AppRegistry.registerHeadlessTask('lembri-eventos-relogio', () => processarEventos);
}
