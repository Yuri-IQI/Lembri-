export const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const plural = (quantidade: number, singular: string, plural: string) =>
  `${quantidade} ${quantidade === 1 ? singular : plural}`;

export const formatarHora = (data: Date) =>
  `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
