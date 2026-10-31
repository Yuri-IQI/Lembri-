import { LIMITE_LEMBRETES_PADRAO } from '@/constants/limites';
import { criarLembreteMock } from '@/mocks/lembretes.mock';
import { ocorrenciasDoDia, statusCompromisso } from '@/stores/agenda-lembretes';
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { LembreteCompromisso, RegistroFeito } from '@/types/lembrete';
import { dadosDoLembrete, dadosIniciais } from '@/utils/dados-iniciais';
import { formatarDose, lerDose } from '@/utils/dose';
import { lerDataDigitada, mascararData, mascararHorario } from '@/utils/mascara';
import { chaveData } from '@/utils/data';
import { descreverAgenda, ocorreNoDia, rotuloFeito } from '@/utils/lembrete';
import { migrarLembrete } from '@/utils/migrar-lembrete';
import { normalizarDados } from '@/utils/normalizar-lembrete';
import { buscarSugestoes, esquecerSugestao, registrarSugestoes } from '@/utils/sugestoes';
import { LIMITE_PASSOS, primeiroErro, validarLembrete } from '@/utils/validar-lembrete';

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message ?? 'Condition not met'}`);
  }
}

const igual = (actual: unknown, expected: unknown, message?: string) => {
  if (actual !== expected) {
    throw new Error(`Assertion failed: [${actual}] !== [${expected}]. ${message ?? ''}`);
  }
};

const sexta = new Date(2026, 9, 30, 9, 0);

// TL-01: lembrete antigo vira Livre e 7 dias viram "todo dia"
{
  const migrado = migrarLembrete({
    id: 'antigo',
    titulo: 'Antigo',
    horarios: ['08:00'],
    dias: [0, 1, 2, 3, 4, 5, 6],
    ativo: true,
    criadoEm: '2026-10-01T10:00:00.000Z',
  });
  assert(migrado.template === 'livre', 'Deve virar Livre');
  igual(migrado.repeticao.modo, 'todo_dia');
  igual(migrado.exigeConfirmacao, false);

  const parcial = migrarLembrete({ ...migrado, id: 'x', template: undefined } as never);
  igual(parcial.template, 'livre', 'Sem template também vira Livre');
}

// TL-02: repetição por dias, todo dia e data única
{
  const segQuaSex = criarLembreteMock({ repeticao: { modo: 'dias', dias: [1, 3, 5] } });
  igual(ocorreNoDia(segQuaSex, sexta), true, 'Sexta está entre os dias');
  igual(ocorreNoDia(segQuaSex, new Date(2026, 9, 31)), false, 'Sábado não está');

  const unico = criarLembreteMock({ repeticao: { modo: 'nao_repete', data: '2026-10-30' } });
  igual(ocorreNoDia(unico, sexta), true);
  igual(ocorreNoDia(unico, new Date(2026, 10, 6)), false, 'Não repete na semana seguinte');
  igual(descreverAgenda(unico), 'Só em 30/10/2026');
}

// TL-03: compromisso gera uma ocorrência e muda de status depois da data
{
  const compromisso: LembreteCompromisso = {
    id: 'c1',
    template: 'compromisso',
    titulo: 'Consulta',
    data: chaveData(sexta),
    horario: '14:30',
    avisarAntes: ['1h'],
    participantes: [],
    oQueLevar: [],
    tipoIds: [],
    exigeConfirmacao: false,
    ativo: true,
    criadoEm: '',
    atualizadoEm: '',
  };
  const ocorrencias = ocorrenciasDoDia([compromisso], sexta);
  igual(ocorrencias.length, 1);
  igual(ocorrencias[0].chave, 'c1@2026-10-30T14:30');

  igual(statusCompromisso(compromisso, [], sexta), 'agendado');
  const depois = new Date(2026, 9, 30, 15, 0);
  igual(statusCompromisso(compromisso, [], depois), 'nao_confirmado');
  const registro: RegistroFeito = {
    chave: ocorrencias[0].chave,
    lembreteId: 'c1',
    previstoPara: '',
    feitoEm: '',
    origem: 'celular',
  };
  igual(statusCompromisso(compromisso, [registro], depois), 'concluido');
  igual(rotuloFeito(compromisso), 'Fiz');
}

// TL-04: normalização limpa listas e força confirmação no remédio
{
  const remedio = normalizarDados({
    template: 'remedio',
    titulo: '  Losartana ',
    quantidade: { valor: 1, unidade: 'comprimido' },
    horarios: ['20:00', '08:00', '20:00'],
    repeticao: { modo: 'dias', dias: [5, 1, 5] },
    comoTomar: 'Tanto faz',
    iniciadoEm: '2026-10-01',
    reavisoMin: 10,
    observacao: '   ',
    tipoIds: [],
    exigeConfirmacao: false,
  });
  assert(remedio.template === 'remedio');
  igual(remedio.titulo, 'Losartana');
  igual(remedio.horarios.join(','), '08:00,20:00');
  assert(remedio.repeticao.modo === 'dias');
  igual(remedio.repeticao.dias.join(','), '1,5');
  igual(remedio.observacao, undefined);
  igual(remedio.exigeConfirmacao, true, 'Remédio sempre exige confirmação');
}

// TL-05: sugestões sem duplicar por maiúsculas e acentos, busca e esquecer
{
  let sugestoes = registrarSugestoes([], ['joão', ' ', 'Ana'], '2026-10-01T10:00:00.000Z');
  sugestoes = registrarSugestoes(sugestoes, ['João'], '2026-10-02T10:00:00.000Z');
  igual(sugestoes.length, 2, 'Não duplica nem guarda vazio');
  igual(sugestoes[0].valor, 'João', 'Guarda a grafia mais recente');
  igual(sugestoes[0].vezes, 2);

  igual(buscarSugestoes(sugestoes, 'jo')[0]?.valor, 'João', '"jo" encontra "João"');
  igual(buscarSugestoes(sugestoes, 'JOAO').length, 1, 'Busca sem acento e maiúscula');
  igual(esquecerSugestao(sugestoes, 'joao').length, 1, 'Esquecer remove');

  const muitas = Array.from({ length: 35 }, (_, i) => `Item ${i}`);
  igual(registrarSugestoes([], muitas, '2026-10-01T10:00:00.000Z').length, 30, 'Limite de 30');
}

// TL-06: limite de lembretes bloqueia a criação
{
  useLembretesStore.getState().resetarParaMocks();
  const total = useLembretesStore.getState().lembretes.length;
  useSettingsStore.getState().setReminderLimit(total);
  const recusado = useLembretesStore.getState().adicionarLembrete({
    template: 'livre',
    titulo: 'Além do limite',
    horarios: ['08:00'],
    repeticao: { modo: 'todo_dia' },
    tipoIds: [],
    exigeConfirmacao: false,
  });
  igual(recusado, null, 'Deve recusar ao atingir o limite');
  igual(useLembretesStore.getState().lembretes.length, total);

  useSettingsStore.getState().setReminderLimit(1000);
  igual(
    useSettingsStore.getState().reminderLimit,
    500,
    'Limite fica dentro da faixa de desenvolvimento'
  );
  useSettingsStore.getState().setReminderLimit(LIMITE_LEMBRETES_PADRAO);
}

// TL-07: validação por template
{
  const hoje = new Date(2026, 9, 30, 9, 0);
  const remedio = dadosIniciais('remedio', [], hoje);
  const errosRemedio = validarLembrete(remedio, hoje);
  igual(primeiroErro(errosRemedio), 'titulo', 'Nome do remédio é o primeiro erro');
  assert(remedio.template === 'remedio');
  const semDose = validarLembrete({ ...remedio, quantidade: { valor: 0, unidade: '' } }, hoje);
  igual(primeiroErro(semDose), 'titulo');
  assert(semDose.quantidade, 'Remédio sem quantidade e medida dá erro');
  assert(validarLembrete({ ...remedio, horarios: [] }, hoje).horarios, 'Sem horário dá erro');
  assert(
    validarLembrete({ ...remedio, horarios: ['08:00', '08:00'] }, hoje).horarios,
    'Horário repetido dá erro'
  );
  igual(
    validarLembrete({ ...remedio, iniciadoEm: '2026-10-31' }, hoje).iniciadoEm,
    'A data de início não pode ser depois de hoje.'
  );

  const livre = { ...dadosIniciais('livre', [], hoje), titulo: 'X', horarios: ['10:00'] };
  assert(livre.template === 'livre');
  igual(Object.keys(validarLembrete(livre, hoje)).length, 0, 'Livre de hoje é válido');
  igual(
    validarLembrete({ ...livre, repeticao: { modo: 'dias', dias: [] } }, hoje).dias,
    'Escolha pelo menos um dia.'
  );
  const ontem = { ...livre, repeticao: { modo: 'nao_repete' as const, data: '2026-10-29' } };
  assert(validarLembrete(ontem, hoje).dataRepeticao, 'Data passada dá erro ao criar');
  igual(
    validarLembrete(ontem, hoje, ontem).dataRepeticao,
    undefined,
    'Mas não ao editar sem mudar'
  );

  const compromisso = dadosIniciais('compromisso', [], hoje);
  assert(compromisso.template === 'compromisso');
  const errosCompromisso = validarLembrete(
    { ...compromisso, titulo: 'Exame', data: '', horario: '' },
    hoje
  );
  assert(errosCompromisso.data && errosCompromisso.horario, 'Compromisso exige data e horário');
  igual(
    Object.keys(
      validarLembrete(
        { ...compromisso, titulo: 'Exame', data: '2026-10-30', horario: '10:00' },
        hoje
      )
    ).length,
    0,
    'Hoje, mais tarde, é válido'
  );
  assert(
    validarLembrete({ ...compromisso, titulo: 'Exame', data: '2026-10-30', horario: '08:00' }, hoje)
      .horario,
    'Horário que já passou dá erro'
  );

  const tarefa = { ...dadosIniciais('tarefa', [], hoje), titulo: 'T', horarios: ['10:00'] };
  assert(tarefa.template === 'tarefa');
  const passos = Array.from({ length: LIMITE_PASSOS + 1 }, (_, i) => `Passo ${i}`);
  assert(validarLembrete({ ...tarefa, passos }, hoje).passos, 'Mais de 10 passos dá erro');
}

// TL-08: criar por template e editar sem trocar o template
{
  useLembretesStore.getState().resetarParaMocks();
  const base = dadosIniciais('remedio', [], sexta);
  assert(base.template === 'remedio');
  const criado = useLembretesStore.getState().adicionarLembrete({
    ...base,
    titulo: 'Dipirona',
    horarios: ['08:00'],
    tipoIds: [],
    exigeConfirmacao: false,
  });
  assert(criado?.template === 'remedio');
  igual(criado.exigeConfirmacao, true, 'Remédio é salvo exigindo confirmação');

  useLembretesStore.getState().editarLembrete(criado.id, {
    ...dadosDoLembrete(criado),
    titulo: 'Dipirona 500',
  });
  const editado = useLembretesStore.getState().lembretes.find((l) => l.id === criado.id);
  igual(editado?.titulo, 'Dipirona 500');

  useLembretesStore.getState().editarLembrete(criado.id, {
    template: 'livre',
    titulo: 'Trocado',
    horarios: ['08:00'],
    repeticao: { modo: 'todo_dia' },
    tipoIds: [],
    exigeConfirmacao: false,
  });
  const mantido = useLembretesStore.getState().lembretes.find((l) => l.id === criado.id);
  igual(mantido?.template, 'remedio', 'Edição não troca o template');
  igual(mantido?.titulo, 'Dipirona 500');
}

// TL-09: remédios salvos com códigos antigos passam a usar texto
{
  const antigo = migrarLembrete({
    ...criarLembreteMock({}),
    template: 'remedio',
    quantidade: { valor: 2, unidade: 'capsula' },
    comoTomar: 'com_refeicao',
    horarios: ['08:00'],
    repeticao: { modo: 'todo_dia' },
    iniciadoEm: '2026-10-01',
    reavisoMin: 10,
    tipoIds: undefined,
    tipoId: 'tipo-saude',
    exigeConfirmacao: true,
  } as never);
  assert(antigo.template === 'remedio');
  igual(antigo.tipoIds.join(), 'tipo-saude');
  igual('tipoId' in antigo, false);
  igual(antigo.quantidade.unidade, 'cápsula');
  igual(antigo.comoTomar, 'Com refeição');
  igual(formatarDose(antigo.quantidade.valor, antigo.quantidade.unidade), '2 cápsulas');
  igual(lerDose('1,5'), 1.5);
  igual(lerDose('abc'), 0);
}

// TL-10: máscaras de horário e data digitados
{
  igual(mascararHorario('1830'), '18:30');
  igual(mascararHorario('18:'), '18', 'Apagar os dois pontos não trava a digitação');
  igual(mascararHorario('18a3099'), '18:30');
  igual(mascararData('01112026'), '01/11/2026');
  igual(mascararData('0111'), '01/11');
  igual(lerDataDigitada('01/11/2026'), '2026-11-01');
  igual(lerDataDigitada('31/02/2026'), null, 'Data que não existe');
  igual(lerDataDigitada('01/11'), null, 'Data incompleta');
}
