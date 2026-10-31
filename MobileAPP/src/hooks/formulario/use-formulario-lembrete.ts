import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import type { DadosLembrete } from '@/types/lembrete';
import {
  primeiroErro,
  validarLembrete,
  type CampoComErro,
  type ErrosFormulario,
} from '@/utils/validar-lembrete';

/**
 * Estado de um formulário de template: valores, erros (só depois da primeira tentativa de
 * salvar), se houve alteração e a validação ao salvar.
 */
export const useFormularioLembrete = <T extends DadosLembrete>(inicial: T, original?: T) => {
  const [dados, setDados] = useState<T>(inicial);
  const [tentou, setTentou] = useState(false);

  const errosAtuais: ErrosFormulario = tentou ? validarLembrete(dados, new Date(), original) : {};

  const alterar = <K extends keyof T>(campo: K, valor: T[K]) =>
    setDados((atual) => ({ ...atual, [campo]: valor }));

  /** Devolve os dados se estiverem válidos; senão, mostra os erros e diz qual é o primeiro. */
  const validar = (): { dados: T } | { erro: CampoComErro } => {
    setTentou(true);
    const erros = validarLembrete(dados, new Date(), original);
    const campo = primeiroErro(erros);
    if (!campo) return { dados };
    AccessibilityInfo.announceForAccessibility(`Corrija: ${erros[campo]}`);
    return { erro: campo };
  };

  return {
    dados,
    alterar,
    erros: errosAtuais,
    sujo: JSON.stringify(dados) !== JSON.stringify(inicial),
    validar,
  };
};

export type FormularioLembrete<T extends DadosLembrete> = ReturnType<
  typeof useFormularioLembrete<T>
>;
