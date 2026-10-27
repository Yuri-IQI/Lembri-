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
    horario: '15:30',
    tipoId: 'tipo-saude',
  });

  const estado = useLembretesStore.getState();
  assert.strictEqual(estado.lembretes.length, totalAntes + 1, 'Deve incrementar o total de lembretes');
  assert.strictEqual(estado.lembretes[0].id, novo.id, 'Novo item deve estar no início da lista');
  assert.strictEqual(estado.lembretes[0].titulo, 'Lembrete Unitário');
  assert.strictEqual(estado.lembretes[0].concluido, false, 'Deve iniciar como pendente');
}

// Teste RN-02: Edição de Lembrete
{
  const primeiro = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().editarLembrete(primeiro.id, {
    titulo: 'Título Atualizado',
    horario: '17:00',
  });

  const atualizado = useLembretesStore.getState().lembretes.find((l) => l.id === primeiro.id);
  assert.ok(atualizado, 'Item deve existir');
  assert.strictEqual(atualizado?.titulo, 'Título Atualizado', 'Título deve ser alterado');
  assert.strictEqual(atualizado?.horario, '17:00', 'Horário deve ser alterado');
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
    horario: '12:00',
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

// Teste RN-05: Conclusão e Sincronização Wear OS
{
  const lembrete = useLembretesStore.getState().lembretes[0];
  useLembretesStore.getState().marcarConcluidoWear(lembrete.id);

  const concluidoWear = useLembretesStore.getState().lembretes.find((l) => l.id === lembrete.id);
  assert.strictEqual(concluidoWear?.concluido, true, 'Deve estar concluído');
  assert.strictEqual(concluidoWear?.concluidoNoWear, true, 'Deve ter flag concluidoNoWear: true');
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

  assert.strictEqual(useLembretesStore.getState().lembretes.length, 4, 'Deve restaurar os 4 lembretes');
  assert.strictEqual(useTiposLembreteStore.getState().tipos.length, 4, 'Deve restaurar as 4 categorias');
  assert.strictEqual(useExerciciosStore.getState().exercicios.length, 4, 'Deve restaurar os 4 exercícios');
}
