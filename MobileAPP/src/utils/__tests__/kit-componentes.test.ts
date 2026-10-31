import { Colors, PaletaTipos } from '@/constants/theme';
import type { TentativaExercicio } from '@/types/exercicio';
import { razaoDeContraste } from '@/utils/contraste';
import { corLegivelDoMatiz, hslParaHex, matizDaCor } from '@/utils/cor';
import { descreverUltimaAtividade, ultimaTentativa } from '@/utils/exercicio';
import { ajustarHorario } from '@/utils/horario';

// Asserções leves sem dependência de runner ou tipos externos de Node
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

assert.ok = (condition: unknown, message?: string): asserts condition => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message ?? 'Value is not truthy'}`);
  }
};

// T01: Contraste da cor de perigo (Colors.onPrimary sobre Colors.danger) >= 7:1 (WCAG 2.2 AAA)
{
  const contraste = razaoDeContraste(Colors.onPrimary, Colors.danger);
  assert.ok(
    contraste >= 7,
    `Contraste branco sobre danger deve ser >= 7:1 (obtido: ${contraste.toFixed(2)})`
  );
}

// T02: Contraste de todas as cores da PaletaTipos contra Colors.text (preto) >= 7:1
{
  for (const cor of PaletaTipos) {
    const contraste = razaoDeContraste(Colors.text, cor.corHex);
    assert.ok(
      contraste >= 7,
      `Cor ${cor.nome} (${cor.corHex}) deve ter contraste >= 7:1 contra o texto (obtido: ${contraste.toFixed(2)})`
    );
  }
}

// T03: ajustarHorario com wrap de horas sem alterar minutos
{
  const avancado = ajustarHorario('23:00', 'hora', 1);
  assert.strictEqual(avancado, '00:00', '23:00 + 1 hora deve dar a volta para 00:00');

  const recuado = ajustarHorario('00:00', 'hora', -1);
  assert.strictEqual(recuado, '23:00', '00:00 - 1 hora deve dar a volta para 23:00');
}

// T04: ajustarHorario com wrap de minutos em passos de 5 sem alterar horas
{
  const avancado = ajustarHorario('08:55', 'minuto', 1, 5);
  assert.strictEqual(
    avancado,
    '08:00',
    '08:55 + 5 minutos deve dar a volta para 08:00 mantendo a hora intacta'
  );

  const recuado = ajustarHorario('08:00', 'minuto', -1, 5);
  assert.strictEqual(
    recuado,
    '08:55',
    '08:00 - 5 minutos deve dar a volta para 08:55 mantendo a hora intacta'
  );
}

// T05: ajustarHorario com entrada inválida (normaliza a partir de 00:00)
{
  const resultado = ajustarHorario('abc', 'hora', 1);
  assert.strictEqual(
    resultado,
    '01:00',
    'Entrada inválida deve ser normalizada para 00:00 antes de aplicar o delta'
  );
}

// T06: ultimaTentativa com histórico fora de ordem
{
  const historicoDesordenado: TentativaExercicio[] = [
    {
      id: 't-1',
      exercicioId: 'ex-sequencias',
      dataHora: '2026-10-28T10:00:00.000Z',
      tempoGastoSegundos: 60,
      acertos: 5,
      totalQuestoes: 5,
      pontuacaoPercentual: 100,
    },
    {
      id: 't-3',
      exercicioId: 'ex-sequencias',
      dataHora: '2026-10-30T15:30:00.000Z',
      tempoGastoSegundos: 90,
      acertos: 4,
      totalQuestoes: 5,
      pontuacaoPercentual: 80,
    },
    {
      id: 't-2',
      exercicioId: 'ex-sequencias',
      dataHora: '2026-10-29T12:00:00.000Z',
      tempoGastoSegundos: 70,
      acertos: 5,
      totalQuestoes: 5,
      pontuacaoPercentual: 100,
    },
    {
      id: 't-outro',
      exercicioId: 'ex-outro',
      dataHora: '2026-10-31T18:00:00.000Z',
      tempoGastoSegundos: 50,
      acertos: 5,
      totalQuestoes: 5,
      pontuacaoPercentual: 100,
    },
  ];

  const maisRecente = ultimaTentativa(historicoDesordenado, 'ex-sequencias');
  assert.ok(maisRecente, 'Deve encontrar a tentativa');
  assert.strictEqual(
    maisRecente.id,
    't-3',
    'Deve selecionar a tentativa com maior dataHora do exercício especificado'
  );
}

// T07: descreverUltimaAtividade quando não há tentativas
{
  const agora = new Date(2026, 9, 31, 14, 0, 0);
  const descricao = descreverUltimaAtividade(undefined, agora);
  assert.strictEqual(descricao, 'Ainda não praticado');
}

// T08: descreverUltimaAtividade com tentativa de ontem às 09:15
{
  const agora = new Date(2026, 9, 31, 14, 0, 0);
  const dataOntem = new Date(2026, 9, 30, 9, 15, 0);
  const tentativaOntem: TentativaExercicio = {
    id: 't-ontem',
    exercicioId: 'ex-1',
    dataHora: dataOntem.toISOString(),
    tempoGastoSegundos: 120,
    acertos: 5,
    totalQuestoes: 5,
    pontuacaoPercentual: 100,
  };

  const descricao = descreverUltimaAtividade(tentativaOntem, agora);
  assert.strictEqual(descricao, 'Última atividade: ontem às 09:15');
}

// Cores da faixa de matizes: texto preto sempre com contraste AAA
{
  for (let matiz = 0; matiz < 360; matiz += 5) {
    const cor = corLegivelDoMatiz(matiz);
    assert.ok(razaoDeContraste(Colors.text, cor) >= 7, `matiz ${matiz} (${cor}) abaixo de 7:1`);
  }
  assert.strictEqual(hslParaHex(0, 1, 0.5), '#FF0000');
  assert.strictEqual(hslParaHex(240, 1, 0.5), '#0000FF');
  assert.strictEqual(Math.round(matizDaCor('#00FF00')), 120);
}
