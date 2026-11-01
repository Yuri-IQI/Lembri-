import { router } from 'expo-router';
import { useCallback } from 'react';

import { useSairSemSalvar } from '@/hooks/formulario/use-sair-sem-salvar';
import { useExerciciosStore } from '@/stores/useExerciciosStore';
import type { Exercicio, RodadaExercicio, SessaoExercicio } from '@/types/exercicio';

export interface UseSessaoExercicioOpcoes {
  /** Se verdadeiro, exige confirmação ao tentar sair (padrão true). */
  confirmarSaida?: boolean;
}

export interface UseSessaoExercicioRetorno {
  sessao: SessaoExercicio | null;
  exercicio: Exercicio | null;
  rodadaAtual: RodadaExercicio | null;
  indiceRodada: number;
  totalRodadas: number;
  sessaoValida: boolean;
  pedirSaida: () => boolean;
  dialogoSaida: {
    visivel: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
  };
  descartarSessao: () => void;
}

/**
 * Hook centralizador da sessão ativa de exercício cognitivo.
 * Conecta a store de exercícios, recupera os dados da rodada corrente e intercepta
 * ações de navegação para trás com diálogo de confirmação (WCAG 3.3.6).
 *
 * @param opcoes - Opções de configuração da sessão.
 * @returns Dados da sessão, do exercício e controle do diálogo de saída.
 */
export function useSessaoExercicio(
  opcoes: UseSessaoExercicioOpcoes = {}
): UseSessaoExercicioRetorno {
  const { confirmarSaida = true } = opcoes;

  const sessao = useExerciciosStore((state) => state.sessao);
  const exercicios = useExerciciosStore((state) => state.exercicios);
  const descartarSessao = useExerciciosStore((state) => state.descartarSessao);

  const exercicio = sessao
    ? exercicios.find((item) => item.id === sessao.exercicioId) ?? null
    : null;

  const sessaoValida = Boolean(sessao && exercicio);

  const aoSairConfirmado = useCallback(() => {
    descartarSessao();
    router.back();
  }, [descartarSessao]);

  const { pedirSaida, dialogo } = useSairSemSalvar(
    confirmarSaida && sessaoValida,
    aoSairConfirmado
  );

  const rodadaAtual =
    sessao && exercicio && exercicio.rodadas[sessao.rodadaAtual]
      ? exercicio.rodadas[sessao.rodadaAtual]
      : null;

  const indiceRodada = sessao?.rodadaAtual ?? 0;
  const totalRodadas = exercicio?.rodadas.length ?? 0;

  return {
    sessao,
    exercicio,
    rodadaAtual,
    indiceRodada,
    totalRodadas,
    sessaoValida,
    pedirSaida,
    dialogoSaida: dialogo,
    descartarSessao,
  };
}
