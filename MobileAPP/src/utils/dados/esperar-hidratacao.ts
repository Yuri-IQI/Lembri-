type StorePersistida = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (ouvinte: () => void) => () => void;
  };
};

export const esperarHidratacao = (store: StorePersistida) =>
  store.persist.hasHydrated()
    ? Promise.resolve()
    : new Promise<void>((pronto) => {
        const parar = store.persist.onFinishHydration(() => {
          parar();
          pronto();
        });
      });
