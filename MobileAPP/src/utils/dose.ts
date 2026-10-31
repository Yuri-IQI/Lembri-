const PLURAL_UNIDADE: Record<string, string> = {
  comprimido: 'comprimidos',
  cápsula: 'cápsulas',
  gota: 'gotas',
};

/** Lê a dose digitada ("1,5" ou "1.5"); 0 quando não é um número. */
export const lerDose = (texto: string): number => {
  const numero = Number(texto.trim().replace(',', '.'));
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
};

/** "1,5" ou, com a medida, "1,5 comprimido" / "2 comprimidos". */
export const formatarDose = (valor: number, unidade?: string) => {
  const numero = String(Math.round(valor * 100) / 100).replace('.', ',');
  if (!unidade) return numero;
  const plural = valor >= 2 ? PLURAL_UNIDADE[unidade.toLowerCase()] : undefined;
  return `${numero} ${plural ?? unidade}`;
};
