import { SymbolView, type AndroidSymbol, type SymbolViewProps } from 'expo-symbols';

export type MaterialSymbolProps = Omit<SymbolViewProps, 'name'> & {
  name: AndroidSymbol;
};

export function MaterialSymbol({ name, ...props }: MaterialSymbolProps) {
  return <SymbolView {...props} name={{ android: name, web: name }} />;
}
