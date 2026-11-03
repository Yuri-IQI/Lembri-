/** Regressões do HTML acessível dos componentes reais, sem abrir apps externos. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test } = require('node:test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const nativeWeb = require('react-native-web');
const ts = require('typescript');

const sourceRoot = path.resolve(__dirname, '../src');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
Module._resolveFilename = function (request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(sourceRoot, request.slice(2)) : request, parent, ...rest);
};
Module._load = function (request, ...rest) {
  if (request === 'react-native') return nativeWeb;
  if (request === '@react-native-async-storage/async-storage') return {
    getItem: async () => null, setItem: async () => {}, removeItem: async () => {},
  };
  if (request === 'expo-symbols') return { SymbolView: () => null };
  if (request === '@/components/exercicio/icone-exercicio') return { IconeExercicio: () => null };
  if (request === '@/components/formulario/faixa-gradiente') return { FaixaGradiente: () => null };
  if (request === 'react-native-safe-area-context') return { SafeAreaView: nativeWeb.View };
  return originalLoad.call(this, request, ...rest);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
const fromSource = (file) => require(path.join(sourceRoot, file));
const { Interruptor } = fromSource('components/interruptor.tsx');
const { FaqSection } = fromSource('components/help/faq-section.tsx');
const { DeviceSection } = fromSource('components/ajustes/device-section.tsx');
const { CartaoAjuste } = fromSource('components/cartao-ajuste.tsx');
const { BottomBarItem } = fromSource('components/app-bar/bottom-bar.tsx');
const { Botao } = fromSource('components/botao.tsx');
const { ChipOcorrencia } = fromSource('components/chip-ocorrencia.tsx');
const { BotaoFiltro } = fromSource('components/agenda/botao-filtro.tsx');
const { CirculoCor } = fromSource('components/formulario/circulo-cor.tsx');
const { SeletorMatiz } = fromSource('components/formulario/seletor-matiz.tsx');
const { ExercicioCard } = fromSource('components/cards/exercicio-card.tsx');
const { HistoricoTentativas } = fromSource('components/exercicio/historico-tentativas.tsx');
const { IndicadoresExercicio } = fromSource('components/exercicio/indicadores-exercicio.tsx');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const noop = () => {};

test('web: interruptor anuncia ligado e desligado no HTML', () => {
  for (const ligado of [true, false]) {
    const markup = render(Interruptor, { ligado, onAlternar: noop, accessibilityLabel: 'Texto ampliado' });
    assert.match(markup, /role="switch"/);
    assert.ok(markup.includes('aria-checked="' + ligado + '"'));
    assert.match(markup, /aria-label="Texto ampliado"/);
  }
});

test('web: FAQ distingue resposta inicial aberta das recolhidas', () => {
  const markup = render(FaqSection, { items: [
    { id: 'first', question: 'Primeira pergunta?', answer: 'Resposta inicial visível' },
    { id: 'second', question: 'Segunda pergunta?', answer: 'Resposta recolhida' },
  ] });
  assert.match(markup, /aria-expanded="true"/);
  assert.match(markup, /aria-expanded="false"/);
  assert.ok(markup.includes('Resposta inicial visível'));
  assert.ok(!markup.includes('Resposta recolhida'));
});

test('web: dispositivos e explicações de avisos anunciam estado recolhido', () => {
  assert.match(render(DeviceSection), /aria-expanded="false"/);
  assert.match(render(CartaoAjuste, {
    titulo: 'Avisos de Lembretes', descricao: 'Explicação', ligado: true, onAlternar: noop,
  }), /aria-expanded="false"/);
});

test('web: abas anunciam seleção e botões anunciam ocupado/desabilitado', () => {
  for (const active of [true, false]) {
    assert.ok(render(BottomBarItem, { Icone: () => null, rotulo: 'Ajustes', isFocused: active })
      .includes('aria-selected="' + active + '"'));
    const markup = render(Botao, { rotulo: 'Atualizar avisos', onPress: noop, ocupado: active, desabilitado: active });
    assert.ok(markup.includes('aria-busy="' + active + '"'));
    if (active) assert.match(markup, /aria-disabled="true"/);
  }
});

test('web: conclusão, filtros e cores expõem seus dois estados', () => {
  for (const selected of [true, false]) {
    assert.ok(render(ChipOcorrencia, {
      horario: '08:00', estado: selected ? 'feito' : 'pendente', descricao: 'Tomei: Vitamina', onAlternar: noop,
    }).includes('aria-checked="' + selected + '"'));
    assert.ok(render(BotaoFiltro, { rotulo: 'A seguir', selecionado: selected, onPress: noop })
      .includes('aria-selected="' + selected + '"'));
    assert.ok(render(CirculoCor, { corHex: '#FF8181', nome: 'Vermelho', selecionado: selected, onPress: noop })
      .includes('aria-checked="' + selected + '"'));
  }
});

test('web: seletor de matiz anuncia valor e limites e pode receber foco de teclado', () => {
  for (const hue of [0, 180, 360]) {
    const markup = render(SeletorMatiz, { matiz: hue, onAlterar: noop });
    assert.match(markup, /role="slider"/);
    assert.match(markup, /aria-valuemin="0"/);
    assert.match(markup, /aria-valuemax="360"/);
    assert.ok(markup.includes('aria-valuenow="' + hue + '"'));
    assert.match(markup, /tabindex="0"/);
  }
});

test('web: detalhes e começar são botões independentes no card de exercício', () => {
  const markup = render(ExercicioCard, {
    exercicio: { titulo: 'Ordenação', icone: 'ordem' }, ultimaAtividade: 'Ainda não praticado',
    diasSeguidos: 0, onComecar: noop, onDetalhes: noop,
  });
  assert.equal((markup.match(/<button\b/g) || []).length, 2);
  assert.doesNotMatch(markup, /<button\b[^>]*>(?:(?!<\/button>)[\s\S])*<button\b/);
  assert.match(markup, /aria-label="Começar exercício Ordenação"/);
});

test('web: histórico mantém as duas notas e usa o dia local perto da meia-noite UTC', () => {
  const previousTimeZone = process.env.TZ;
  process.env.TZ = 'America/Sao_Paulo';
  try {
    const attempt = { id: 'qa', exercicioId: 'sequencia', dataHora: '2026-11-03T00:15:00Z',
      tempoGastoSegundos: 60, acertos: 14, totalQuestoes: 15, pontuacaoPercentual: 93,
      correctedHits: 15, correctedScorePercent: 100 };
    const markup = render(HistoricoTentativas, { tentativas: [attempt] });
    assert.match(markup, /02\/11\/2026/);
    assert.doesNotMatch(markup, /03\/11\/2026/);
    assert.match(markup, /Primeira tentativa: 14 de 15/);
    assert.match(markup, /Após correções: 15 de 15/);
    const legacy = { ...attempt };
    delete legacy.correctedHits; delete legacy.correctedScorePercent;
    assert.doesNotMatch(render(HistoricoTentativas, { tentativas: [legacy] }), /Após correções/);
    const indicators = render(IndicadoresExercicio, {
      estatisticas: { ultima: new Date(attempt.dataHora), tempoMedioMin: 1, mediaAcertos: 93 },
    });
    assert.match(indicators, /Última atividade em 02\/11\/2026/);
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});

test('web: aviso de exercício não aparece nas telas de lembretes', () => {
  const { useAvisoStore } = fromSource('stores/useAvisoStore.ts');
  const previousLoad = Module._load;
  const file = path.join(sourceRoot, 'components/aviso-global.tsx');
  // Na renderização estática, injeta o snapshot do cliente sem depender de hidratação do React.
  Module._load = function (request, ...rest) {
    if (request === '@/stores/useAvisoStore') return {
      useAvisoStore: (selector) => selector(useAvisoStore.getState()),
    };
    return previousLoad.call(this, request, ...rest);
  };
  try {
    delete require.cache[file];
    const { AvisoGlobal } = fromSource('components/aviso-global.tsx');
    useAvisoStore.getState().mostrar('Seu lembrete foi salvo');
    assert.match(render(AvisoGlobal), /Seu lembrete foi salvo/);
    useAvisoStore.getState().mostrar('Tudo certo!', 'exercise');
    assert.equal(render(AvisoGlobal), '');
  } finally {
    useAvisoStore.getState().fechar();
    Module._load = previousLoad;
    delete require.cache[file];
  }
});
