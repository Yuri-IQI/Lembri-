type StorePersistida = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (ouvinte: () => void) => () => void;
  };
};

/** Espera a store carregar do aparelho; fora das telas, como em tarefas em segundo plano. */
export const esperarHidratacao = (store: StorePersistida) =>
  store.persist.hasHydrated()
    ? Promise.resolve()
    : new Promise<void>((pronto) => {
        const parar = store.persist.onFinishHydration(() => {
          parar();
          pronto();
        });
      });
