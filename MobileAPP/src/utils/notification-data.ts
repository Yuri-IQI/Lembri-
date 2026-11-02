import type { AppNotificationData } from '@/types/notification';

/** Valida dados legados sem atribuir lembrete fictício aos avisos de exercícios. */
export function readNotificationData(value: unknown): AppNotificationData | null {
  if (!value || typeof value !== 'object') return null;
  const signature = 'assinatura' in value && typeof value.assinatura === 'string' ? value.assinatura : undefined;
  if ('kind' in value && value.kind === 'exercise') {
    return 'dateKey' in value && typeof value.dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.dateKey)
      ? { kind: 'exercise', dateKey: value.dateKey, assinatura: signature } : null;
  }
  if ('kind' in value && value.kind !== 'reminder') return null;
  return 'lembreteId' in value && typeof value.lembreteId === 'string'
    && 'ocorrencia' in value && typeof value.ocorrencia === 'string'
    ? { kind: 'kind' in value ? 'reminder' : undefined, lembreteId: value.lembreteId,
      ocorrencia: value.ocorrencia, assinatura: signature } : null;
}

/** Restringe cancelamentos aos identificadores conhecidos do Lembri, inclusive sufixos legados. */
export function isOwnedNotificationId(id: string): boolean {
  return /^lembri:exercise:\d{4}-\d{2}-\d{2}$/.test(id)
    || /^.+@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(#(?:adiado|reaviso|antes-1h|antes-1d))?$/.test(id);
}
