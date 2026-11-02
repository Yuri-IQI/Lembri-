import type { ComandoVoz } from '@/types/comando-voz';
import { normalizarBusca } from '@/utils/texto';

export type ResultadoVoz =
  | { tipo: 'comando'; comando: ComandoVoz }
  | { tipo: 'opcoes'; opcoes: ComandoVoz[] }
  | { tipo: 'nenhum' };

const PALAVRAS_IGNORADAS = new Set(
  'a o as os ao de do da dos das para pra pro por em no na e um uma me eu quero queria ir vai vamos abrir abre abra mostrar mostra mostre ver tela aba pagina favor'.split(
    ' '
  )
);

const palavras = (texto: string) =>
  normalizarBusca(texto)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((palavra) => palavra && !PALAVRAS_IGNORADAS.has(palavra))
    .map((palavra) => (palavra.length > 3 ? palavra.replace(/s$/, '') : palavra));

const frasesDe = (comando: ComandoVoz) => comando.frases.map(palavras);

const buscarCompletos = (falado: string[], comandos: ComandoVoz[]) => {
  const pontuados = comandos.map((comando) => ({
    comando,
    pontos: Math.max(
      0,
      ...frasesDe(comando)
        .filter((frase) => frase.every((palavra) => falado.includes(palavra)))
        .map((frase) => frase.length)
    ),
  }));
  const melhor = Math.max(0, ...pontuados.map((item) => item.pontos));
  return melhor === 0
    ? []
    : pontuados.filter((item) => item.pontos === melhor).map((item) => item.comando);
};

const buscarParciais = (falado: string[], comandos: ComandoVoz[]) =>
  comandos.filter((comando) =>
    frasesDe(comando).some((frase) => falado.every((palavra) => frase.includes(palavra)))
  );

const reconhecerFala = (fala: string, tela: ComandoVoz[], gerais: ComandoVoz[]): ResultadoVoz => {
  const falado = palavras(fala);
  if (falado.length === 0) return { tipo: 'nenhum' };

  const buscas = [
    () => buscarCompletos(falado, tela),
    () => buscarCompletos(falado, gerais),
    () => buscarParciais(falado, tela),
    () => buscarParciais(falado, gerais),
  ];
  for (const buscar of buscas) {
    const achados = buscar();
    if (achados.length === 1) return { tipo: 'comando', comando: achados[0] };
    if (achados.length > 1) return { tipo: 'opcoes', opcoes: achados };
  }
  return { tipo: 'nenhum' };
};

export const reconhecerComando = (
  falas: string[],
  tela: ComandoVoz[],
  gerais: ComandoVoz[]
): ResultadoVoz => {
  for (const fala of falas) {
    const resultado = reconhecerFala(fala, tela, gerais);
    if (resultado.tipo !== 'nenhum') return resultado;
  }
  return { tipo: 'nenhum' };
};
