export type ComandoVoz = {
  id: string;
  rotulo: string;
  frases: string[];
  executar: () => void;
};

export type ContextoVoz = {
  voltar?: () => void;
  saidaProtegida: boolean;
};
