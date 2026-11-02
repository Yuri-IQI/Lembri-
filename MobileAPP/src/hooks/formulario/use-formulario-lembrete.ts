import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import type { DadosLembrete } from '@/types/lembrete';
import {
  primeiroErro,
  validarLembrete,
  type CampoComErro,
  type ErrosFormulario,
} from '@/utils/lembrete/validar-lembrete';

export const useFormularioLembrete = <T extends DadosLembrete>(inicial: T, original?: T) => {
  const [dados, setDados] = useState<T>(inicial);
  const [tentou, setTentou] = useState(false);

  const errosAtuais: ErrosFormulario = tentou ? validarLembrete(dados, new Date(), original) : {};

  const alterar = <K extends keyof T>(campo: K, valor: T[K]) =>
    setDados((atual) => ({ ...atual, [campo]: valor }));

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
