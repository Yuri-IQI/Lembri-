import { useExerciciosStore } from '../useExerciciosStore';
import { useLembretesStore } from '../useLembretesStore';
import { useSettingsStore } from '../useSettingsStore';
import { useTiposLembreteStore } from '../useTiposLembreteStore';
import { apagarTodosOsDados } from '../../utils/dados/apagar-dados';
import { dadosIniciais } from '../../utils/dados/dados-iniciais';
import {
  avaliarCasa,
  calcularStreak,
  corrigirRodada,
  embaralhar,
  estatisticasDoExercicio,
  resultadoDaSessao,
} from '../../utils/exercicio/exercicio';
import { gerarRodadas } from '../../utils/exercicio/gerar-rodadas';
import { filtrarLembretes } from '../../utils/lembrete/lembrete';
import type { Lembrete } from '../../types/lembrete';
import { criarTentativaMock } from '../../mocks/historico-tentativas.mock';

if (typeof globalThis.window === 'undefined') {
  const memoryStore = new Map<string, string>();
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: {
      getItem: (key: string) => memoryStore.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memoryStore.set(key, value);
      },
      removeItem: (key: string) => {
        memoryStore.delete(key);
      },
      clear: () => {
        memoryStore.clear();
      },
      key: (index: number) => Array.from(memoryStore.keys())[index] ?? null,
      get length() {
        return memoryStore.size;
      },
    },
  };
}

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message ?? 'Condition not met'}`);
  }
}

assert.strictEqual = (actual: unknown, expected: unknown, message?: string) => {
  if (actual !== expected) {
    throw new Error(`Assertion failed: [${actual}] !== [${expected}]. ${message ?? ''}`);
  }
};

assert.ok = (condition: unknown, message?: string) => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message ?? 'Value is not truthy'}`);
  }
};

useLembretesStore.getState().resetarParaMocks();
useTiposLembreteStore.getState().resetarParaMocks();
useExerciciosStore.getState().resetarParaMocks();

{
  const totalAntes = useLembretesStore.getState().lembretes.length;
  const novo = useLembretesStore.getState().adicionarLembrete({
    template: 'livre',
    titulo: 'Lembrete Unitário',
    horarios: ['15:30'],
    repeticao: { modo: 'dias', dias: [1, 3, 5] },
    tipoIds: ['tipo-saude'],
  });
  assert(novo, 'Deve criar dentro do limite');

  const estado = useLembretesStore.getState();
  assert.strictEqual(
    estado.lembretes.length,
    totalAntes + 1,
    'Deve incrementar o total de lembretes'
  );
  assert.strictEqual(estado.lembretes[0].id, novo.id, 'Novo item deve estar no início da lista');
  assert.strictEqual(estado.lembretes[0].titulo, 'Lembrete Unitário');
  assert.strictEqual(estado.lembretes[0].ativo, true, 'Deve iniciar programado');
}

{
  const primeiro = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().editarLembrete(primeiro.id, {
    template: 'livre',
    titulo: 'Título Atualizado',
    horarios: ['17:00', '08:00', '17:00'],
    repeticao: { modo: 'todo_dia' },
    tipoIds: [],
  });

  const atualizado = useLembretesStore.getState().lembretes.find((l) => l.id === primeiro.id);
  assert.ok(atualizado, 'Item deve existir');
  assert.strictEqual(atualizado?.titulo, 'Título Atualizado', 'Título deve ser alterado');
  assert(atualizado?.template === 'livre', 'Template deve ser mantido');
  assert.strictEqual(
    atualizado.horarios.join(','),
    '08:00,17:00',
    'Horários devem ser alterados e ordenados'
  );
}

{
  const primeiro = useLembretesStore.getState().lembretes[0];
  const totalAntes = useLembretesStore.getState().lembretes.length;

  useLembretesStore.getState().removerLembrete(primeiro.id);
  assert.strictEqual(
    useLembretesStore.getState().lembretes.length,
    totalAntes - 1,
    'Deve remover da lista ativa'
  );
  assert.strictEqual(
    useLembretesStore.getState().ultimoExcluido?.id,
    primeiro.id,
    'Deve guardar em ultimoExcluido'
  );

  useLembretesStore.getState().desfazerExclusao();
  assert.strictEqual(
    useLembretesStore.getState().lembretes.length,
    totalAntes,
    'Deve restaurar o item na lista'
  );
  assert.strictEqual(
    useLembretesStore.getState().ultimoExcluido,
    null,
    'ultimoExcluido deve ser limpo'
  );
}

{
  const tipo = useTiposLembreteStore.getState().adicionarTipo({
    nome: 'Tipo Especial',
    corHex: '#123456',
  });

  const lembreteVinculado = useLembretesStore.getState().adicionarLembrete({
    template: 'livre',
    titulo: 'Com tipo especial',
    horarios: ['12:00'],
    repeticao: { modo: 'todo_dia' },
    tipoIds: [tipo.id],
  });
  assert(lembreteVinculado, 'Deve criar dentro do limite');

  useTiposLembreteStore.getState().removerTipo(tipo.id);
  const tipoAposRemocao = useTiposLembreteStore.getState().obterTipoPorId(tipo.id);
  assert.strictEqual(tipoAposRemocao, undefined, 'Tipo deve ser removido da store de tipos');

  const lembreteApos = useLembretesStore
    .getState()
    .lembretes.find((l) => l.id === lembreteVinculado.id);
  assert.ok(lembreteApos, 'Lembrete não deve ser excluído');
  assert.strictEqual(lembreteApos?.tipoIds.length, 0, 'Lembrete deve ter o tipo desassociado');
}

{
  const lembrete = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().alternarAtivo(lembrete.id);
  const pausado = useLembretesStore.getState().lembretes.find((l) => l.id === lembrete.id);
  assert.strictEqual(pausado?.ativo, false, 'Deve ficar pausado');

  useLembretesStore.getState().alternarAtivo(lembrete.id);
  const reativado = useLembretesStore.getState().lembretes.find((l) => l.id === lembrete.id);
  assert.strictEqual(reativado?.ativo, true, 'Deve voltar a ficar programado');
}

{
  const lembrete = useLembretesStore.getState().lembretes[0];
  const ocorrencia = {
    chave: `${lembrete.id}@2026-10-29T09:00`,
    lembrete,
    horario: '09:00',
    quando: new Date(2026, 9, 29, 9, 0),
  };
  useLembretesStore.getState().marcarFeito(ocorrencia);
  useLembretesStore.getState().marcarFeito(ocorrencia);
  assert.strictEqual(useLembretesStore.getState().registros.length, 1, 'Deve registrar uma vez só');

  useLembretesStore.getState().desmarcarFeito(ocorrencia.chave);
  assert.strictEqual(useLembretesStore.getState().registros.length, 0, 'Deve desfazer o registro');
}

{
  const agora = new Date(2026, 9, 30, 10, 0);
  const h1 = [
    criarTentativaMock({ dataHora: new Date(2026, 9, 30, 9, 0).toISOString() }),
    criarTentativaMock({ dataHora: new Date(2026, 9, 29, 9, 0).toISOString() }),
    criarTentativaMock({ dataHora: new Date(2026, 9, 28, 9, 0).toISOString() }),
  ];
  assert.strictEqual(calcularStreak(h1, agora), 3, 'Streak com hoje+ontem+anteontem deve ser 3');

  const h2 = [
    criarTentativaMock({ dataHora: new Date(2026, 9, 30, 9, 0).toISOString() }),
    criarTentativaMock({ dataHora: new Date(2026, 9, 28, 9, 0).toISOString() }),
  ];
  assert.strictEqual(calcularStreak(h2, agora), 1, 'Streak com buraco deve contar apenas 1');

  assert.strictEqual(calcularStreak([], agora), 0, 'Streak vazio deve ser 0');

  const h3 = [
    criarTentativaMock({ dataHora: new Date(2026, 9, 30, 9, 0).toISOString() }),
    criarTentativaMock({ dataHora: new Date(2026, 9, 30, 15, 0).toISOString() }),
    criarTentativaMock({ dataHora: new Date(2026, 9, 29, 9, 0).toISOString() }),
  ];
  assert.strictEqual(calcularStreak(h3, agora), 2, 'Várias tentativas no mesmo dia contam como 1 dia');
}

{
  const rodada = {
    id: 'seq-1',
    rotulo: 'SEQUÊNCIA',
    itens: ['80', '32', '12', '67', '55'],
  };
  const respostas = ['80', '99', '99', '99', '99'];
  const res = corrigirRodada(rodada, respostas);
  assert.strictEqual(res.acertos, 1, 'Deve acertar 1');
  assert.strictEqual(res.total, 5, 'Total deve ser 5');
  assert.strictEqual(res.percentual, 20, 'Percentual deve ser 20%');
  assert.strictEqual(res.casas[0], true, 'Primeira casa deve ser true');
  assert.strictEqual(res.casas[1], false, 'Segunda casa deve ser false');
}

{
  const exercicio = useExerciciosStore.getState().exercicios[0];
  const sessao = {
    exercicioId: exercicio.id,
    inicio: new Date().toISOString(),
    rodadaAtual: 0,
    respostas: [
      ['80', '99', '99', '99', '99'],
      ['02', '04', '05', '06', '02'],
      ['01', '02', '03', '05', '11'],
    ],
    opcoes: [],
    tentativaId: null,
  };
  const res = resultadoDaSessao(exercicio, sessao);
  assert.strictEqual(res.acertos, 11, 'Total de acertos deve ser 11');
  assert.strictEqual(res.total, 15, 'Total de questões deve ser 15');
  assert.strictEqual(res.percentual, 73, 'Percentual deve ser 73%');
}

{
  const itens = ['A', 'B', 'C', 'D'];
  let seed = 0.5;
  const gerador = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const embaralhado = embaralhar(itens, gerador);
  assert.strictEqual(itens.length, 4, 'Original deve permanecer com tamanho 4');
  assert.strictEqual(itens.join(','), 'A,B,C,D', 'Original deve estar intacto');
  assert.strictEqual(embaralhado.length, 4, 'Embaralhado deve ter tamanho 4');
  assert(embaralhado.includes('A') && embaralhado.includes('D'), 'Deve conter os mesmos elementos');
}

{
  useExerciciosStore.getState().resetarParaMocks();
  const totalHistoricoAntes = useExerciciosStore.getState().historico.length;
  const ex = useExerciciosStore.getState().exercicios[0];

  useExerciciosStore.getState().iniciarSessao(ex.id);
  const sessaoAtiva = useExerciciosStore.getState().sessao;
  assert.ok(sessaoAtiva, 'Sessão deve ser iniciada');
  assert.strictEqual(sessaoAtiva?.rodadaAtual, 0, 'Rodada inicial deve ser 0');

  const rodadasSorteadas = useExerciciosStore
    .getState()
    .exercicios.find((item) => item.id === ex.id)!.rodadas;
  assert.strictEqual(rodadasSorteadas.length, 3, 'Devem ser sorteadas 3 rodadas');

  const rodadasPalavras = gerarRodadas('exercicio-5')!;
  assert.ok(
    rodadasPalavras.every((rodada) => rodada.itens.length === 4),
    'Sequência de palavras deve ter 4 palavras por rodada'
  );
  assert.ok(
    rodadasPalavras.every(
      (r) => new Set([...r.itens, ...(r.distratores ?? [])]).size === 7
    ),
    'As opções de uma frase não devem se repetir'
  );
  assert.ok(
    rodadasPalavras.every((r) => r.itens.every((palavra) => palavra.length >= 3)),
    'Frases não devem ter artigos nem termos curtos'
  );

  for (const id of ['exercicio-3', 'exercicio-4']) {
    const rodadasContexto = gerarRodadas(id)!;
    assert.strictEqual(new Set(rodadasContexto.map((r) => r.cor)).size, 3, 'Cada contexto tem sua cor');
    assert.ok(
      rodadasContexto.every((r) => r.itens.length === 4 && r.dicas?.length === 4),
      'Contexto deve ter 4 pares'
    );
    assert.ok(
      rodadasContexto.every(
        (r) => new Set([...r.itens, ...(r.distratores ?? [])]).size === 6
      ),
      'Contexto deve ter 2 opções erradas sem repetir'
    );
  }

  const rodadasOrdenacao = gerarRodadas('exercicio-2')!;
  assert.ok(
    rodadasOrdenacao.every((r) => r.numerada && r.rotulo !== 'ORDEM'),
    'Ordenação deve mostrar a atividade e a posição dos passos'
  );

  const [crescente, decrescente] = gerarRodadas('exercicio-1')!;
  assert.strictEqual(crescente.itens.join(), [...crescente.itens].sort().join(), '1ª rodada crescente');
  assert.strictEqual(
    decrescente.itens.join(),
    [...decrescente.itens].sort().reverse().join(),
    '2ª rodada decrescente'
  );

  const itensAvaliados = ['20', '40', '60'];
  assert.strictEqual(avaliarCasa('20', 0, itensAvaliados).estado, 'correta', 'Casa certa');
  assert.strictEqual(avaliarCasa('60', 0, itensAvaliados).estado, 'lugar', 'Número de outra posição');
  assert.strictEqual(avaliarCasa('60', 0, itensAvaliados).direcao, 'acima', 'Acima do alvo');
  assert.strictEqual(avaliarCasa('60', 0, itensAvaliados).posicaoCerta, 3, 'Posição certa do item');
  assert.strictEqual(avaliarCasa('15', 1, itensAvaliados).direcao, 'abaixo', 'Abaixo do alvo');
  assert.strictEqual(avaliarCasa('sol', 0, ['lua']).estado, 'errada', 'Palavra fora da rodada');
  assert.strictEqual(avaliarCasa('60', 0, itensAvaliados, false).estado, 'errada', 'Sem dicas, só errada');
  assert.strictEqual(avaliarCasa('60', 0, itensAvaliados, false).direcao, undefined, 'Sem dicas, sem direção');
  assert.strictEqual(avaliarCasa('20', 0, itensAvaliados, false).estado, 'correta', 'Sem dicas, certa continua');
  assert.strictEqual(avaliarCasa('sol', 0, ['lua']).direcao, undefined, 'Palavra não tem direção');

  assert.strictEqual(
    new Set(rodadasSorteadas[0].itens).size,
    5,
    'Os números de uma sequência não devem se repetir'
  );

  const r1 = useExerciciosStore.getState().responderRodada(rodadasSorteadas[0].itens);
  assert.strictEqual(r1?.acertos, 5, 'Rodada 1 deve ter 5 acertos');

  const temMais1 = useExerciciosStore.getState().avancarRodada();
  assert.strictEqual(temMais1, true, 'Deve avançar para rodada 2');
  useExerciciosStore.getState().responderRodada(rodadasSorteadas[1].itens);

  const temMais2 = useExerciciosStore.getState().avancarRodada();
  assert.strictEqual(temMais2, true, 'Deve avançar para rodada 3');
  useExerciciosStore.getState().responderRodada(rodadasSorteadas[2].itens);

  const tentativaGravada = useExerciciosStore.getState().concluirSessao();
  assert.ok(tentativaGravada, 'Deve retornar tentativa gravada');
  assert.strictEqual(tentativaGravada?.acertos, 15, 'Acertos totais devem ser 15');
  assert.strictEqual(tentativaGravada?.pontuacaoPercentual, 100, 'Pontuação deve ser 100%');
  assert.strictEqual(
    useExerciciosStore.getState().historico.length,
    totalHistoricoAntes + 1,
    'Deve adicionar tentativa ao histórico'
  );

  const tentativaIdempotente = useExerciciosStore.getState().concluirSessao();
  assert.strictEqual(
    tentativaIdempotente?.id,
    tentativaGravada?.id,
    'Deve retornar a mesma tentativa'
  );
  assert.strictEqual(
    useExerciciosStore.getState().historico.length,
    totalHistoricoAntes + 1,
    'Não deve duplicar histórico no segundo concluirSessao'
  );

  useExerciciosStore.getState().iniciarSessao(ex.id);
  useExerciciosStore.getState().descartarSessao();
  assert.strictEqual(useExerciciosStore.getState().sessao, null, 'Sessão deve ser nula após descartar');
}

{
  const exSemHistorico = 'exercicio-4';
  const statsVazio = estatisticasDoExercicio(useExerciciosStore.getState().historico, exSemHistorico);
  assert.strictEqual(statsVazio.ultima, undefined, 'Sem última data');
  assert.strictEqual(statsVazio.tempoMedioMin, undefined, 'Sem tempo médio');
  assert.strictEqual(statsVazio.mediaAcertos, undefined, 'Sem média de acertos');

  const exComHistorico = 'exercicio-1';
  const stats = estatisticasDoExercicio(useExerciciosStore.getState().historico, exComHistorico);
  assert.ok(stats.ultima, 'Deve ter data da última');
  assert.ok(typeof stats.tempoMedioMin === 'number', 'Deve ter tempo médio');
  assert.ok(typeof stats.mediaAcertos === 'number', 'Deve ter média de acertos');
}

{
  const lembretes = [{ titulo: 'Tomar remédio' }, { titulo: 'Caminhar' }] as Lembrete[];
  const resultado = filtrarLembretes(lembretes, 'REMEDIO');
  assert.strictEqual(resultado.length, 1, 'Deve encontrar 1 lembrete');
  assert.strictEqual(resultado[0].titulo, 'Tomar remédio', 'Deve encontrar o lembrete mesmo sem acento');
  assert.strictEqual(filtrarLembretes(lembretes, '  ').length, 2, 'Busca vazia mantém todos');
}

{
  useLembretesStore.getState().resetarParaMocks();
  useTiposLembreteStore.getState().resetarParaMocks();
  useExerciciosStore.getState().resetarParaMocks();

  assert.strictEqual(
    useLembretesStore.getState().lembretes.length,
    5,
    'Deve restaurar os 5 lembretes'
  );
  assert.strictEqual(useTiposLembreteStore.getState().tipos.length, 2, 'Deve restaurar os 2 tipos');
  assert.strictEqual(
    useExerciciosStore.getState().exercicios.length,
    6,
    'Deve restaurar os 6 exercícios, incluindo o exclusivo do relógio'
  );
}

{
  useSettingsStore.getState().setNotificationPreference('reminderNotificationsEnabled', false);
  useSettingsStore.getState().setLargeText(true);
  apagarTodosOsDados();

  assert.strictEqual(useLembretesStore.getState().lembretes.length, 0, 'Sem lembretes');
  assert.strictEqual(useLembretesStore.getState().ultimoExcluido, null, 'Sem exclusão para desfazer');
  assert.strictEqual(useExerciciosStore.getState().historico.length, 0, 'Sem histórico');
  assert.strictEqual(useExerciciosStore.getState().exercicios.length, 6, 'Mantém o catálogo');
  assert.strictEqual(useTiposLembreteStore.getState().tipos.length, 2, 'Tipos iniciais');
  assert.strictEqual(useSettingsStore.getState().reminderNotificationsEnabled, true, 'Avisos voltam ao padrão');
  assert.strictEqual(useSettingsStore.getState().isLargeText, false, 'Texto volta ao padrão');

  useLembretesStore.getState().resetarParaMocks();
  useExerciciosStore.getState().resetarParaMocks();
}

{
  useLembretesStore.getState().resetarParaMocks();
  const contador = useLembretesStore.getState().obterContadorAtivos();
  assert.strictEqual(contador.total, 5, 'Total deve ser 5');
  assert.strictEqual(contador.ativos, 4, 'Ativos devem ser 4 (1 está pausado nos mocks)');

  const contagemSaude = useLembretesStore.getState().obterContagemPorTipo('tipo-saude');
  assert.strictEqual(contagemSaude, 1, 'Deve ter 1 lembrete com tipo saúde');

  const contagemDomestica = useLembretesStore
    .getState()
    .obterContagemPorTipo('tipo-tarefas-domesticas');
  assert.strictEqual(contagemDomestica, 2, 'Deve ter 2 lembretes de tarefas domésticas');

  const remedio = useLembretesStore.getState().adicionarLembrete({
    ...dadosIniciais('remedio', ['tipo-saude'], new Date()),
    titulo: 'Vitamina C',
  });
  if (!remedio) throw new Error('Deve caber mais um lembrete');
  assert.strictEqual(remedio.template, 'remedio', 'Template deve ser remédio');
  assert.strictEqual(useLembretesStore.getState().obterContagemPorTipo('tipo-saude'), 2);

  const novoContador = useLembretesStore.getState().obterContadorAtivos();
  assert.strictEqual(novoContador.total, 6, 'Total agora deve ser 6');
  assert.strictEqual(novoContador.ativos, 5, 'Ativos agora devem ser 5');

  useLembretesStore.getState().resetarParaMocks();
}
