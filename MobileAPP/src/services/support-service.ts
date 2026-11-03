import * as Linking from 'expo-linking';

import type { OpenContactResult, SupportContact } from '@/types/help';

export async function openSupportContact(
  contact: SupportContact,
  openURL: (url: string) => Promise<unknown> = Linking.openURL,
): Promise<OpenContactResult> {
  if (contact.kind === 'demo') {
    return { status: 'unavailable', message: 'Os contatos de suporte ainda não estão disponíveis.' };
  }
  const value = contact.kind === 'phone'
    ? contact.phoneNumber.replace(/[\s().-]/g, '')
    : contact.emailAddress.trim();
  const valid = contact.kind === 'phone' ? /^\+?\d{8,15}$/.test(value) : /^[^\s@?&#:]+@[^\s@?&#:]+\.[^\s@?&#:]+$/.test(value);
  if (!valid) return { status: 'unavailable', message: 'O contato de suporte ainda não está configurado corretamente.' };
  const url = contact.kind === 'phone' ? `tel:${value}` : `mailto:${encodeURIComponent(value)}`;
  try {
    await openURL(url);
    return { status: 'opened' };
  } catch {
    return { status: 'failed', message: 'Não foi possível abrir o aplicativo de contato. Use o contato exibido ou tente novamente.' };
  }
}
