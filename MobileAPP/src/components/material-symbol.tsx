import { SymbolView, type AndroidSymbol, type SymbolViewProps } from 'expo-symbols';

export type MaterialSymbolProps = Omit<SymbolViewProps, 'name'> & {
  name: AndroidSymbol;
};

/** Usa o mesmo símbolo Material no Android e na web, preservando tamanho, cor e semântica. */
export function MaterialSymbol({ name, ...props }: MaterialSymbolProps) {
  return <SymbolView {...props} name={{ android: name, web: name }} />;
}
