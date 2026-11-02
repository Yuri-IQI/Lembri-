/** Testes de domínio com Node Test Runner; nenhuma chamada chega ao dispositivo ou a contatos reais. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { test } = require('node:test');
const ts = require('typescript');

const sourceRoot = path.resolve(__dirname, '../src');
const originalResolve = Module._resolveFilename;
const originalLoad = Module._load;
const memory = new Map();
let failRead = false;
let failWrite = false;
let granted = true;
let failSchedule = false;
let failCancel = false;
let onSchedule = null;
const scheduled = new Map();
const dismissed = [];

const storage = {
  getItem: async (key) => {
    if (failRead && key === 'lembri-settings') throw new Error('Falha de leitura simulada');
    return memory.get(key) ?? null;
  },
  setItem: async (key, value) => {
    if (failWrite && key === 'lembri-settings') throw new Error('Falha de gravação simulada');
    memory.set(key, value);
  },
  removeItem: async (key) => { memory.delete(key); },
};
const notifications = {
  DEFAULT_ACTION_IDENTIFIER: 'default',
  SchedulableTriggerInputTypes: { DATE: 'date' },
  AndroidImportance: { MAX: 5 },
  AndroidNotificationVisibility: { PUBLIC: 1 },
  getPermissionsAsync: async () => ({ granted, canAskAgain: false }),
  requestPermissionsAsync: async () => ({ granted }),
  setNotificationHandler: () => {},
  setNotificationChannelAsync: async () => {},
  setNotificationCategoryAsync: async () => {},
  getAllScheduledNotificationsAsync: async () => [...scheduled.values()],
  scheduleNotificationAsync: async (request) => {
    if (failSchedule) throw new Error('Falha de agendamento simulada');
    scheduled.set(request.identifier, request);
    onSchedule?.();
    return request.identifier;
  },
  cancelScheduledNotificationAsync: async (id) => {
    if (failCancel) throw new Error('Falha de cancelamento simulada');
    scheduled.delete(id);
  },
  dismissNotificationAsync: async (id) => { dismissed.push(id); },
};

Module._resolveFilename = function (request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(sourceRoot, request.slice(2)) : request, parent, ...rest);
};
Module._load = function (request, ...rest) {
  if (request === '@react-native-async-storage/async-storage') return storage;
  if (request === 'expo-notifications') return notifications;
  if (request === 'react-native') return { Platform: { OS: 'android' } };
  if (request === 'expo-linking') return { openURL: async () => { throw new Error('Contato externo não substituído no teste'); } };
  return originalLoad.call(this, request, ...rest);
};
require.extensions['.ts'] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

const fromSource = (file) => require(path.join(sourceRoot, file));
const { useSettingsStore, useSettingsPersistenceStore, retrySettingsPersistence } = fromSource('stores/useSettingsStore.ts');
const { useLembretesStore } = fromSource('stores/useLembretesStore.ts');
const { restoreSettings } = fromSource('utils/settings.ts');
const { defaultSettingsMock } = fromSource('mocks/settings.mock.ts');
const { TextScale } = fromSource('constants/theme.ts');
const { createDevicesRepository } = fromSource('services/devices-repository.ts');
const { createDevicesStore } = fromSource('stores/useDevicesStore.ts');
const { exerciseNotifications } = fromSource('utils/exercise-notifications.ts');
const { sincronizarNotificacoes, adiarNotificacao, MAX_APP_NOTIFICATIONS } = fromSource('utils/agendar-notificacoes.ts');
const { readNotificationData, isOwnedNotificationId } = fromSource('utils/notification-data.ts');
const { responderNotificacao } = fromSource('utils/responder-notificacao.ts');
const { enqueueNotificationOperation } = fromSource('utils/notification-queue.ts');
const { openSupportContact } = fromSource('services/support-service.ts');
const { criarLembreteMock } = fromSource('mocks/lembretes.mock.ts');

const flushWrites = async () => {
  await new Promise(setImmediate);
  await retrySettingsPersistence();
};
const reminder = (id = 'agua') => ({
  id: `${id}@2026-11-03T09:00`, lembreteId: id, ocorrencia: `${id}@2026-11-03T09:00`,
  titulo: 'Beber água', corpo: 'Hora de beber água.', quando: new Date(2026, 10, 3, 9), categoria: 'fiz',
});
const response = (data, actionIdentifier = 'default') => ({
  actionIdentifier,
  notification: { request: { identifier: 'aviso-apresentado', content: { data, title: 'Aviso' } } },
});
const resetNotifications = () => {
  scheduled.clear(); dismissed.length = 0; granted = true;
  failSchedule = false; failCancel = false; onSchedule = null;
};

test('respostas: web e hidratação pendente não acessam APIs nativas; Android mantém listeners e limpeza', () => {
  const previousLoad = Module._load;
  for (const [platform, hydrated, expectedCalls] of [['web', true, 0], ['android', false, 0], ['android', true, 1]]) {
    let effect;
    let reads = 0;
    let listeners = 0;
    let removals = 0;
    const nativeNotifications = {
      getLastNotificationResponse: () => { reads += 1; return null; },
      addNotificationResponseReceivedListener: () => { listeners += 1; return { remove: () => { removals += 1; } }; },
    };
    Module._load = function (request, ...rest) {
      if (request === 'react') return { useEffect: (callback) => { effect = callback; } };
      if (request === 'expo-router') return { router: {} };
      if (request === 'expo-notifications') return nativeNotifications;
      if (request === 'react-native') return { Platform: { OS: platform }, AppState: {
        addEventListener: () => { listeners += 1; return { remove: () => { removals += 1; } }; },
      } };
      return previousLoad.call(this, request, ...rest);
    };
    const file = path.join(sourceRoot, 'hooks/use-respostas-notificacao.ts');
    try {
      delete require.cache[file];
      fromSource('hooks/use-respostas-notificacao.ts').useRespostasNotificacao(hydrated);
      const cleanup = effect();
      assert.equal(reads, expectedCalls, `${platform}, hydrated=${hydrated}`);
      assert.equal(listeners, expectedCalls * 2);
      cleanup?.();
      assert.equal(removals, expectedCalls * 2);
    } finally {
      Module._load = previousLoad;
      delete require.cache[file];
    }
  }
});

test('settings: contratos e escala existentes continuam válidos', async () => {
  await useSettingsStore.persist.rehydrate();
  fromSource('stores/__tests__/useSettingsStore.test.ts').runSettingsStoreTests();
  await flushWrites();
});

test('settings: migração preserva legado, false explícito e limita snapshots inválidos', () => {
  assert.deepEqual(restoreSettings(null), defaultSettingsMock);
  const legacy = restoreSettings({ hasSeenSplash: true, reminderLimit: 12 });
  assert.equal(legacy.hasSeenSplash, true);
  assert.equal(legacy.reminderLimit, 12);
  assert.equal(legacy.reminderNotificationsEnabled, true);
  assert.equal(legacy.exerciseNotificationsEnabled, false);
  assert.equal(restoreSettings({ reminderNotificationsEnabled: false }).reminderNotificationsEnabled, false);
  assert.equal(restoreSettings({ isLargeText: 'false', reminderLimit: NaN }).isLargeText, false);
});

test('settings: persistência, hidratação, escala derivada e reset visual', async () => {
  useSettingsStore.getState().setLargeText(true);
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', false);
  useSettingsStore.getState().setNotificationPreference('exerciseNotificationsEnabled', true);
  await flushWrites();
  const saved = memory.get('lembri-settings');
  assert.equal(JSON.parse(saved).version, 1);
  assert.equal('textScaleFactor' in JSON.parse(saved).state, false);
  await useSettingsStore.persist.rehydrate();
  assert.equal(useSettingsStore.getState().textScaleFactor, TextScale.large);
  useSettingsStore.getState().resetToDefaults();
  assert.equal(useSettingsStore.getState().reminderNotificationsEnabled, false);
  assert.equal(useSettingsStore.getState().exerciseNotificationsEnabled, true);
  await flushWrites();
  memory.set('lembri-settings', JSON.stringify({ state: { hasSeenSplash: true, reminderLimit: 17 }, version: 0 }));
  await useSettingsStore.persist.rehydrate();
  assert.equal(useSettingsStore.getState().reminderLimit, 17);
  assert.equal(useSettingsStore.getState().reminderNotificationsEnabled, true);
});

test('settings: falhas de storage têm feedback e permitem recuperação sem travar hidratação', async () => {
  await flushWrites();
  failWrite = true;
  useSettingsStore.getState().setLargeText(true);
  await new Promise(setImmediate);
  assert.equal(useSettingsPersistenceStore.getState().operation, 'save');
  failWrite = false;
  await retrySettingsPersistence();
  assert.equal(useSettingsPersistenceStore.getState().error, null);
  failRead = true;
  await useSettingsStore.persist.rehydrate();
  assert.equal(useSettingsStore.persist.hasHydrated(), true);
  assert.equal(useSettingsPersistenceStore.getState().operation, 'load');
  assert.equal(useSettingsStore.getState().isLargeText, true, 'Falha de leitura preserva o estado confirmado em memória');
  failRead = false;
  await retrySettingsPersistence();
  assert.equal(useSettingsPersistenceStore.getState().error, null);
  memory.set('lembri-settings', '{json inválido');
  await useSettingsStore.persist.rehydrate();
  assert.equal(useSettingsStore.persist.hasHydrated(), true);
  assert.equal(useSettingsPersistenceStore.getState().operation, 'load');
  memory.delete('lembri-settings');
  await retrySettingsPersistence();
});

test('settings: alternâncias rápidas preservam a última preferência', async () => {
  for (let index = 0; index < 21; index += 1) useSettingsStore.getState().setLargeText(index % 2 === 0);
  await flushWrites();
  assert.equal(JSON.parse(memory.get('lembri-settings')).state.isLargeText, true);
});

test('dispositivos: cópias, conexão idempotente e ID inexistente', async () => {
  const repository = createDevicesRepository();
  const first = await repository.list();
  first[0].name = 'Alterado fora do repositório';
  assert.equal((await repository.list())[0].name, 'Relógio 1');
  await repository.setConnected('demo-watch-2', true);
  await repository.setConnected('demo-watch-2', true);
  assert.equal((await repository.list()).length, 2);
  assert.equal((await repository.list())[1].status, 'connected');
  await assert.rejects(repository.setConnected('inexistente', true));
});

test('dispositivos: vazio, falhas, último estado confirmado e recuperação', async () => {
  const empty = createDevicesStore(createDevicesRepository([]));
  await empty.getState().load();
  assert.equal(empty.getState().loaded, true);
  assert.deepEqual(empty.getState().devices, []);
  let fail = true;
  const repository = createDevicesRepository();
  const store = createDevicesStore({
    list: () => fail ? Promise.reject(new Error('Falha')) : repository.list(),
    setConnected: (id, connected) => fail ? Promise.reject(new Error('Falha')) : repository.setConnected(id, connected),
  });
  await store.getState().load();
  assert.ok(store.getState().error);
  fail = false;
  await store.getState().load();
  fail = true;
  await store.getState().setConnected('demo-watch-1', false);
  assert.equal(store.getState().devices[0].status, 'connected');
  fail = false;
  await store.getState().setConnected('demo-watch-1', false);
  assert.equal(store.getState().devices[0].status, 'disconnected');
  assert.equal(store.getState().error, null);
  store.getState().resetToMocks();
  await new Promise(setImmediate);
  assert.equal(store.getState().devices[0].status, 'connected');
});

test('exercícios: 09h local, conclusão com zero acertos e janela de sete avisos', () => {
  const before = new Date(2026, 10, 2, 8, 59);
  const notices = exerciseNotifications([], before);
  assert.equal(notices.length, 7);
  assert.equal(notices[0].dateKey, '2026-11-02');
  assert.ok(notices.every((notice) => notice.quando.getHours() === 9 && notice.quando > before));
  const done = { dataHora: new Date(2026, 10, 2, 8, 30).toISOString(), pontuacaoPercentual: 0 };
  assert.equal(exerciseNotifications([done], before)[0].dateKey, '2026-11-03');
  assert.equal(exerciseNotifications([], new Date(2026, 10, 2, 9))[0].dateKey, '2026-11-03');
  assert.equal(exerciseNotifications([], new Date(2026, 11, 31, 10))[0].dateKey, '2027-01-01');
  for (const zone of ['America/Sao_Paulo', 'America/New_York']) {
    const previous = process.env.TZ;
    process.env.TZ = zone;
    assert.ok(exerciseNotifications([], new Date(2026, 2, 7, 10)).every((notice) => notice.quando.getHours() === 9));
    if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous;
  }
});

test('notificações: identificadores próprios e payloads legados/exercícios', () => {
  for (const suffix of ['', '#reaviso', '#adiado', '#antes-1h', '#antes-1d']) assert.ok(isOwnedNotificationId(`agua@2026-11-03T09:00${suffix}`));
  assert.equal(isOwnedNotificationId('aviso-desconhecido'), false);
  assert.equal(readNotificationData({ ocorrencia: 123 }), null);
  assert.equal(readNotificationData({ lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00', assinatura: 42 }).assinatura, undefined);
  assert.equal(readNotificationData({ kind: 'exercise', dateKey: '2026-11-03' }).kind, 'exercise');
  assert.equal(readNotificationData({ lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00' }).kind, undefined);
});

test('notificações: isolamento de domínios, desconhecidos preservados e cancelamento legado', async () => {
  resetNotifications();
  scheduled.set('externa', { identifier: 'externa', content: { data: {} } });
  const exercise = exerciseNotifications([], new Date(2026, 10, 2, 8))[0];
  const water = reminder();
  await sincronizarNotificacoes([water, exercise], () => false);
  assert.equal(scheduled.size, 3);
  assert.equal(scheduled.get(exercise.id).content.data.kind, 'exercise');
  assert.equal(scheduled.get(exercise.id).content.categoryIdentifier, undefined);
  await sincronizarNotificacoes([exercise], () => false);
  assert.equal(scheduled.has(water.id), false);
  assert.equal(scheduled.has(exercise.id), true);
  await sincronizarNotificacoes([water], () => false);
  assert.equal(scheduled.has(exercise.id), false);
  for (const suffix of ['#adiado', '#reaviso', '#antes-1h', '#antes-1d']) {
    const id = water.id + suffix;
    scheduled.set(id, { identifier: id, content: { data: { lembreteId: 'agua', ocorrencia: water.id } } });
  }
  await sincronizarNotificacoes([], () => false);
  assert.deepEqual([...scheduled.keys()], ['externa']);
});

test('notificações: limite de 107 inclui adiamentos válidos', async () => {
  resetNotifications();
  const snoozedId = 'agua@2026-11-03T09:00#adiado';
  scheduled.set(snoozedId, { identifier: snoozedId, content: { data: { lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00' } } });
  await sincronizarNotificacoes([
    ...Array.from({ length: 110 }, (_, index) => reminder(`item-${index}`)),
    ...exerciseNotifications([], new Date(2026, 10, 2, 8)),
  ], () => true);
  assert.equal(scheduled.size, MAX_APP_NOTIFICATIONS);
  assert.equal(scheduled.has(snoozedId), true);
});

test('notificações: permissão negada ainda cancela; falhas são propagadas', async () => {
  resetNotifications();
  const water = reminder();
  await sincronizarNotificacoes([water], () => false);
  granted = false;
  await sincronizarNotificacoes([], () => false);
  assert.equal(scheduled.size, 0);
  await sincronizarNotificacoes([water], () => false);
  assert.equal(scheduled.size, 0);
  granted = true;
  failSchedule = true;
  await assert.rejects(sincronizarNotificacoes([water], () => false));
  failSchedule = false;
  await sincronizarNotificacoes([water], () => false);
  failCancel = true;
  await assert.rejects(sincronizarNotificacoes([], () => false));
  resetNotifications();
});

test('notificações: mudança durante agendamento remove o aviso recém-criado e interrompe a versão antiga', async () => {
  resetNotifications();
  let current = true;
  onSchedule = () => { current = false; };
  await sincronizarNotificacoes([reminder(), reminder('outro')], () => false, () => current);
  assert.equal(scheduled.size, 0);
  resetNotifications();
});

test('respostas: adiar exige preferência, lembrete ativo e ocorrência pendente; Fiz continua válido', async () => {
  resetNotifications();
  await useSettingsStore.persist.rehydrate();
  await useLembretesStore.persist.rehydrate();
  const item = criarLembreteMock({ id: 'agua', horarios: ['09:00'] });
  const data = { lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00' };
  useLembretesStore.setState({ lembretes: [item], registros: [] });
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', false);
  await responderNotificacao(response(data, 'adiar'));
  assert.equal(scheduled.size, 0);
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', true);
  await responderNotificacao(response(data, 'adiar'));
  assert.equal(scheduled.size, 1);
  scheduled.clear();
  useLembretesStore.setState({ lembretes: [{ ...item, ativo: false }] });
  await responderNotificacao(response(data, 'adiar'));
  assert.equal(scheduled.size, 0);
  useLembretesStore.setState({ lembretes: [item] });
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', false);
  await responderNotificacao(response(data, 'feito'));
  assert.equal(useLembretesStore.getState().registros[0].chave, data.ocorrencia);
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', true);
  await responderNotificacao(response(data, 'adiar'));
  assert.equal(scheduled.size, 0);
});

test('respostas: exercícios abrem catálogo e ignoram ações de lembrete; JSON inválido é ignorado', async () => {
  assert.deepEqual(await responderNotificacao(response({ kind: 'exercise', dateKey: '2026-11-03' })), { kind: 'exercise' });
  assert.equal(await responderNotificacao(response({ kind: 'exercise', dateKey: '2026-11-03' }, 'adiar')), null);
  const malformed = response(undefined);
  malformed.notification.request.content.dataString = '{inválido';
  assert.equal(await responderNotificacao(malformed), null);
});

test('fila: serialização e recuperação depois de rejeição', async () => {
  const order = [];
  const first = enqueueNotificationOperation(async () => { order.push(1); await new Promise(setImmediate); order.push(2); });
  const second = enqueueNotificationOperation(async () => { order.push(3); });
  await Promise.all([first, second]);
  assert.deepEqual(order, [1, 2, 3]);
  await assert.rejects(enqueueNotificationOperation(async () => { throw new Error('Falha simulada'); }));
  assert.equal(await enqueueNotificationOperation(async () => 'recuperado'), 'recuperado');
});

test('suporte: demonstração não abre URI; contatos reais usam discador/e-mail e tratam rejeição', async () => {
  const opened = [];
  const open = async (url) => { opened.push(url); };
  assert.equal((await openSupportContact({ kind: 'demo', displayValue: '0800 1234 5678' }, open)).status, 'unavailable');
  assert.deepEqual(opened, []);
  assert.equal((await openSupportContact({ kind: 'phone', displayValue: 'Teste', phoneNumber: '+55 (11) 99999-9999' }, open)).status, 'opened');
  assert.equal(opened[0], 'tel:+5511999999999');
  await openSupportContact({ kind: 'email', displayValue: 'Teste', emailAddress: 'teste@example.com' }, open);
  assert.equal(opened[1], 'mailto:teste%40example.com');
  assert.equal((await openSupportContact({ kind: 'phone', displayValue: 'Inválido', phoneNumber: 'tel:123' }, open)).status, 'unavailable');
  assert.equal((await openSupportContact({ kind: 'email', displayValue: 'Teste', emailAddress: 'teste@example.com' }, async () => { throw new Error('App ausente'); })).status, 'failed');
});

test('regressão: política de lembretes e templates existentes', () => {
  fromSource('utils/__tests__/notificacoes.test.ts');
  fromSource('utils/__tests__/templates-lembrete.test.ts');
});

test('dispositivos: bloqueia duplicatas e ignora resposta antiga após reset', async () => {
  let finish;
  let calls = 0;
  const repository = createDevicesRepository();
  const store = createDevicesStore({
    list: repository.list,
    setConnected: async (id, connected) => {
      calls += 1;
      await new Promise((resolve) => { finish = resolve; });
      return repository.setConnected(id, connected);
    },
  });
  await store.getState().load();
  const change = store.getState().setConnected('demo-watch-1', false);
  await store.getState().setConnected('demo-watch-1', false);
  assert.equal(calls, 1);
  store.getState().resetToMocks();
  finish();
  await change;
  await new Promise(setImmediate);
  assert.equal(store.getState().devices[0].status, 'connected');
});

test('exercícios: concluir antes das 09h cancela hoje e preserva os dias futuros', async () => {
  resetNotifications();
  const now = new Date(2026, 10, 2, 8, 59);
  await sincronizarNotificacoes(exerciseNotifications([], now), () => false);
  await sincronizarNotificacoes(exerciseNotifications([{ dataHora: now.toISOString(), pontuacaoPercentual: 0 }], now), () => false);
  assert.equal(scheduled.has('lembri:exercise:2026-11-02'), false);
  assert.equal(scheduled.has('lembri:exercise:2026-11-03'), true);
  assert.equal(scheduled.size, 7);
});

test('adiamento: mantém limite, substitui o aviso mais distante e revalida depois de agendar', async () => {
  resetNotifications();
  await sincronizarNotificacoes(Array.from({ length: 100 }, (_, index) => ({
    ...reminder(`item-${index}`), quando: new Date(2026, 10, 3, 9, index),
  })), () => false);
  const data = { lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00' };
  await adiarNotificacao(response(data).notification, data);
  assert.equal(scheduled.size, 100);
  assert.equal(scheduled.has('item-99@2026-11-03T09:00'), false);
  assert.equal(scheduled.has(`${data.ocorrencia}#adiado`), true);
  resetNotifications();
  let allowed = true;
  onSchedule = () => { allowed = false; };
  await adiarNotificacao(response(data).notification, data, () => allowed);
  assert.equal(scheduled.size, 0);
  resetNotifications();
});

test('background: aguarda settings durante hidratação fria antes de validar adiamento', async () => {
  await flushWrites();
  resetNotifications();
  const getItem = storage.getItem;
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  storage.getItem = async (key) => {
    if (key !== 'lembri-settings') return getItem(key);
    await gate;
    return JSON.stringify({ version: 1, state: { ...defaultSettingsMock, reminderNotificationsEnabled: false } });
  };
  try {
    const hydration = useSettingsStore.persist.rehydrate();
    assert.equal(useSettingsStore.persist.hasHydrated(), false);
    const action = responderNotificacao(response({ lembreteId: 'agua', ocorrencia: 'agua@2026-11-03T09:00' }, 'adiar'));
    await new Promise(setImmediate);
    assert.equal(scheduled.size, 0);
    release();
    await Promise.all([hydration, action]);
    assert.equal(scheduled.size, 0);
    assert.equal(useSettingsStore.getState().reminderNotificationsEnabled, false);
  } finally {
    storage.getItem = getItem;
  }
});


test('merge: migra avisos legados e preserva dicas desativadas', async () => {
  assert.equal(restoreSettings({ reminderAlerts: false }).reminderNotificationsEnabled, false);
  assert.equal(restoreSettings({ reminderAlerts: false, reminderNotificationsEnabled: true }).reminderNotificationsEnabled, true);
  assert.equal(restoreSettings({ showExerciseHints: false }).showExerciseHints, false);
  await flushWrites();
  memory.set('lembri-settings', JSON.stringify({ version: 0, state: {
    reminderAlerts: false, showExerciseHints: false, isLargeText: true,
  } }));
  await useSettingsStore.persist.rehydrate();
  assert.equal(useSettingsStore.getState().reminderNotificationsEnabled, false);
  assert.equal(useSettingsStore.getState().showExerciseHints, false);
  assert.equal(useSettingsStore.getState().textScaleFactor, TextScale.large);
  await flushWrites();
  const saved = JSON.parse(memory.get('lembri-settings')).state;
  assert.equal('reminderAlerts' in saved, false);
  assert.equal(saved.showExerciseHints, false);
});

test('merge: apagar dados restaura dicas e avisos mantendo boas-vindas e limite', () => {
  useSettingsStore.setState({
    hasSeenSplash: true, reminderLimit: 17, showExerciseHints: false,
    reminderNotificationsEnabled: false, exerciseNotificationsEnabled: true,
  });
  fromSource('utils/apagar-dados.ts').apagarTodosOsDados();
  const settings = useSettingsStore.getState();
  assert.equal(settings.showExerciseHints, true);
  assert.equal(settings.reminderNotificationsEnabled, true);
  assert.equal(settings.exerciseNotificationsEnabled, false);
  assert.equal(settings.hasSeenSplash, true);
  assert.equal(settings.reminderLimit, 17);
  assert.deepEqual(useLembretesStore.getState().lembretes, []);
  useSettingsStore.setState({ ...defaultSettingsMock, textScaleFactor: TextScale.normal });
});

test('merge: regressões de stores e comandos de voz recebidos de main', () => {
  fromSource('stores/__tests__/stores.test.ts');
  fromSource('utils/__tests__/reconhecer-comando.test.ts');
});
