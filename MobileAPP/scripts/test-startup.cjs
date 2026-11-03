/** Regressões do ciclo de saída do carregamento e do contraste; APIs de plataforma são simuladas. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const React = require('react');
const { test } = require('node:test');
const ts = require('typescript');

const sourceRoot = path.resolve(__dirname, '../src');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
let runtime;
Module._resolveFilename = function (request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(sourceRoot, request.slice(2)) : request, parent, ...rest);
};
Module._load = function (request, ...rest) {
  if (request === 'react') return {
    ...React,
    useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}],
    useEffect: (effect) => runtime.effects.push(effect),
  };
  if (request === 'react-native') return {
    Platform: { OS: 'web' }, StatusBar: () => null, View: () => null,
    StyleSheet: { create: (styles) => styles, absoluteFill: {} },
    Easing: { cubic: (value) => value, out: (easing) => easing },
    Animated: {
      Value: class { constructor(value) { this.value = value; } }, View: () => null,
      timing: (_value, config) => {
        runtime.configs.push(config);
        return {
          start: (callback) => { runtime.animationFinished = callback; },
          stop: () => { runtime.stops++; runtime.animationFinished?.({ finished: false }); },
        };
      },
    },
    AccessibilityInfo: {
      isReduceMotionEnabled: () => { runtime.queries++; return runtime.preference(); },
      addEventListener: (event, callback) => {
        assert.equal(event, 'reduceMotionChanged'); runtime.preferenceChanged = callback;
        return { remove: () => { runtime.removals++; } };
      },
    },
  };
  if (request === '@/components/loading/eclipse') return { Eclipse: () => null };
  if (request === '@/components/themed-text') return { ThemedText: () => null };
  return originalLoad.call(this, request, ...rest);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
const { Loading } = require(path.join(sourceRoot, 'components/loading/loading.tsx'));
const { Colors, LoadingEclipse, PaletaTipos } = require(path.join(sourceRoot, 'constants/theme.ts'));
const { razaoDeContraste } = require(path.join(sourceRoot, 'utils/contraste.ts'));
const flush = () => new Promise((resolve) => setImmediate(resolve));
const begin = (ready, preference = () => Promise.resolve(false)) => {
  runtime = { effects: [], configs: [], queries: 0, removals: 0, stops: 0, completions: 0, preference };
  Loading({ ready, onDesenhada: () => {}, onFinished: () => { runtime.completions++; } });
  return runtime.effects[0]();
};

test('abertura: não inicia saída antes da prontidão informada pela tela', async () => {
  begin(false); await flush();
  assert.equal(runtime.queries, 0); assert.equal(runtime.configs.length, 0); assert.equal(runtime.completions, 0);
});
test('abertura: mantém a camada até o fade terminar, sem remoção ao início', async () => {
  const cleanup = begin(true); await flush();
  assert.equal(runtime.completions, 0);
  assert.equal(runtime.configs.length, 1);
  assert.equal(runtime.configs[0].duration, LoadingEclipse.fadeOutMs);
  assert.equal(runtime.configs[0].toValue, 0);
  assert.equal(runtime.configs[0].useNativeDriver, false);
  runtime.animationFinished({ finished: true }); runtime.animationFinished({ finished: true });
  assert.equal(runtime.completions, 1); cleanup(); assert.equal(runtime.removals, 1);
});
test('abertura: movimento reduzido encerra sem animação', async () => {
  const cleanup = begin(true, () => Promise.resolve(true)); await flush();
  assert.equal(runtime.configs.length, 0); assert.equal(runtime.completions, 1); cleanup();
});
test('abertura: erro ao consultar preferência encerra sem prender o carregamento', async () => {
  const cleanup = begin(true, () => Promise.reject(new Error('Indisponível'))); await flush();
  assert.equal(runtime.configs.length, 0); assert.equal(runtime.completions, 1); cleanup();
});
test('abertura: ativar movimento reduzido durante o fade interrompe e conclui uma vez', async () => {
  const cleanup = begin(true); await flush(); runtime.preferenceChanged(true);
  assert.equal(runtime.stops, 1); assert.equal(runtime.completions, 1);
  runtime.animationFinished({ finished: true }); assert.equal(runtime.completions, 1); cleanup();
});
test('abertura: desmontagem durante consulta pendente não dispara animação ou callback tardio', async () => {
  let resolvePreference;
  const cleanup = begin(true, () => new Promise((resolve) => { resolvePreference = resolve; }));
  cleanup(); resolvePreference(false); await flush();
  assert.equal(runtime.configs.length, 0); assert.equal(runtime.completions, 0); assert.equal(runtime.removals, 1);
});
test('tema: neutros suaves mantêm contraste AAA dos textos e das ações principais', () => {
  for (const background of [Colors.background, Colors.surface, Colors.inputBackground, Colors.chipBackground]) {
    assert.ok(razaoDeContraste(Colors.text, background) >= 7);
    assert.ok(razaoDeContraste(Colors.textSecondary, background) >= 7);
  }
  assert.ok(razaoDeContraste(Colors.loadingTexto, Colors.loadingFundo) >= 7);
  for (const background of [Colors.primary, Colors.danger]) assert.ok(razaoDeContraste(Colors.onPrimary, background) >= 7);
  for (const color of PaletaTipos) assert.ok(razaoDeContraste(Colors.text, color.corHex) >= 7);
  console.log('Contrastes:', JSON.stringify({
    textBackground: razaoDeContraste(Colors.text, Colors.background).toFixed(2),
    secondaryBackground: razaoDeContraste(Colors.textSecondary, Colors.background).toFixed(2),
    secondarySurface: razaoDeContraste(Colors.textSecondary, Colors.surface).toFixed(2),
  }));
});
test('tema: splash nativa, fundo inicial e carregamento compartilham a cor', () => {
  const { expo } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../app.json'), 'utf8'));
  assert.equal(expo.backgroundColor, Colors.background);
  assert.equal(expo.plugins.find((plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen')[1].backgroundColor, Colors.background);
  assert.equal(Colors.loadingFundo, Colors.background);
});
