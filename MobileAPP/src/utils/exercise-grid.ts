/** Distribui células em linhas equilibradas, respeitando a largura mínima e os espaços. */
export function getBalancedCellWidth(count: number, availableWidth: number, minimumWidth: number, gap: number): number {
  const capacity = Math.max(1, Math.floor((availableWidth + gap) / (minimumWidth + gap)));
  const rows = Math.max(1, Math.ceil(count / capacity));
  const columns = Math.max(1, Math.ceil(count / rows));
  return Math.max(minimumWidth, (availableWidth - gap * (columns - 1)) / columns);
}
