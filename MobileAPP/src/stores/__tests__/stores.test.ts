import { useExerciciosStore } from '../useExerciciosStore';
import { useLembretesStore } from '../useLembretesStore';
import { useTiposLembreteStore } from '../useTiposLembreteStore';

// Asserções leves sem dependência de tipos de Node no runtime React Native
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

// Reset inicial para garantir isolamento
useLembretesStore.getState().resetarParaMocks();
useTiposLembreteStore.getState().resetarParaMocks();
useExerciciosStore.getState().resetarParaMocks();

// Teste RN-01: Criação de Lembrete
{
  const totalAntes = useLembretesStore.getState().lembretes.length;
  const novo = useLembretesStore.getState().adicionarLembrete({
    titulo: 'Lembrete Unitário',
    horarios: ['15:30'],
    dias: [1, 3, 5],
    tipoId: 'tipo-saude',
  });

  const estado = useLembretesStore.getState();
  assert.strictEqual(estado.lembretes.length, totalAntes + 1, 'Deve incrementar o total de lembretes');
  assert.strictEqual(estado.lembretes[0].id, novo.id, 'Novo item deve estar no início da lista');
  assert.strictEqual(estado.lembretes[0].titulo, 'Lembrete Unitário');
  assert.strictEqual(estado.lembretes[0].ativo, true, 'Deve iniciar programado');
}

// Teste RN-02: Edição de Lembrete
{
  const primeiro = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().editarLembrete(primeiro.id, {
    titulo: 'Título Atualizado',
    horarios: ['17:00', '08:00'],
  });

  const atualizado = useLembretesStore.getState().lembretes.find((l) => l.id === primeiro.id);
  assert.ok(atualizado, 'Item deve existir');
  assert.strictEqual(atualizado?.titulo, 'Título Atualizado', 'Título deve ser alterado');
  assert.strictEqual(atualizado?.horarios.join(','), '08:00,17:00', 'Horários devem ser alterados e ordenados');
}

// Teste RN-03: Exclusão Reversível (Undo)
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

  // Desfazer exclusão
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

// Teste RN-04: Exclusão de Tipo desassociando lembretes
{
  // Adiciona um tipo
  const tipo = useTiposLembreteStore.getState().adicionarTipo({
    nome: 'Tipo Especial',
    corHex: '#123456',
  });

  // Vincula a um lembrete
  const lembreteVinculado = useLembretesStore.getState().adicionarLembrete({
    titulo: 'Com tipo especial',
    horarios: ['12:00'],
    dias: [0, 1, 2, 3, 4, 5, 6],
    tipoId: tipo.id,
  });

  // Remove o tipo
  useTiposLembreteStore.getState().removerTipo(tipo.id);
  const tipoAposRemocao = useTiposLembreteStore.getState().obterTipoPorId(tipo.id);
  assert.strictEqual(tipoAposRemocao, undefined, 'Tipo deve ser removido da store de tipos');

  const lembreteApos = useLembretesStore
    .getState()
    .lembretes.find((l) => l.id === lembreteVinculado.id);
  assert.ok(lembreteApos, 'Lembrete não deve ser excluído');
  assert.strictEqual(lembreteApos?.tipoId, undefined, 'Lembrete deve ter tipoId desassociado');
}

// Teste RN-05: Pausar e reativar os alertas
{
  const lembrete = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().alternarAtivo(lembrete.id);
  const pausado = useLembretesStore.getState().lembretes.find((l) => l.id === lembrete.id);
  assert.strictEqual(pausado?.ativo, false, 'Deve ficar pausado');

  useLembretesStore.getState().alternarAtivo(lembrete.id);
  const reativado = useLembretesStore.getState().lembretes.find((l) => l.id === lembrete.id);
  assert.strictEqual(reativado?.ativo, true, 'Deve voltar a ficar programado');
}

// Teste RN-05b: "Fiz" registra no histórico, sem duplicar, e pode ser desfeito
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

// Teste RN-06: Registro de Tentativa de Exercício e Streak
{
  const exercicio = useExerciciosStore.getState().exercicios[0];
  const streakAntes = exercicio.streakDias;

  const tentativa = useExerciciosStore.getState().registrarTentativa(exercicio.id, 5, 5, 150);
  assert.strictEqual(tentativa.pontuacaoPercentual, 100, 'Pontuação deve ser 100%');

  const exercicioAtualizado = useExerciciosStore.getState().obterExercicioPorId(exercicio.id);
  assert.strictEqual(
    exercicioAtualizado?.streakDias,
    streakAntes + 1,
    'Streak de dias deve ser incrementado'
  );

  const historico = useExerciciosStore.getState().obterHistoricoPorExercicio(exercicio.id);
  assert.strictEqual(historico[0].id, tentativa.id, 'Tentativa deve estar no topo do histórico');
}

// Teste RN-07: Restauração de Fábrica (Reset)
{
  useLembretesStore.getState().resetarParaMocks();
  useTiposLembreteStore.getState().resetarParaMocks();
  useExerciciosStore.getState().resetarParaMocks();

  assert.strictEqual(useLembretesStore.getState().lembretes.length, 3, 'Deve restaurar os 3 lembretes');
  assert.strictEqual(useTiposLembreteStore.getState().tipos.length, 2, 'Deve restaurar os 2 tipos');
  assert.strictEqual(useExerciciosStore.getState().exercicios.length, 4, 'Deve restaurar os 4 exercícios');
}
