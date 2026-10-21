/**
 * Bibliotecas nativas que NÃO são compiladas no Android.
 *
 * O expo-router instala react-native-reanimated, react-native-worklets e
 * react-native-gesture-handler como dependências, mas o app não usa nenhuma delas:
 * o router só as carrega no Drawer e na Stack em JS, e usamos NativeTabs e a
 * Stack nativa.
 *
 * Por que desativar: são as maiores bibliotecas em C++ do projeto, e compilá-las
 * deixa cada build nativo vários minutos mais lento sem nenhum benefício para o app.
 *
 * Para usar Drawer, animações com reanimated ou gestos, remova a biblioteca
 * desta lista e rode `npx expo prebuild --clean -p android`.
 */
const naoCompilarNoAndroid = { platforms: { android: null } };

module.exports = {
  dependencies: {
    'react-native-reanimated': naoCompilarNoAndroid,
    'react-native-worklets': naoCompilarNoAndroid,
    'react-native-gesture-handler': naoCompilarNoAndroid,
  },
};
